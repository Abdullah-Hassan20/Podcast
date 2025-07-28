"use client";
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Audio = ({ audioUrl, setAudioUrl, selectedVoice, setSelectedVoice, transcription, settranscription }) => {
  const [prompt, setPrompt] = useState("");
  const [description, setdescription] = useState("")
  const [desc, setdesc] = useState(false)
  const [generatedisc, setGeneratedisc] = useState(false);

  // Set default voice if not provided
  useEffect(() => {
    if (!selectedVoice) {
      setSelectedVoice("en");
    }
  }, [selectedVoice, setSelectedVoice]);

const generateDescription = async () => {
  if (!prompt.trim()) {
    alert("Please enter a prompt");
    return;
  }
  setdesc(true);
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      throw new Error("Failed to generate description");
    }
    const data = await res.json();
    const description = data.description;
    if (!description) {
      throw new Error("Missing description in response");
    }
    setdescription(description);
  } catch (error) {
    console.error("Error generating description:", error);
    alert("Description generation failed. Please try again.");
  } finally {
    setdesc(false);
  }
};

const generateAudio = async () => {
  if (!description.trim()) {
    alert("Please enter a prompt for audio generation");
    return;
  }

  settranscription(description);
  setGeneratedisc(true);
  setAudioUrl("");

  try {
    const response = await fetch("/api/generate-audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: description,
        voice: selectedVoice,
      }),
    });

    if (!response.ok) throw new Error("Failed to generate audio");

    const data = await response.json();
    if (!data.audioUrl) throw new Error("No audio URL returned");

    setAudioUrl(data.audioUrl); // now it's a permanent path like /audio/podcast-abc123.mp3
  } catch (error) {
    console.error("Error generating audio:", error);
    alert("Audio generation failed. Please try again.");
  } finally {
    setGeneratedisc(false);
  }
};


return (
  <div className="grid w-full gap-3 border-b border-[#23262c] pb-15">
    <Label htmlFor="prompt" className="text-sm font-semibold">AI prompt to generate description</Label>
    <Textarea
      id="prompt"
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      placeholder="Provide text to AI to generate detail description"
      className="border-none bg-[#15171C] text-[#b0b0b0] "
    />
    <Button
      type="button"
      onClick={generateDescription}
      className="cursor-pointer w-fit bg-orange-500 text-16 font-bold py-5 hover:bg-orange-600 transition-all duration-300 mb-15"
    >
      {desc ? (
        <div className="flex items-center gap-2">
          <Loader size={20} className="animate-spin" />
          Generating...
        </div>
      ) : (
        "Generate Description"
      )}
    </Button>

    <Label className="text-sm font-semibold">AI Voice</Label>
    <Select onValueChange={(val) => setSelectedVoice(val)} value={selectedVoice}>
      <SelectTrigger className="w-full capitalize text-[#b0b0b0] bg-[#15171C] border-none">
        <SelectValue placeholder="Choose a voice"/>
      </SelectTrigger>

      <SelectContent className="font-bold border-none bg-[#15171C] text-white">
        <SelectItem className="focus:bg-orange-500" value="en">Russell   (English)</SelectItem>
        <SelectItem className="focus:bg-orange-500" value="pt">Ricardo   (Portuguese)</SelectItem>
        <SelectItem className="focus:bg-orange-500" value="es">Enrique   (Spanish)</SelectItem>
        <SelectItem className="focus:bg-orange-500" value="nl">Ruben   (Dutch)</SelectItem>
        <SelectItem className="focus:bg-orange-500" value="de">Hans   (German)</SelectItem>
      </SelectContent>
    </Select>

    <Textarea
      onChange={(e) => setdescription(e.target.value)}
      id="description"
      rows={6}
      placeholder="Prompt title to AI above to generate description"
      className="custom-scrollbar border-none bg-[#15171C] text-[#b0b0b0] resize-none overflow-auto"
      value={description}
    />

    <Button
      type="button"
      onClick={generateAudio}
      className="cursor-pointer w-fit bg-orange-500 text-16 font-bold py-5 hover:bg-orange-600 transition-all duration-300"
    >
      {generatedisc ? (
        <div className="flex items-center gap-2">
          <Loader size={20} className="animate-spin" />
          Generating...
        </div>
      ) : (
        "Generate Audio"
      )}
    </Button>

    {audioUrl && (
      <div className="mt-4">
        <Label className="text-sm font-semibold">Generated Audio:</Label>
        <audio key={audioUrl} controls className="w-full mt-2">
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    )}
  </div>
);
};

export default Audio;
