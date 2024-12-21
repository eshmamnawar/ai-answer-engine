import { NextResponse } from "next/server"
import { getGroqResponse } from "@/app/utils/groqClient"
import { scrapeUrl, urlPattern } from "@/app/utils/scraper"

export async function POST(req: Request) {
  try {
    const { message, messages } = await req.json()

    console.log("Message received: ", message)
    console.log("Previous messages: ", messages)

    // Extract the URL from the message
    const urlMatch = message.match(urlPattern);
    let scrapedContent = "";

    if (urlMatch && urlMatch.length > 0) {
      const url = urlMatch[0]; // Access the first match as a string
      console.log("Url Found: ", url);

    
      const scraperResponse = await scrapeUrl(url);
      console.log("Scraped content: ", scrapedContent)
      if (scraperResponse){
        scrapedContent = scraperResponse.content;
      }
    }

    const userQuery = message.replace(urlMatch ? urlMatch[0] : '', '').trim();

    const userPrompt = `
    Answer my question: "${userQuery}"

    Based on the following content:
    <content>
      "${scrapedContent}"
    </content>
    `

    const llmMessages = [
      ...messages,
      {
        role: "user",
        content: userPrompt,
      }
    ]

    const response = await getGroqResponse(llmMessages);

    return NextResponse.json({ message: response })

  } catch (error) {
    return NextResponse.json({message: "Error"})
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
//     const urlMatch = message.match(urlPattern);
//     const url = urlMatch ? urlMatch[0] : null; // Get the first match or null

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
//   // And update your catch block to use the error:
//   } catch (error: unknown) {
//   console.error("Error processing request:", error);
//   return NextResponse.json(
//       { message: "An error occurred" }, 
//       { status: 500 }
//   );
// }
// }