import connectDB from "@/lib/mongodb";
import Podcast from "@/models/podcast";

export async function GET(request, { params }) {
  try {
    await connectDB(); 
    const { voice } = await params; 

    const podcasts = await Podcast.find({ voice });

    return new Response(JSON.stringify({ podcasts }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error fetching related podcasts:", error);
    return new Response("Failed to fetch related podcasts", { status: 500 });
  }
}
