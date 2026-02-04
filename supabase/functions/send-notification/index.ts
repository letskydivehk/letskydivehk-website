import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface NotificationRequest {
  type: "booking" | "registration";
  data: {
    // For bookings
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    locationName?: string;
    serviceName?: string;
    preferredDate?: string;
    participants?: number;
    specialRequests?: string;
    // For registrations
    fullName?: string;
    registrationEmail?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: NotificationRequest = await req.json();

    if (!type || !data) {
      throw new Error("Missing required fields: type and data");
    }

    let subject: string;
    let htmlContent: string;

    if (type === "booking") {
      subject = `🪂 New Booking Request - ${data.firstName} ${data.lastName}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a2e; border-bottom: 2px solid #16213e; padding-bottom: 10px;">
            🪂 New Booking Request
          </h1>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #16213e; margin-top: 0;">Customer Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 40%;">Name:</td>
                <td style="padding: 8px 0;">${data.firstName} ${data.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                <td style="padding: 8px 0;"><a href="tel:${data.phone}">${data.phone}</a></td>
              </tr>
            </table>
          </div>

          <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #16213e; margin-top: 0;">Booking Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 40%;">Location:</td>
                <td style="padding: 8px 0;">${data.locationName || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Service:</td>
                <td style="padding: 8px 0;">${data.serviceName || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Preferred Date:</td>
                <td style="padding: 8px 0;">${data.preferredDate || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Participants:</td>
                <td style="padding: 8px 0;">${data.participants || 1}</td>
              </tr>
            </table>
          </div>

          ${data.specialRequests ? `
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #16213e; margin-top: 0;">Special Requests</h2>
            <p style="margin: 0;">${data.specialRequests}</p>
          </div>
          ` : ""}

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated notification from Let's Skydive HK booking system.
          </p>
        </div>
      `;
    } else if (type === "registration") {
      subject = `👤 New Member Registration - ${data.fullName || data.registrationEmail}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a2e; border-bottom: 2px solid #16213e; padding-bottom: 10px;">
            👤 New Member Registration
          </h1>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #16213e; margin-top: 0;">Member Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 40%;">Name:</td>
                <td style="padding: 8px 0;">${data.fullName || "Not provided"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${data.registrationEmail}">${data.registrationEmail}</a></td>
              </tr>
            </table>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated notification from Let's Skydive HK member system.
          </p>
        </div>
      `;
    } else {
      throw new Error("Invalid notification type");
    }

    // Send email to letskydivehk.com
    const emailResponse = await resend.emails.send({
      from: "Let's Skydive HK <noreply@letskydivehk.com>",
      to: ["info@letskydivehk.com"],
      subject: subject,
      html: htmlContent,
    });

    console.log("Notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    console.error("Error in send-notification function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
