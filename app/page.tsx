import PodcastGenerator from "../components/PodcastGenerator"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">AI Podcast Generator</h1>
      <PodcastGenerator />
    </main>
  )
}

