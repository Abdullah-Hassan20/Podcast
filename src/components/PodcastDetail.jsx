
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAudio } from '@/providers/AudioProvider';
import { Button } from "./ui/button";
import LoaderSpinner from "./LoaderSpinner";

const PodcastDetailPlayer = ({
  podcastId,
  title,
  imageUrl,
  audio,
  imageStorageId,
  audioStorageId,
  isOwner = false,
}) => {
  const router = useRouter();
  const { setAudio } = useAudio();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this podcast?")) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Use the dynamic route endpoint
      const res = await fetch(`/api/deletePodcast/${podcastId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete");
      }

      alert("Podcast deleted successfully!");
      router.push("/");
      
    } catch (error) {
      console.error("Error deleting podcast", error);
      alert(`Error deleting podcast: ${error.message}`);
    } finally {
      setIsLoading(false);
      setIsDeleting(false);
    }
  };

 const handlePlay = () => {
  let resolvedAudioUrl = "";

  if (typeof audio === "string") {
    if (audio.startsWith("blob:") || audio.startsWith("http")) {
      resolvedAudioUrl = audio;
    } else if (audio.startsWith("/")) {
      // Convert relative path to absolute URL
      resolvedAudioUrl = `${window.location.origin}${audio}`;
    } else {
      console.error("Invalid audio format:", audio);
      return;
    }

    setAudio({
      title,
      audioUrl: resolvedAudioUrl,
      imageUrl,
      podcastId,
    });
  }
};



  console.log(audio)

  if (!imageUrl) return <LoaderSpinner />;

  return (
    <div className="mt-6 flex w-full justify-between max-md:justify-center">
      <div className="flex flex-col gap-8 max-md:items-center md:flex-row">
        <Image
          src={imageUrl}
          width={250}
          height={250}
          alt="Podcast image"
          className="aspect-square rounded-lg"
        />
        <div className="flex w-full flex-col gap-5 max-md:items-center md:gap-9">
          <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white">
            {title}
          </h1>

          <Button
            onClick={handlePlay}
            className="text-16 w-full max-w-[250px] bg-orange-500 font-extrabold text-white hover:bg-orange-600"
          >
            <Image
              src="/icons/Play.svg"
              width={20}
              height={20}
              alt="Play icon"
            />
            &nbsp; Play podcast
          </Button>
        </div>
      </div>

      {isOwner && (
        <div className="relative mt-2">
          <Image
            src="/icons/three-dots.svg"
            width={20}
            height={30}
            alt="Three dots icon"
            className="cursor-pointer"
            onClick={() => setIsDeleting((prev) => !prev)}
          />
          {isDeleting && (
            <div
              className="absolute -left-32 -top-2 z-10 flex w-32 cursor-pointer justify-center gap-2 rounded-md bg-[#202020] py-1.5 hover:bg-[#151515] disabled:opacity-50"
              onClick={isLoading ? undefined : handleDelete}
            >
              {isLoading ? (
                <LoaderSpinner />
              ) : (
                <>
                  <Image
                    src="/icons/delete.svg"
                    width={16}
                    height={16}
                    alt="Delete icon"
                  />
                  <h2 className="text-16 font-normal text-white">Delete</h2>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PodcastDetailPlayer;



