import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AIRWALLEX_BASE_URL = "https://api.airwallex.com/api/v1";

async function getAirwallexToken(): Promise<string> {
  const clientId = Deno.env.get("AIRWALLEX_CLIENT_ID");
  const apiKey = Deno.env.get("AIRWALLEX_API_KEY");

  if (!clientId || !apiKey) {
    throw new Error("Airwallex credentials not configured");
  }

  const res = await fetch(`${AIRWALLEX_BASE_URL}/authentication/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": clientId,
      "x-api-key": apiKey,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airwallex auth failed: ${res.status} ${body}`);
  }

  const data = await res.json();
  return data.token;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { payment_intent_id, booking_id } = await req.json();

    if (!payment_intent_id || typeof payment_intent_id !== "string") {
      return new Response(
        JSON.stringify({ error: "payment_intent_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize: only allow alphanumeric, hyphens, underscores
    if (!/^[a-zA-Z0-9_-]+$/.test(payment_intent_id)) {
      return new Response(
        JSON.stringify({ error: "Invalid payment_intent_id format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = await getAirwallexToken();

    const res = await fetch(
      `${AIRWALLEX_BASE_URL}/pa/payment_intents/${encodeURIComponent(payment_intent_id)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const body = await res.text();
      console.error("Airwallex verify failed:", res.status, body);
      return new Response(
        JSON.stringify({ error: "Failed to verify payment", verified: false }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const intent = await res.json();
    const verified = intent.status === "SUCCEEDED";

    // If payment is verified and booking_id provided, update the booking server-side
    if (verified && booking_id && typeof booking_id === "string") {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, serviceRoleKey);

      // SECURITY: Verify the booking has this payment_intent_id stored before marking paid
      // Prevents reusing a single succeeded payment to mark a different booking as paid.
      const { data: bookingRow, error: fetchErr } = await supabase
        .from("bookings")
        .select("id, payment_intent_id, payment_status")
        .eq("id", booking_id)
        .maybeSingle();

      if (fetchErr) {
        console.error("Failed to load booking:", fetchErr.message);
      } else if (!bookingRow) {
        console.error("Booking not found for verify-payment:", booking_id);
      } else if (bookingRow.payment_intent_id !== payment_intent_id) {
        console.error("Payment intent does not match booking's stored intent");
        return new Response(
          JSON.stringify({ error: "Payment intent does not match this booking", verified: false }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        const { error: updateError } = await supabase
          .from("bookings")
          .update({ payment_status: "paid" })
          .eq("id", booking_id)
          .eq("payment_intent_id", payment_intent_id)
          .is("payment_status", null);

        if (updateError) {
          console.error("Failed to update booking payment status:", updateError.message);
        }
      }

      if (updateError) {
        console.error("Failed to update booking payment status:", updateError.message);
      }
    }

    return new Response(
      JSON.stringify({
        status: intent.status,
        verified,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", verified: false }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
