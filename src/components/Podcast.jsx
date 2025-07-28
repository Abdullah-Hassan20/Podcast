"use client"
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React from 'react'


const Podcast = ({ data }) => {

  const router=useRouter()
  const { _id, imageUrl, title, description } = data;

  const handle_podcast=()=>{
    router.push(`/podcast/${_id}`)
  }
  
  return (
    <section onClick={handle_podcast}>
      <div className="cursor-pointer rounded-2xl p-3 " title={description}>
        <figure className="flex flex-col gap-2">
          <Image src={imageUrl} width={154} height={154} alt={title} className="aspect-square w-full h-fit object-contain rounded-xl 2xl:size-[200px]" />
          <div className="flex flex-col ">
            <h1 className="text-16 font-bold text-white ">{title}</h1>
            <h2 className="text-12 truncate font-normal capitalize text-[#bebebe]">{description}</h2>
          </div>
        </figure>
      </div>
    </section>
  )
}

export default Podcast