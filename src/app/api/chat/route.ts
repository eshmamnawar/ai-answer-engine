import { NextResponse } from "next/server";
import { getGroqResponse } from "@/app/utils/groqClient";
import { scrapeUrl, urlPattern } from "../../utils/scraper";

export async function POST(request: Request) {  // Changed 'req' to 'request' since we use it
  try {
    const { message, messages } = await request.json();
    console.log("message received:", message);
    console.log("messages", messages);
    const url = message.match(urlPattern);

    let scrapedContent = " ";
    if (url) {
      console.log("url found", url);
      const scrapedResponse = await scrapeUrl(url);
      if (scrapedResponse) {
        scrapedContent = scrapedResponse.content;
        console.log("scraped content", scrapedContent);
      }
    }

    // Extract the user's query by removing the URL if present
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
  } catch (error: unknown) {  // Added type annotation and use error in console.log
    console.error("Error processing request:", error);
    return NextResponse.json({ message: "Error" });
  }
}


// import { NextResponse } from "next/server";
// import { getGroqResponse } from "@/app/utils/groqClient";
// import { scrapeUrl, urlPattern } from "../../utils/scraper";

// export async function POST(req: Request) {
//   try {
//     const { message, messages } = await req.json();
//     console.log("message received:", message);
//     console.log("messages", messages);
//     const url = message.match(urlPattern);

//     let scrapedContent = " ";
//     if (url) {
//       console.log("url found", url);
//       const scrapedResponse = await scrapeUrl(url);
//       console.log("scrapped content", scrapedContent);
//       if (scrapedResponse) {
//         scrapedContent = scrapedResponse.content;
//       }
//     }

//     //Extract the users query by removing the URL if present

//     const userQuery = message.replace(url ? url[0] : "", "").trim();

//     const userPrompt = `Answer my question: "${userQuery}
//     Based on the following content:
//     <content>
//     ${scrapedContent}
//     </content>`;

//     const llmMessages = [
//       ...messages,
//       {
//         role: "user",
//         content: userPrompt,
//       },
//     ];

//     const response = await getGroqResponse(llmMessages);

//     return NextResponse.json({ message: response });
//   } catch (error) {
//     return NextResponse.json({ message: "Error" });
//   }
// }
