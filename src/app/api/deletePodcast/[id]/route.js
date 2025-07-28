import connectDB from '@/lib/mongodb'
import Podcast from '@/models/podcast'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  await connectDB();
  const {id} = await params;
  const podcast = await Podcast.findById(id);
  if (!podcast) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, podcast });
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    // Check if podcast exists
    const podcast = await Podcast.findById(id);
    if (!podcast) {
      return NextResponse.json({ 
        success: false, 
        message: "Podcast not found" 
      }, { status: 404 });
    }

    // Delete the podcast
    await Podcast.findByIdAndDelete(id);
    
    return NextResponse.json({ 
      success: true, 
      message: "Podcast deleted successfully" 
    });
    
  } catch (error) {
    console.error("Error deleting podcast:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to delete podcast" 
    }, { status: 500 });
  }
}