import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "tinyllama",
        prompt: `Write a podcast of about 250 words for the title: "${prompt}"`,
        stream: false,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Ollama API error:", errText);
      return NextResponse.json({ error: "Failed to generate description." }, { status: 500 });
    }

    const data = await res.json();
    const description=data.response
    console.log(description)
    return NextResponse.json({description});

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
