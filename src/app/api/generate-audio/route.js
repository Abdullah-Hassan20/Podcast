import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { text, voice } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const languageCode = voice || 'en';
    const chunks = [];
    const maxChunkSize = 200;

    // Split text into manageable chunks
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= maxChunkSize) {
        currentChunk += sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk.trim());
        if (sentence.length <= maxChunkSize) {
          currentChunk = sentence;
        } else {
          const words = sentence.split(' ');
          currentChunk = '';
          for (const word of words) {
            if ((currentChunk + ' ' + word).length <= maxChunkSize) {
              currentChunk += (currentChunk ? ' ' : '') + word;
            } else {
              if (currentChunk) chunks.push(currentChunk.trim());
              currentChunk = word;
            }
          }
        }
      }
    }

    if (currentChunk) chunks.push(currentChunk.trim());

    const audioChunks = [];

    for (const chunk of chunks) {
      const encodedText = encodeURIComponent(chunk);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${languageCode}&client=tw-ob&q=${encodedText}`;

      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch audio for chunk: ${chunk}`);
        continue;
      }

      const audioBuffer = await response.arrayBuffer();
      audioChunks.push(new Uint8Array(audioBuffer));
    }

    if (audioChunks.length === 0) {
      return NextResponse.json({ error: 'Failed to generate audio' }, { status: 500 });
    }

    // Combine all chunks
    const totalLength = audioChunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const combinedAudio = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of audioChunks) {
      combinedAudio.set(chunk, offset);
      offset += chunk.length;
    }

    // Save audio to /public/audio/
    const filename = `podcast-${crypto.randomBytes(8).toString('hex')}.mp3`;
    const audioPath = path.join(process.cwd(), 'public', 'audio');

    // Ensure /public/audio exists
    if (!fs.existsSync(audioPath)) {
      fs.mkdirSync(audioPath, { recursive: true });
    }

    const filePath = path.join(audioPath, filename);
    fs.writeFileSync(filePath, Buffer.from(combinedAudio));

    const publicUrl = `/audio/${filename}`;

    return NextResponse.json({ audioUrl: publicUrl }); // <-- This URL is safe to store
  } catch (error) {
    console.error('Error in generate-audio API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
