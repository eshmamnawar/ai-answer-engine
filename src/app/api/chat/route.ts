import { NextResponse } from "next/server";
import { getGroqResponse } from "@/app/utils/groqClient";
import { scrapeUrl, urlPattern } from "../../utils/scraper";


export async function POST(req: Request) {
  try {
    const { message, messages } = await req.json();
    console.log("message received:", message);
    console.log("messages", messages);
    const url = message.match(urlPattern);

    let scrapedContent = " ";
    if (url) {
      console.log("url found", url);
      const scrapedResponse = await scrapeUrl(url);
      console.log("scrapped content", scrapedContent);
      if (scrapedResponse) {
        scrapedContent = scrapedResponse.content;
      }
    }

    //Extract the users query by removing the URL if present

    const userQuery = message.replace(url ? url[0] : "", "").trim();

    const userPrompt = `Answer my question: "${userQuery}
    Based on the following content:
    <content>
    ${scrapedContent}
    </content>`;

    const llmMessages = [
      ...messages,
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const response = await getGroqResponse(llmMessages);

    return NextResponse.json({ message: response });
  // And update your catch block to use the error:
  } catch (error: unknown) {
  console.error("Error processing request:", error);
  return NextResponse.json(
      { message: "An error occurred" }, 
      { status: 500 }
  );
}
}