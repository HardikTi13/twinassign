import Groq from "groq-sdk";

export const createGroqClient = (apiKey) => {
  if (!apiKey) return null;
  return new Groq({ 
    apiKey,
    dangerouslyAllowBrowser: true // Essential for client-side use as per assignment
  });
};

export const transcribeAudio = async (apiKey, audioBlob) => {
  const file = new File([audioBlob], "audio.webm", { type: "audio/webm" });
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("model", "whisper-large-v3");
  formData.append("response_format", "json");

  const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`
    },
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Transcription failed");
  }

  return await response.json();
};

export const getSuggestions = async (apiKey, systemPrompt, transcriptText) => {
  const groq = createGroqClient(apiKey);
  if (!groq) throw new Error("API Key missing");

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Recent Transcript:\n${transcriptText}` }
    ],
    temperature: 0.7,
    max_tokens: 1000,
    response_format: { type: "json_object" }
  });

  const content = response.choices[0].message.content;
  try {
    // Expected structure: { "suggestions": [...] } or simply [...]
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : (parsed.suggestions || []);
  } catch (e) {
    console.error("Failed to parse suggestions JSON", content);
    return [];
  }
};

export const streamChat = async (apiKey, model, messages, onToken) => {
  const groq = createGroqClient(apiKey);
  if (!groq) throw new Error("API Key missing");

  const stream = await groq.chat.completions.create({
    model: model,
    messages: messages,
    stream: true,
  });

  let fullContent = "";
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    fullContent += content;
    onToken(content, fullContent);
  }
  return fullContent;
};
