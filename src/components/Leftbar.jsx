"use client"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import sidebarLinks from "@/constants/index.js"

const Leftbar = () => {
  const pathname = usePathname();
  return (
    <section className='left_sidebar max-h-screen'>
      <nav className='flex flex-col gap-6' >
        <Link href="/" className='flex cursor-pointer items-center gap-2 pb-10 max-lg:justify-center'>
          <Image src="/icons/logo.svg" alt='logo' width={23} height={27}/>
          <h1 className='font-extrabold text-24 max-lg:hidden'>Podcastr</h1>
        </Link>
        {sidebarLinks.map((data,index)=>{
          const isActive = (pathname === data.route || pathname.startsWith(`${data.route}/`));
          return(
              <Link href={data.route} key={index} className={cn("flex gap-3 items-center py-4 px-2 max-lg:px-4 justify-start", {'navfocus border-r-4 border-[#F97535]': isActive})}>
                <Image src={data.imgURL} alt={data.label} width={24} height={24} />
                <p>{data.label}</p>
              </Link>
            )
          })
        }
      </nav>
    </section>
  )
}

export default Leftbar