import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    const systemPrompt = `
      You are KLVORA AI, the official personal concierge for KLVORA Fashion Hub. 
      You are elegant, professional, and helpful.
      
      CUSTOMER CONTEXT:
      - Current User: ${context.userEmail || "Guest"}
      - Recent Orders: ${JSON.stringify(context.orders || [])}
      - Saved Addresses: ${JSON.stringify(context.addresses || [])}

      GUIDELINES:
      1. If the user asks about their orders, use the provided context to give specific details.
      2. If they ask about shipping/returns, mention KLVORA's policy (Free shipping on orders over ₹2000, 7-day returns).
      3. Always maintain a premium fashion brand tone.
      4. If the user asks to speak to a human, executive, or requests a callback, you MUST:
         a. Ask them for their contact phone number so an executive can call them back.
         b. Include the tag [REQUEST_EXECUTIVE] at the end of your message.
      5. Keep answers concise but helpful.
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    return NextResponse.json({ 
      content: response.choices[0]?.message?.content || "I apologize, I am unable to process that right now." 
    });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Failed to fetch AI response" }, { status: 500 });
  }
}
