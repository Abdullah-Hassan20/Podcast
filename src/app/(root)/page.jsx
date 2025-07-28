import Podcast from "@/components/Podcast";

export default async function Home() {
  const res = await fetch(`${process.env.BASE_URL}/api/podcast`);
  const result = await res.json();
  const podcastData = result.podcasts || [];

  return (
    <div className="mt-9 flex flex-col">
      <section className="flex flex-col mx-auto mt-5 w-full">
        <h1 className="text-20 font-bold text-white pb-3 w-full">Podcasts</h1>
        <div className="w-full">
          {podcastData.length === 0 ? (
            <div className="flex justify-center items-center">
              <p className="text-white text-md">No podcasts</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-1 gap-2 w-fit">
              {podcastData.map((data) => (
                <Podcast key={data._id} data={data} />
              ))}
            </div>
          )}
        </div>

      </section>
    </div>
  );
}
