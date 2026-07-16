// Netlify Function: ask-question
// Keeps the OpenAI API key on the server side (never exposed to the browser).
// The frontend (ask.html) POSTs { question, history } here and gets back { reply }.

const SYSTEM_PROMPT = `You are the support assistant inside the Stickler Properties app.

About Stickler Properties:
- Stickler Properties is an off-market real estate investment marketplace. It connects real estate investors with off-market wholesale deals (properties not listed on the open MLS market), similar in concept to companies like New Western.
- It is an investor-only marketplace. New users must register and go through a verification/disclosure process before they get full access to listings.
- After registering, a Stickler agent contacts the new user to set up a quick onboarding call before granting marketplace access.
- Users can also reach a Stickler agent directly at (404) 555-0182.
- Currently available markets: Atlanta, GA and Augusta, GA. More markets will be added over time.

How the app works:
- The "Marketplace" tab has two views: a Map view (pins showing price on a map of the current market) and a List view (scrollable cards, sortable by price/beds/baths/square feet). Users can switch between them and search a different city.
- Tapping a listing (from either the map or the list) opens a detail view with a photo, price, address, beds/baths/square feet, and a "Get Funding" button — this starts the financing conversation with Stickler (this flow is still being built).
- The "Account" tab has: Account Details (personal info), My Markets (which markets a user is disclosed/verified for), and Documents (legal disclosures like the Privacy Policy and Terms of Use).
- The "Support" tab (where this chat lives) also has a "Messages" option for direct messaging with the Stickler team.

Your job:
- Answer questions about Stickler Properties, how the app works, the investment/off-market real estate process, and general real estate investing questions a user of this app might reasonably ask.
- Keep answers short, friendly, and clear — this is a mobile chat window, not a long-form article.
- If someone asks something completely unrelated to Stickler, real estate investing, or the app, politely redirect them back to what you can help with. Don't pretend to be a general-purpose assistant.
- If you don't know something specific (like the status of a particular user's account or a specific property), tell them to reach out to a Stickler agent at (404) 555-0182 or use the Messages option instead of guessing.`;

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let question, history;
  try {
    var body = JSON.parse(event.body || "{}");
    question = body.question;
    history = Array.isArray(body.history) ? body.history : [];
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  if (!question || typeof question !== "string") {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing question" }) };
  }

  var apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server is missing OPENAI_API_KEY. Add it in Netlify site settings under Environment variables." })
    };
  }

  var messages = [{ role: "system", content: SYSTEM_PROMPT }]
    .concat(history.map(function (m) { return { role: m.role, content: m.content }; }))
    .concat([{ role: "user", content: question }]);

  try {
    var response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.4,
        max_tokens: 400
      })
    });

    var data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: (data.error && data.error.message) || "OpenAI request failed" })
      };
    }

    var reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: reply || "Sorry, I didn't catch that — could you try rephrasing?" })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Something went wrong reaching OpenAI." }) };
  }
};
