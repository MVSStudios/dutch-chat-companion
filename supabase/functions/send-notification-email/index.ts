import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface NotificationRequest {
  type: "quote" | "contact" | "purchase" | "montage";
  data: Record<string, string>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: NotificationRequest = await req.json();

    let subject = "";
    let html = "";

    switch (type) {
      case "quote":
        subject = `Nieuwe offerte-aanvraag van ${data.name}`;
        html = `
          <h2>Nieuwe offerte-aanvraag</h2>
          <p><strong>Naam:</strong> ${data.name}</p>
          <p><strong>E-mail:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Telefoon:</strong> ${data.phone}</p>` : ""}
          ${data.motorhome ? `<p><strong>Motorhome:</strong> ${data.motorhome}</p>` : ""}
          ${data.message ? `<p><strong>Bericht:</strong> ${data.message}</p>` : ""}
        `;
        break;
      case "contact":
        subject = `Nieuw contactbericht van ${data.name}`;
        html = `
          <h2>Nieuw contactbericht</h2>
          <p><strong>Naam:</strong> ${data.name}</p>
          <p><strong>E-mail:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Telefoon:</strong> ${data.phone}</p>` : ""}
          ${data.subject ? `<p><strong>Onderwerp:</strong> ${data.subject}</p>` : ""}
          <p><strong>Bericht:</strong> ${data.message}</p>
        `;
        break;
      case "purchase":
        subject = `Nieuwe aankoopaanvraag van ${data.name}`;
        html = `
          <h2>Nieuwe aankoopaanvraag (camper verkoop)</h2>
          <p><strong>Naam:</strong> ${data.name}</p>
          <p><strong>E-mail:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Telefoon:</strong> ${data.phone}</p>` : ""}
          <p><strong>Merk:</strong> ${data.brand}</p>
          <p><strong>Model:</strong> ${data.model}</p>
          <p><strong>Bouwjaar:</strong> ${data.year}</p>
          ${data.mileage ? `<p><strong>Kilometerstand:</strong> ${data.mileage}</p>` : ""}
          ${data.fuel_type ? `<p><strong>Brandstof:</strong> ${data.fuel_type}</p>` : ""}
          ${data.description ? `<p><strong>Beschrijving:</strong> ${data.description}</p>` : ""}
          ${data.message ? `<p><strong>Extra bericht:</strong> ${data.message}</p>` : ""}
        `;
        break;
      case "montage":
        subject = `Nieuwe montage-afspraak van ${data.name}`;
        html = `
          <h2>Nieuwe montage-afspraak</h2>
          <p><strong>Naam:</strong> ${data.name}</p>
          <p><strong>E-mail:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Telefoon:</strong> ${data.phone}</p>` : ""}
          <p><strong>Type dienst:</strong> ${data.service_type}</p>
          ${data.preferred_date ? `<p><strong>Voorkeursdatum:</strong> ${data.preferred_date}</p>` : ""}
          ${data.preferred_time ? `<p><strong>Voorkeurstijd:</strong> ${data.preferred_time}</p>` : ""}
          ${data.motorhome_info ? `<p><strong>Motorhome info:</strong> ${data.motorhome_info}</p>` : ""}
          ${data.message ? `<p><strong>Bericht:</strong> ${data.message}</p>` : ""}
        `;
        break;
      default:
        throw new Error("Unknown notification type");
    }

    const emailResponse = await resend.emails.send({
      from: "J&C Motorhomes <noreply@jc-motorhomes.be>",
      to: ["info@jc-motorhomes.be"],
      subject,
      html,
    });

    console.log("Email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
