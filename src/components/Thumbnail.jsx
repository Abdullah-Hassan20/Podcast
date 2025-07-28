"use client";

import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function Thumbnail({ imageUrl, setImageUrl }) {
  const [generatepic, setGeneratepic] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isAIThumbnail, setIsAIThumbnail] = useState(false);
  const fileInputRef = useRef();

  const generateThumbnail = async () => {
    const thumbnailPrompt = document.getElementById("thumbnail").value;
    if (!thumbnailPrompt) {
      alert("Please enter a prompt for thumbnail generation");
      return;
    }

    setGeneratepic(true);

    try {
      const response = await fetch("/api/generate-thumbnail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: thumbnailPrompt,
          size: "1024x1024",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.imageUrl) {
        throw new Error("Thumbnail generation failed");
      }

      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      alert("Failed to generate thumbnail. Please try again.");
    } finally {
      setGeneratepic(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImageLoading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); // base64 string for preview
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setIsImageLoading(false);
    }
  };

  return (
    <div className="flex flex-col border border-[#1e2024] p-4 rounded-md gap-4">
      {/* Toggle buttons */}
      <div className="flex-col gap-2">
        <Button
          type="button"
          onClick={() => setIsAIThumbnail(true)}
          className={cn("bg-transparent w-full", { "bg-[#111214]": isAIThumbnail })}
        >
          Use AI to generate Thumbnail
        </Button>
        <Button
          type="button"
          onClick={() => setIsAIThumbnail(false)}
          className={cn("bg-transparent w-full", { "bg-[#111214]": !isAIThumbnail })}
        >
          Upload a custom file
        </Button>
      </div>

      {/* AI Thumbnail Generation */}
      {isAIThumbnail ? (
        <div className="grid w-full gap-3">
          <Textarea
            className="border-none bg-[#15171C] text-[#b0b0b0]"
            placeholder="Provide prompt for thumbnail"
            id="thumbnail"
          />
          <Button
            type="button"
            onClick={generateThumbnail}
            className="w-fit bg-orange-500 hover:bg-orange-600 py-5"
          >
            {generatepic ? (
              <div className="flex items-center gap-2">
                <Loader size={20} className="animate-spin" />
                Generating...
              </div>
            ) : (
              "Generate Thumbnail"
            )}
          </Button>
        </div>
      ) : (
        // File Upload Mode
        <div className="border-none bg-[#15171C] text-center p-4">
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          {!isImageLoading ? (
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image src="/icons/upload-image.svg" width={40} height={40} alt="upload" />
              <p className="text-yellow-200 mt-2">Click to Upload</p>
            </div>
          ) : (
            <div className="text-white flex items-center gap-2">
              Uploading <Loader size={20} className="animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Thumbnail Preview */}
      {imageUrl && (
        <div>
          <Label>Generated/Uploaded Thumbnail:</Label>
          <div className="mt-2 border border-[#23262c] rounded-md p-2">
            <Image
              src={imageUrl}
              width={200}
              height={200}
              alt="Thumbnail"
              className="rounded-md"
              unoptimized // optional for base64/remote
            />
          </div>
        </div>
      )}
    </div>
  );
}
