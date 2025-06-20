import Groq from "groq-sdk";
import {prompt} from './index.js'
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY});


export async function getGroqChatCompletion(userText) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `${prompt}`,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}
export async function groqReturn() {
  const chatCompletion = await getGroqChatCompletion(prompt);
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

