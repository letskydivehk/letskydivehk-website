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

 // Simple input sanitization to prevent XSS in email content
 function sanitizeInput(input: string | undefined | null): string {
   if (!input) return "";
   return String(input)
     .replace(/&/g, "&amp;")
     .replace(/</g, "&lt;")
     .replace(/>/g, "&gt;")
     .replace(/"/g, "&quot;")
     .replace(/'/g, "&#039;")
     .slice(0, 500); // Limit length
 }
 
 // Validate email format
 function isValidEmail(email: string | undefined): boolean {
   if (!email) return false;
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email) && email.length <= 255;
 }
 
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
     // Only allow POST requests
     if (req.method !== "POST") {
       return new Response(
         JSON.stringify({ success: false, error: "Method not allowed" }),
         { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
       );
     }
 
    const { type, data }: NotificationRequest = await req.json();

    if (!type || !data) {
       return new Response(
         JSON.stringify({ success: false, error: "Invalid request" }),
         { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
       );
     }
 
     // Validate notification type
     if (type !== "booking" && type !== "registration") {
       return new Response(
         JSON.stringify({ success: false, error: "Invalid notification type" }),
         { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
       );
     }
 
     // For registration notifications, require authentication
     if (type === "registration") {
       const authHeader = req.headers.get("authorization");
       if (!authHeader || !authHeader.startsWith("Bearer ")) {
         return new Response(
           JSON.stringify({ success: false, error: "Unauthorized" }),
           { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
         );
       }
 
       // Verify the JWT token
       const supabaseClient = createClient(
         Deno.env.get("SUPABASE_URL") ?? "",
         Deno.env.get("SUPABASE_ANON_KEY") ?? "",
         { global: { headers: { Authorization: authHeader } } }
       );
 
       const token = authHeader.replace("Bearer ", "");
       const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
       
       if (claimsError || !claimsData?.claims) {
         console.error("Auth error:", claimsError);
         return new Response(
           JSON.stringify({ success: false, error: "Invalid token" }),
           { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
         );
       }
 
       // Verify email from token matches request
       const tokenEmail = claimsData.claims.email;
       if (tokenEmail !== data.registrationEmail) {
         return new Response(
           JSON.stringify({ success: false, error: "Email mismatch" }),
           { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
         );
       }
     }
 
     // For booking notifications, validate required fields
     if (type === "booking") {
       if (!data.email || !isValidEmail(data.email)) {
         return new Response(
           JSON.stringify({ success: false, error: "Invalid email" }),
           { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
         );
       }
       if (!data.firstName || !data.lastName) {
         return new Response(
           JSON.stringify({ success: false, error: "Missing required booking fields" }),
           { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
         );
       }
    }

    let subject: string;
    let htmlContent: string;

    if (type === "booking") {
       // Sanitize all user inputs
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
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 40%;">Name:</td>
                 <td style="padding: 8px 0;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                 <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                 <td style="padding: 8px 0;"><a href="tel:${phone}">${phone}</a></td>
              </tr>
            </table>
          </div>

          <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #16213e; margin-top: 0;">Booking Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 40%;">Location:</td>
                 <td style="padding: 8px 0;">${locationName || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Service:</td>
                 <td style="padding: 8px 0;">${serviceName || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Preferred Date:</td>
                 <td style="padding: 8px 0;">${preferredDate || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Participants:</td>
                 <td style="padding: 8px 0;">${participants}</td>
              </tr>
            </table>
          </div>

          ${
             specialRequests
              ? `
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #16213e; margin-top: 0;">Special Requests</h2>
             <p style="margin: 0;">${specialRequests}</p>
          </div>
          `
              : ""
          }

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated notification from Let's Skydive HK booking system.
          </p>
        </div>
      `;
     } else {
       // type === "registration" (validated earlier)
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
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 40%;">Name:</td>
                 <td style="padding: 8px 0;">${fullName || "Not provided"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                 <td style="padding: 8px 0;"><a href="mailto:${registrationEmail}">${registrationEmail}</a></td>
              </tr>
            </table>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated notification from Let's Skydive HK member system.
          </p>
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

    // Send confirmation email to customer (only for bookings)
    let customerEmailResponse = null;
    if (type === "booking" && data.email && isValidEmail(data.email)) {
      const customerSubject = `🪂 Booking Confirmation - Let's Skydive HK`;
      const customerHtmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🪂 Booking Confirmed!</h1>
            <p style="color: #a0a0a0; margin-top: 10px;">Thank you for choosing Let's Skydive HK</p>
          </div>
          
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #333;">Hi ${sanitizeInput(data.firstName)},</p>
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              We've received your booking request and our team will be in touch shortly to confirm your adventure!
            </p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #16213e; margin-top: 0; font-size: 18px;">📋 Booking Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #666; width: 40%;">Location:</td>
                  <td style="padding: 8px 0; color: #333;">${sanitizeInput(data.locationName) || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Service:</td>
                  <td style="padding: 8px 0; color: #333;">${sanitizeInput(data.serviceName) || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Preferred Date:</td>
                  <td style="padding: 8px 0; color: #333;">${sanitizeInput(data.preferredDate) || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Participants:</td>
                  <td style="padding: 8px 0; color: #333;">${Math.min(Math.max(1, data.participants || 1), 100)}</td>
                </tr>
              </table>
            </div>

            <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
              <h3 style="color: #2e7d32; margin-top: 0; font-size: 16px;">📞 What's Next?</h3>
              <p style="color: #333; margin-bottom: 0; line-height: 1.6;">
                Our team will contact you within 24-48 hours to confirm availability and finalize your booking. 
                If you have any questions, feel free to reply to this email or contact us directly.
              </p>
            </div>

            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Get ready for the adventure of a lifetime! 🎉
            </p>
            <p style="font-size: 14px; color: #333;">
              Best regards,<br/>
              <strong>The Let's Skydive HK Team</strong>
            </p>
          </div>

          <div style="background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Let's Skydive HK. All rights reserved.
            </p>
            <p style="color: #999; font-size: 11px; margin-top: 10px;">
              This is an automated confirmation email. Please do not reply directly to this email.
            </p>
          </div>
        </div>
      `;

      customerEmailResponse = await resend.emails.send({
        from: "Let's Skydive HK <noreply@letskydivehk.com>",
        to: [data.email],
        subject: customerSubject,
        html: customerHtmlContent,
      });

      console.log("Customer confirmation email sent successfully:", customerEmailResponse);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: { 
        admin: adminEmailResponse, 
        customer: customerEmailResponse 
      } 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    console.error("Error in send-notification function:", error);
     // Return generic error message, log details server-side
     return new Response(JSON.stringify({ success: false, error: "Failed to send notification" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
