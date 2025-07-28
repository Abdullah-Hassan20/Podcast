import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Podcast from '@/models/podcast'; 

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body)
    const { title, description, imageUrl, audioUrl, transcription, voice } = body;
    if (!title || !description || !imageUrl || !audioUrl || !transcription) {
      console.log('❌ Missing required fields:', {
        title: !!title,
        description: !!description, 
        imageUrl: !!imageUrl,
        audioUrl: !!audioUrl,
        transcription: !!transcription
      });
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields',
        received: { title: !!title, description: !!description, imageUrl: !!imageUrl, audioUrl: !!audioUrl, transcription: !!transcription}
      }, { status: 400 });
    }
    await connectDB();
    const podcastData = {
      title: title.trim(),
      description: description.trim(),
      imageUrl,
      audioUrl,
      transcription,
      voice: voice || 'en'
    };

    // Create and save podcast
    const podcast = await Podcast.create(podcastData);
    return NextResponse.json({ 
      success: true, 
      podcast: {
        id: podcast._id,
        title: podcast.title,
        description: podcast.description,
        imageUrl: podcast.imageUrl,
        audioUrl: podcast.audioUrl,
        transcription: podcast.transcription,
        voice: podcast.voice,
        createdAt: podcast.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('💥 DB Insertion Error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message); 
  }
}

// GET route for fetching podcasts (for testing)
export async function GET() {
  try {
    console.log('📋 Fetching all podcasts...');
    await connectDB();
    
    const podcasts = await Podcast.find({}).sort({ createdAt: -1 });
    console.log(`✅ Found ${podcasts.length} podcasts`);

    return NextResponse.json({ 
      success: true, 
      count: podcasts.length,
      podcasts 
      
    });

  } catch (error) {
    console.error('❌ Error fetching podcasts:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}