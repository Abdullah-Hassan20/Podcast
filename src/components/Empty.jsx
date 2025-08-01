import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const EmptyState = ({ title, search, buttonLink, buttonText }) => {
  return (
    <section className="flex-center size-full flex-col gap-3">
      <Image src="/icons/emptyState.svg" width={250} height={250} alt="empty state" />
      <div className="flex-center w-full max-w-[254px] flex-col gap-3">
        <h1 className="text-16 text-center font-medium text-white">{title}</h1>
        {search && (
          <p className="text-16 text-center font-medium text-[#8a8a8a]">
            Try adjusting your search to find what you are looking for
          </p>
        )}
        {buttonLink && (
          <Button className="bg-orange-500 p-6">
            <Link href={buttonLink} className="gap-1 flex">
              <Image 
                src="/icons/discover.svg"
                width={20}
                height={20}
                alt="discover"
              />
              <h1 className="text-16 font-extrabold text-white">{buttonText}</h1>
            </Link>
          </Button>
        )}
      </div>
    </section>
  )
}

export default EmptyState
