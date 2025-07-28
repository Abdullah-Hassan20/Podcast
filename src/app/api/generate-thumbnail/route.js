import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt, size = "1024x1024" } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }
    const cleanPrompt = prompt.trim();
    const enhancedPrompt = `${cleanPrompt}, i have to use it as a thumbnail,must be of high quality`;
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const [width, height] = size.split('x');
    
    const seed = Math.floor(Math.random() * 1000000);
    
    const models = ['flux', 'turbo', 'flux-realism'];
    const selectedModel = models[Math.floor(Math.random() * models.length)];
    
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=${selectedModel}&nologo=true&enhance=true`;

    
    
    return NextResponse.json({
      imageUrl: imageUrl,
      success: true,
      model: selectedModel,
      seed: seed
    });

  } catch (error) {
    console.error('Thumbnail generation error:', error);
    return NextResponse.json(
      { error: `Failed to generate thumbnail: ${error.message}` },
      { status: 500 }
    );
  }
}
