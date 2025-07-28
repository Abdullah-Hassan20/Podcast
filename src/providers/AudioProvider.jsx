'use client';

import { usePathname, useSearchParams } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

const AudioContext = createContext(undefined);

const AudioProvider = ({ children }) => {
  const [audio, setAudio] = useState(undefined);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Function to restore audio from URL parameters
  const restoreAudioFromURL = () => {
    const audioUrl = searchParams.get('audioUrl');
    const title = searchParams.get('title');
    const author = searchParams.get('author');
    const imageUrl = searchParams.get('imageUrl');
    const podcastId = searchParams.get('podcastId');

    if (audioUrl) {
      setAudio({
        audioUrl,
        title: title || 'Unknown Title',
        author: author || 'Unknown Author',
        imageUrl: imageUrl || '/images/player1.png',
        podcastId: podcastId || null
      });
    }
  };

  // Function to update URL with audio parameters
  const updateAudioWithURL = (audioData) => {
    if (audioData && typeof window !== 'undefined') {
      const url = new URL(window.location);
      url.searchParams.set('audioUrl', audioData.audioUrl);
      url.searchParams.set('title', audioData.title || '');
      url.searchParams.set('author', audioData.author || '');
      url.searchParams.set('imageUrl', audioData.imageUrl || '');
      if (audioData.podcastId) {
        url.searchParams.set('podcastId', audioData.podcastId);
      }
      window.history.replaceState({}, '', url);
    }
    setAudio(audioData);
  };

  useEffect(() => {
    if (pathname === '/create-podcast') {
      setAudio(undefined);
      // Clear URL parameters when on create-podcast page
      if (typeof window !== 'undefined') {
        const url = new URL(window.location);
        url.searchParams.delete('audioUrl');
        url.searchParams.delete('title');
        url.searchParams.delete('author');
        url.searchParams.delete('imageUrl');
        url.searchParams.delete('podcastId');
        window.history.replaceState({}, '', url);
      }
    } else {
      // Try to restore audio from URL parameters
      restoreAudioFromURL();
    }
  }, [pathname, searchParams]);

  return (
    <AudioContext.Provider value={{ 
      audio, 
      setAudio: updateAudioWithURL 
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }

  return context;
};

export default AudioProvider;
