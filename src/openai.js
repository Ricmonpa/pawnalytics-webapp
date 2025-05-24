// src/openai.js
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function askChatGPT(message) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo", // También puedes usar "gpt-4" si tu cuenta lo permite
      messages: [{ role: "user", content: message }]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
