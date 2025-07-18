import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY});


export async function getGroqChatCompletion(prompt) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content:prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}
export async function groqReturn(prompt) {
  const chatCompletion = await getGroqChatCompletion(prompt);
  return chatCompletion.choices[0]?.message?.content;
}