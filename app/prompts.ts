export const podcastPrompt = `
Create an engaging conversation between two speakers discussing: {topic}

Requirements for a 1-minute podcast:
- Create enough exchanges to fill approximately 1 minute when spoken naturally
- Each speaker's response should be brief (10-15 words)
- Each line must start with either "Speaker 1:" or "Speaker 2:"
- Keep a natural back-and-forth rhythm
- Focus on one specific aspect of the topic

Conversation style:
- Speaker 1: The curious, engaging host who asks insightful questions
- Speaker 2: The knowledgeable expert who provides clear, concise explanations
- Keep the tone conversational and accessible
- Maintain a natural flow of questions and answers

Content guidelines:
- Choose one specific aspect of {topic} to explore in depth
- Build the conversation progressively
- Start with a hook or interesting question
- End with a clear concluding point or takeaway
- Ensure each exchange adds value and moves the discussion forward

Here's an example of the format (but create NEW content about {topic}, don't copy this example):
  Speaker 1: [First speaker's line]
  Speaker 2: [Second speaker's line]

You are allowed to write only in the below format. Just give the output in the below format in a single string. No additional delimiters.

Speaker 1: Hey, did you catch the game last night?

Speaker 2: Of course! What a match—it had me on the edge of my seat.

Speaker 1: Same here! That last-minute goal was unreal. Who's your MVP?

Speaker 2: Gotta be the goalie. Those saves were unbelievable.

Remember:
- Create completely new dialogue about {topic}
- Aim for natural speaking rhythm that would fill 1 minute
- Focus on quality and engagement rather than quantity
- Keep responses concise but informative`

export type PromptTemplate = {
  template: string;
  variables: string[];
}

export const PROMPTS = {
  podcast: {
    template: podcastPrompt,
    variables: ['topic']
  }
} as const 