import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EventEmailRequest {
  eventTitle: string;
  participantName: string;
  participantEmail: string;
  participantPhone?: string;
  registrationEmail: string;
  eventDate: string;
  eventLocation: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const {
      eventTitle,
      participantName,
      participantEmail,
      participantPhone,
      registrationEmail,
      eventDate,
      eventLocation,
    }: EventEmailRequest = await req.json();

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('de-CH', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const emailBody = `
Neue Anmeldung für Veranstaltung

Veranstaltung: ${eventTitle}
Datum: ${formatDate(eventDate)}
Ort: ${eventLocation}

Teilnehmer:
- Name: ${participantName}
- E-Mail: ${participantEmail}
${participantPhone ? `- Telefon: ${participantPhone}` : ''}

---
Diese E-Mail wurde automatisch vom Veranstaltungsformular auf vzv-huenenberg.ch generiert.
    `.trim();

    const confirmationEmailBody = `
Vielen Dank für Ihre Anmeldung!

Ihre Anmeldung für die folgende Veranstaltung wurde erfolgreich registriert:

Veranstaltung: ${eventTitle}
Datum: ${formatDate(eventDate)}
Ort: ${eventLocation}

Wir freuen uns auf Ihre Teilnahme!

Bei Fragen kontaktieren Sie uns bitte unter: ${registrationEmail}

Mit freundlichen Grüssen
Ihr VZV Hünenberg Team
    `.trim();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email service not configured"
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const notificationRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "VZV Hünenberg <noreply@vzv-huenenberg.ch>",
        to: [registrationEmail],
        reply_to: participantEmail,
        subject: `Neue Anmeldung: ${eventTitle}`,
        text: emailBody,
      }),
    });

    const notificationData = await notificationRes.json();

    if (!notificationRes.ok) {
      console.error("Resend API error (notification):", notificationData);
    }

    const confirmationRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "VZV Hünenberg <noreply@vzv-huenenberg.ch>",
        to: [participantEmail],
        subject: `Anmeldebestätigung: ${eventTitle}`,
        text: confirmationEmailBody,
      }),
    });

    const confirmationData = await confirmationRes.json();

    if (!confirmationRes.ok) {
      console.error("Resend API error (confirmation):", confirmationData);
    }

    return new Response(
      JSON.stringify({
        success: true,
        notificationId: notificationData.id,
        confirmationId: confirmationData.id,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending event email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
