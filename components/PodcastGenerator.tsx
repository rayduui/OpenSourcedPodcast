"use client"

import { useState } from "react"
import { generatePodcast } from "../app/actions"

export default function PodcastGenerator() {
  const [topic, setTopic] = useState("")
  const [result, setResult] = useState<{ conversation: string; audio_url: string | null } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const res = await generatePodcast(topic)
    setResult(res)
    setIsLoading(false)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter podcast topic"
          className="border p-2 mr-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Podcast"}
        </button>
      </form>
      {result && (
        <div>
          <h2 className="text-xl font-bold mb-2">Generated Transcript:</h2>
          <pre className="bg-gray-100 p-4 rounded mb-4 whitespace-pre-wrap">{result.conversation}</pre>
          {result.audio_url && (
            <div>
              <h2 className="text-xl font-bold mb-2">Generated Audio:</h2>
              <audio controls src={result.audio_url} className="w-full" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

