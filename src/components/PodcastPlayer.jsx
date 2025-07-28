"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { formatTime } from "@/lib/formatTime";
import { cn } from "@/lib/utils";
import { useAudio } from "@/providers/AudioProvider";

import { Progress } from "./ui/progress";

const PodcastPlayer = () => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const { audio } = useAudio();

    const togglePlayPause = () => {
        if (audioRef.current?.paused) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted((prev) => !prev);
        }
    };

    const forward = () => {
        if (
            audioRef.current &&
            audioRef.current.currentTime &&
            audioRef.current.duration &&
            audioRef.current.currentTime + 5 < audioRef.current.duration
        ) {
            audioRef.current.currentTime += 5;
        }
    };

    const rewind = () => {
        if (audioRef.current && audioRef.current.currentTime - 5 > 0) {
            audioRef.current.currentTime -= 5;
        } else if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    };

    useEffect(() => {
        const updateCurrentTime = () => {
            if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
            }
        };

        const audioElement = audioRef.current;
        if (audioElement) {
            audioElement.addEventListener("timeupdate", updateCurrentTime);
            return () => {
                audioElement.removeEventListener("timeupdate", updateCurrentTime);
            };
        }
    }, []);

    useEffect(() => {
        const audioElement = audioRef.current;
        if (audio?.audioUrl) {
            if (audioElement) {
                audioElement.play().then(() => {
                    setIsPlaying(true);
                });
            }
        } else {
            audioElement?.pause();
            setIsPlaying(false);
        }
    }, [audio]);

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    return (
        <div
            className={cn("sticky bottom-0 left-0 flex size-full flex-col", {
                hidden: !audio?.audioUrl || audio?.audioUrl === "",
            })}
        >
            <Progress
                value={duration > 0 ? (currentTime / duration) * 100 : 0}
                className="w-full"
            />

            <section className="bg-black flex fit pt-3 min-h-[80px] pb-3 w-full items-center justify-center px-4 max-md:justify-center max-md:gap-5 md:px-12">
                <audio
                    ref={audioRef}
                    src={audio?.audioUrl}
                    className="hidden"
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleAudioEnded}
                />
                <div className="flex items-center gap-4 max-md:hidden absolute left-5">
                    <Link href={`/podcast/${audio?.podcastId}`}>
                        <Image
                            src={audio?.imageUrl || "/images/player1.png"}
                            width={64}
                            height={64}
                            alt="player1"
                            className="aspect-square rounded-xl"
                        />
                    </Link>
                    <div className="flex w-[160px] flex-col">
                        <h2 className="text-14 truncate font-semibold text-white">
                            {audio?.title}
                        </h2>
                        <p className="text-12 font-normal text-white">{audio?.author}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center cursor-pointer gap-3 md:gap-6">
                    <div className="flex items-center gap-1.5">
                        <Image
                            src="/icons/reverse.svg"
                            width={24}
                            height={24}
                            alt="rewind"
                            onClick={rewind}
                        />
                        <h2 className="text-12 font-bold text-white">-5</h2>
                    </div>
                    <Image
                        src={isPlaying ? "/icons/Pause.svg" : "/icons/Play.svg"}
                        width={30}
                        height={30}
                        alt="play"
                        onClick={togglePlayPause}
                    />
                    <div className="flex items-center gap-1.5">
                        <h2 className="text-12 font-bold text-white">+5</h2>
                        <Image
                            src="/icons/forward.svg"
                            width={24}
                            height={24}
                            alt="forward"
                            onClick={forward}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-6 absolute right-5">
                    <h2 className="text-16 font-normal text-white max-md:hidden">
                        {formatTime(duration)}
                    </h2>
                    <div className="flex w-full gap-2">
                        <Image
                            src={isMuted ? "/icons/unmute.svg" : "/icons/mute.svg"}
                            width={24}
                            height={24}
                            alt="mute unmute"
                            onClick={toggleMute}
                            className="cursor-pointer"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PodcastPlayer;
