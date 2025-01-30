"use server"

import { ChatOpenAI } from "@langchain/openai"
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {fal}  from "@fal-ai/client"

fal.config({
  credentials: process.env.FAL_KEY,
});

const podcastTemplate = ChatPromptTemplate.fromTemplate(`
  Create an engaging conversation between two speakers discussing the topic: {topic}

  Requirements:
  - Generate exactly 5 back-and-forth exchanges
  - Make it natural and conversational
  - Include specific details about the {topic}
  - Each line should start with either "Speaker 1:" or "Speaker 2:"

  Here's an example of the format (but create NEW content about {topic}, don't copy this example):
  Speaker 1: [First speaker's line]
  Speaker 2: [Second speaker's line]

  The response of the each speaker should be at most 20 words. The conversation has to be insightful, engaging, explanatory, deep diving and educational.

  It should be in the style of a podcast where one speaker slightly is more knowledgeable than the other.

  You are allowed to write only in the below format. Just give the output in the below format in a single string. No additional delimiters.

  The content should be explanatory, deep diving and educational.

  Speaker 1: Hey, did you catch the game last night?
  Speaker 2: Of course! What a match—it had me on the edge of my seat.
  Speaker 1: Same here! That last-minute goal was unreal. Who's your MVP?
  Speaker 2: Gotta be the goalie. Those saves were unbelievable.

  Remember: Create completely new dialogue about {topic}, don't use the above example.
`)

const llm = new ChatOpenAI({
  modelName: "deepseek/deepseek-chat",
  openAIApiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
})

async function generatePodcastTranscript(topic: string) {
  const chain = podcastTemplate.pipe(llm)
  const response = await chain.invoke({ topic })
  return response.content
}

export async function generatePodcast(topic: string) {
  console.log(`🎙️ Generating podcast transcript about: ${topic}`)

  const transcript = await generatePodcastTranscript(topic)

  console.log("✍️ Generated transcript:")
  console.log(transcript)

  console.log("🔊 Converting transcript to audio...")

  try {
    const result = await fal.subscribe("fal-ai/playai/tts/dialog", {
      input: {
        input: String(transcript),
        voices: [
          {
            voice: "Jennifer (English (US)/American)",
            turn_prefix: "Speaker 1: ",
          },
          {
            voice: "Dexter (English (US)/American)",
            turn_prefix: "Speaker 2: ",
          },
        ],
      },
      logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
    })
    const audioUrl = result.data.audio.url
    
    console.log("✅ Audio generation complete!")
    console.log(`🔗 Audio URL: ${audioUrl}`)

    return {
      conversation: transcript,
      audio_url: audioUrl,
    }
  } catch (error) {
    console.error("❌ Error generating audio:", error)
    return {
      conversation: transcript,
      audio_url: null,
      error: String(error),
    }
  }
}

