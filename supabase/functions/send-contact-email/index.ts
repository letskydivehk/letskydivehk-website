import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: "aff" | "group" | "general";
  message: string;
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
    .slice(0, 1000); // Limit length
}

// Validate email format
function isValidEmail(email: string | undefined): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

// Get subject label
function getSubjectLabel(subject: string): string {
  switch (subject) {
    case "aff":
      return "AFF Program Enquiry";
    case "group":
      return "Group Event Enquiry";
    case "general":
    default:
      return "General Enquiry";
  }
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

    const data: ContactFormData = await req.json();

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email format
    if (!isValidEmail(data.email)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize all user inputs
    const name = sanitizeInput(data.name);
    const email = sanitizeInput(data.email);
    const phone = sanitizeInput(data.phone);
    const subject = data.subject || "general";
    const message = sanitizeInput(data.message);
    const subjectLabel = getSubjectLabel(subject);

    const emailSubject = `📩 ${subjectLabel} - ${name}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a2e; border-bottom: 2px solid #16213e; padding-bottom: 10px;">
          📩 New Contact Form Submission
        </h1>
        
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
          <strong>Subject Type:</strong> ${subjectLabel}
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #16213e; margin-top: 0;">Contact Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 30%;">Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0;"><a href="tel:${phone}">${phone}</a></td>
            </tr>
            ` : ""}
          </table>
        </div>

        <div style="background: #fff8e1; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #16213e; margin-top: 0;">Message</h2>
          <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px;">
            <strong>💡 Quick Reply:</strong> Click <a href="mailto:${email}?subject=Re: ${subjectLabel}">here to reply</a> directly to the customer.
          </p>
        </div>

        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This enquiry was submitted via the Let's Skydive HK website contact form on ${new Date().toLocaleString("en-HK", { timeZone: "Asia/Hong_Kong" })}.
        </p>
      </div>
    `;

    // Send email to admin
    const emailResponse = await resend.emails.send({
      from: "Let's Skydive HK <noreply@letskydivehk.com>",
      to: ["letskydivehk@gmail.com"],
      replyTo: data.email,
      subject: emailSubject,
      html: htmlContent,
    });

    console.log("Contact form email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to send message" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
