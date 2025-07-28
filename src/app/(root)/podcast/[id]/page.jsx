import Image from 'next/image'
import React from 'react'
import Podcast from "@/components/Podcast"
import Empty from '@/components/Empty'
import PodcastDetail from "@/components/PodcastDetail"

const page = async ({ params }) => {

  const { id } = await params;

  const resforID = await fetch(`${process.env.BASE_URL}/api/find_p/${id}`, {
    cache: 'no-store',
  });
  const result = await resforID.json();
  const podcast = result.podcast;

  const resforVOICE = await fetch(`${process.env.BASE_URL}/api/related/${podcast.voice}`, {
    cache: 'no-store',
  });
  const voices = await resforVOICE.json();
  const all_voices = 
  voices.podcasts.filter((v) => { return v._id !== id })

  const isOwner = true; 

  return (
    <section className='flex w-full flex-col'>
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white">
          Currenty Playing
        </h1>
        <figure className="flex gap-3">
          <Image
            src="/icons/headphone.svg"
            width={24}
            height={24}
            alt="headphone"
          />
        </figure>
      </header>

      <PodcastDetail 
        podcastId={podcast._id}
        title={podcast.title}
        imageUrl={podcast.imageUrl}
        audio={podcast.audioUrl}
        imageStorageId={podcast.imageStorageId}
        audioStorageId={podcast.audioStorageId}
        isOwner={isOwner}/>

      <p className="text-[#a5a5a5] text-16 pb-8 pt-[45px] font-medium max-md:text-center">{podcast.description}</p>

      <div className='flex flex-col gap-8'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-18 font-bold text-[#ffffff]'>Transcription</h1>
          <p className="rounded-2xl bg-[#0b0d0e] text-16 font-medium text-[#a5a5a5] whitespace-pre-line max-h-[50vh] overflow-auto p-5 custom-scrollbar">{podcast.transcription}</p>
        </div>
      </div>

      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white">Similar Podcasts</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {all_voices.length === 0 ? (
            <Empty
            title="No similar podcasts found"
            buttonLink="/discover"
            buttonText="Discover more podcasts"
            />):(all_voices.map((p) => <Podcast key={p._id} data={p} />))
          }
        </div>
      </section>

    </section>
  )
}

export default page