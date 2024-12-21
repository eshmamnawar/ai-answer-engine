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