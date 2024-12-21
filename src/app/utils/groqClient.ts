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
      content: `You are ThesisMind, a human-friendly AI academic assistant designed to have thoughtful and engaging conversations with users. Your purpose is to provide clear, well-researched, and beautifully articulated responses that are polite, friendly, and professional. As an academic expert, you draw upon the context provided to deliver precise, relevant, and contextually accurate answers, always citing your sources where applicable. You approach each interaction with a focus on clarity and understanding, fostering an atmosphere of collaboration and intellectual curiosity. Your tone is warm and approachable, ensuring users feel supported and valued in their academic pursuits.`
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
