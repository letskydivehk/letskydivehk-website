import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface NotificationRequest {
  type: "booking" | "registration";
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    locationName?: string;
    serviceName?: string;
    preferredDate?: string;
    participants?: number;
    specialRequests?: string;
    selectedPromos?: string[];
    fullName?: string;
    registrationEmail?: string;
  };
}

function sanitizeInput(input: string | undefined | null): string {
  if (!input) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .slice(0, 500);
}

function isValidEmail(email: string | undefined): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { type, data }: NotificationRequest = await req.json();

    if (!type || !data) {
      return new Response(JSON.stringify({ success: false, error: "Invalid request" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (type !== "booking" && type !== "registration") {
      return new Response(JSON.stringify({ success: false, error: "Invalid notification type" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // For registration notifications, require authentication
    if (type === "registration") {
      const authHeader = req.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
        global: { headers: { Authorization: authHeader } },
      });

      const { data: userData, error: userError } = await supabaseClient.auth.getUser();

      if (userError || !userData?.user) {
        console.error("Auth error:", userError);
        return new Response(JSON.stringify({ success: false, error: "Invalid token" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const tokenEmail = userData.user.email;
      if (tokenEmail !== data.registrationEmail) {
        return new Response(JSON.stringify({ success: false, error: "Email mismatch" }), {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    // For booking notifications, validate required fields
    if (type === "booking") {
      if (!data.email || !isValidEmail(data.email)) {
        return new Response(JSON.stringify({ success: false, error: "Invalid email" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      if (!data.firstName || !data.lastName) {
        return new Response(JSON.stringify({ success: false, error: "Missing required booking fields" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    let subject: string;
    let htmlContent: string;

    if (type === "booking") {
      const firstName = sanitizeInput(data.firstName);
      const lastName = sanitizeInput(data.lastName);
      const email = sanitizeInput(data.email);
      const phone = sanitizeInput(data.phone);
      const locationName = sanitizeInput(data.locationName);
      const serviceName = sanitizeInput(data.serviceName);
      const preferredDate = sanitizeInput(data.preferredDate);
      const participants = Math.min(Math.max(1, data.participants || 1), 100);
      const specialRequests = sanitizeInput(data.specialRequests);

      subject = `🪂 New Booking Request - ${firstName} ${lastName}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a2e; border-bottom: 2px solid #16213e; padding-bottom: 10px;">
            🪂 New Booking Request
          </h1>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #16213e; margin-top: 0;">Customer Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; width: 40%;">Name:</td><td style="padding: 8px 0;">${firstName} ${lastName}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${phone}">${phone}</a></td></tr>
            </table>
          </div>
          <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #16213e; margin-top: 0;">Booking Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; width: 40%;">Location:</td><td style="padding: 8px 0;">${locationName || "N/A"}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Service:</td><td style="padding: 8px 0;">${serviceName || "N/A"}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Preferred Date:</td><td style="padding: 8px 0;">${preferredDate || "N/A"}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Participants:</td><td style="padding: 8px 0;">${participants}</td></tr>
            </table>
          </div>
          ${specialRequests ? `<div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;"><h2 style="color: #16213e; margin-top: 0;">Special Requests</h2><p style="margin: 0;">${specialRequests}</p></div>` : ""}
          ${data.selectedPromos && data.selectedPromos.length > 0 ? `<div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;"><h2 style="color: #16213e; margin-top: 0;">🎟️ Selected Promotions</h2><ul style="margin: 0; padding-left: 20px;">${data.selectedPromos.map((p: string) => `<li style="padding: 4px 0;">${sanitizeInput(p)}</li>`).join("")}</ul></div>` : ""}
          <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated notification from Let's Skydive HK booking system.</p>
        </div>
      `;
    } else {
      const fullName = sanitizeInput(data.fullName);
      const registrationEmail = sanitizeInput(data.registrationEmail);

      subject = `👤 New Member Registration - ${fullName || registrationEmail}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a2e; border-bottom: 2px solid #16213e; padding-bottom: 10px;">
            👤 New Member Registration
          </h1>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #16213e; margin-top: 0;">Member Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; width: 40%;">Name:</td><td style="padding: 8px 0;">${fullName || "Not provided"}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${registrationEmail}">${registrationEmail}</a></td></tr>
            </table>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated notification from Let's Skydive HK member system.</p>
        </div>
      `;
    }

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Let's Skydive HK <noreply@letskydivehk.com>",
      to: ["letskydivehk@gmail.com"],
      subject: subject,
      html: htmlContent,
    });

    console.log("Admin notification email sent successfully:", adminEmailResponse);

    // Delay to avoid Resend rate limit (2 req/sec on free tier)
    await new Promise(resolve => setTimeout(resolve, 1100));

    // Send confirmation email to customer
    let customerEmailResponse = null;

    if (type === "booking" && data.email && isValidEmail(data.email)) {
      const customerHtmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🪂 Booking Confirmed!</h1>
            <p style="color: #a0a0a0; margin-top: 10px;">Thank you for choosing Let's Skydive HK</p>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #333;">Hi ${sanitizeInput(data.firstName)},</p>
            <p style="font-size: 16px; color: #333; line-height: 1.6;">We've received your booking request and our team will be in touch shortly to confirm your adventure!</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #16213e; margin-top: 0; font-size: 18px;">📋 Booking Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold; color: #666; width: 40%;">Location:</td><td style="padding: 8px 0; color: #333;">${sanitizeInput(data.locationName) || "N/A"}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Service:</td><td style="padding: 8px 0; color: #333;">${sanitizeInput(data.serviceName) || "N/A"}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Preferred Date:</td><td style="padding: 8px 0; color: #333;">${sanitizeInput(data.preferredDate) || "N/A"}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Participants:</td><td style="padding: 8px 0; color: #333;">${Math.min(Math.max(1, data.participants || 1), 100)}</td></tr>
              </table>
            </div>
            <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
              <h3 style="color: #2e7d32; margin-top: 0; font-size: 16px;">📞 What's Next?</h3>
              <p style="color: #333; margin-bottom: 0; line-height: 1.6;">Our team will contact you within 24-48 hours to confirm availability and finalize your booking.</p>
            </div>
            <p style="font-size: 14px; color: #333;">Best regards,<br/><strong>The Let's Skydive HK Team</strong></p>
          </div>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Let's Skydive HK. All rights reserved.</p>
          </div>
        </div>
      `;

      customerEmailResponse = await resend.emails.send({
        from: "Let's Skydive HK <noreply@letskydivehk.com>",
        to: [data.email],
        subject: `🪂 Booking Confirmation - Let's Skydive HK`,
        html: customerHtmlContent,
      });
      console.log("Customer booking confirmation email sent:", customerEmailResponse);
    }

    // Send welcome email to new registrations (with rate limit delay)
    if (type === "registration" && data.registrationEmail && isValidEmail(data.registrationEmail)) {
      await new Promise(resolve => setTimeout(resolve, 1100));
      const welcomeName = sanitizeInput(data.fullName) || "Adventurer";
      const welcomeHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 32px;">🪂 Welcome to Let's Skydive HK!</h1>
            <p style="color: #cbd5e1; margin-top: 12px; font-size: 16px;">Your adventure starts here</p>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 18px; color: #333;">Hi ${welcomeName},</p>
            <p style="font-size: 16px; color: #555; line-height: 1.7;">
              Thank you for joining the Let's Skydive HK family! 🎉 We're thrilled to have you on board.
            </p>
            <p style="font-size: 16px; color: #555; line-height: 1.7;">
              As a member, you can manage your bookings, save your profile details, and get exclusive updates on our latest jump events.
            </p>

            <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); padding: 24px; border-radius: 12px; margin: 24px 0; text-align: center;">
              <h2 style="color: #1e40af; margin-top: 0; font-size: 20px;">🌟 What You Can Do</h2>
              <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <tr><td style="padding: 10px 8px; color: #333;">✈️ Book tandem skydives at stunning locations</td></tr>
                <tr><td style="padding: 10px 8px; color: #333;">🎓 Enroll in A-Licence training courses</td></tr>
                <tr><td style="padding: 10px 8px; color: #333;">👥 Organize group events & team building</td></tr>
                <tr><td style="padding: 10px 8px; color: #333;">📸 Access your jump photos & videos</td></tr>
              </table>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://letskydivehk.com" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                Explore Our Services
              </a>
            </div>

            <p style="font-size: 14px; color: #555; line-height: 1.6;">
              Have questions? Reply to this email or reach us on 
              <a href="https://wa.me/85269391570" style="color: #2563eb;">WhatsApp</a>. 
              We're always happy to help!
            </p>
            <p style="font-size: 14px; color: #333; margin-top: 24px;">
              See you in the sky! 🌤️<br/>
              <strong>The Let's Skydive HK Team</strong>
            </p>
          </div>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Let's Skydive HK. All rights reserved.</p>
            <p style="color: #999; font-size: 11px; margin-top: 8px;">
              Follow us on <a href="https://www.instagram.com/lets_skydive_hk/" style="color: #2563eb;">Instagram</a>
            </p>
          </div>
        </div>
      `;

      const welcomeEmailResponse = await resend.emails.send({
        from: "Let's Skydive HK <noreply@letskydivehk.com>",
        to: [data.registrationEmail],
        subject: `🪂 Welcome to Let's Skydive HK! Your adventure starts here`,
        html: welcomeHtml,
      });
      console.log("Welcome email sent to new member:", welcomeEmailResponse);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: { admin: adminEmailResponse, customer: customerEmailResponse },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error: unknown) {
    console.error("Error in send-notification function:", error);
    return new Response(JSON.stringify({ success: false, error: "Failed to send notification" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
