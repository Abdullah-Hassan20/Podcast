import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Podcast from "@/models/podcast";

export async function GET(req) {
  try {
    console.log("📋 Fetching podcasts...");
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    let podcasts;

    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive search
      podcasts = await Podcast.find({
        $or: [
          { title: { $regex: regex } },
          { description: { $regex: regex } },
        ],
      }).sort({ createdAt: -1 });
      console.log(`🔍 Found ${podcasts.length} podcasts matching "${search}"`);
    } else {
      podcasts = await Podcast.find({}).sort({ createdAt: -1 });
      console.log(`✅ Found ${podcasts.length} total podcasts`);
    }

    return NextResponse.json({
      success: true,
      count: podcasts.length,
      podcasts,
    });

  } catch (error) {
    console.error("❌ Error fetching podcasts:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
