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
