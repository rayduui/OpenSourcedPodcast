"use server"

import { ChatOpenAI } from "@langchain/openai"
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {fal}  from "@fal-ai/client"
import { PROMPTS } from './prompts'

fal.config({
  credentials: process.env.FAL_KEY,
});

const llm = new ChatOpenAI({
  modelName: "deepseek/deepseek-chat",
  openAIApiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
})

function formatPrompt(template: string, variables: Record<string, string>): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(`{${key}}`, value)
  }
  return result
}

async function generatePodcastTranscript(topic: string): Promise<string> {
  const prompt = formatPrompt(PROMPTS.podcast.template, { topic })
  const chain = ChatPromptTemplate.fromTemplate(prompt).pipe(llm)
  const response = await chain.invoke({ topic })
  return response.content as string
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

