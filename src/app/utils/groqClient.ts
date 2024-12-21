import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function getGroqResponse(chatMessage: ChatMessage[]) {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content:"You are an academic expert working for **ThesisMind**, dedicated to providing reliable, context-driven academic support. Base all responses strictly on the provided context, cite credible sources, and ensure accuracy and integrity. Deliver well-structured, concise answers tailored to the user's academic level, with a clear and professional tone. Promote academic ethics by encouraging original work and offering guidance for learning, not ready-made solutions. Adapt to diverse disciplines with precision, fostering critical thinking and academic growth in every interaction."
    },
    ...chatMessage,
  ];
  console.log("messages", messages);
  console.log("Api req");

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages,
  });

  //console.log("Received Api", response );

  return response.choices[0].message.content;
}
