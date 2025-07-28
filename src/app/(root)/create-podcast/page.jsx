"use client";
import Thumbnail from "@/components/Thumbnail"
import Audio from "@/components/Audio"
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";

const generatePodcast = () => {

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const [imageUrl, setImageUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [transcription, settranscription] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('en');
  const [submitting, setsubmitting] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (formData) => {

    // Validation
    if (!formData.title || !formData.description) {
      alert('Please fill in both title and description');
      return;
    }
    if (!imageUrl) {
      alert('Please generate or upload a thumbnail');
      return;
    }
    if (!audioUrl) {
      alert('Please generate audio');
      return;
    }

    try {
      setsubmitting(true);

      const response = await fetch('/api/podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          imageUrl: imageUrl,
          audioUrl: audioUrl,
          transcription: transcription,
          voice: selectedVoice 
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Podcast saved successfully!');
        // Reset form
        form.reset();
        setImageUrl('');
        setAudioUrl('');
      } else {
        throw new Error(result.error || 'Failed to save podcast');
      }

    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save podcast: ' + error.message);
    } finally {
      setsubmitting(false);
    }
  };

  return (
    <>
      <section className="text-white flex-col mt-10">
        <h1 className="font-extrabold text-24">Create Podcast</h1>
        <div className="mt-10 border-b border-[#23262c] pb-10">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8 flex flex-col">

              <FormField
                control={form.control}
                name="title"
                rules={{
                  required: "Podcast title is required",
                  minLength: { value: 2, message: "Podcast must be of at least 2 characters." }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Podcast Title</FormLabel>
                    <FormControl>
                      <Input
                        className="text-[#b0b0b0] bg-[#15171C] border-none"
                        placeholder="Write a title of your podcast"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                rules={{
                  required: "Description is required",
                  minLength: { value: 10, message: "Description must be at least 10 characters." }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="border-none bg-[#15171C] text-[#b0b0b0]"
                        placeholder="Write a short podcast description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </form>
          </Form>
        </div>

        <div className="mt-10 text-white flex flex-col gap-10">
          <Audio audioUrl={audioUrl} setAudioUrl={setAudioUrl}
                 selectedVoice={selectedVoice} setSelectedVoice={setSelectedVoice}
                 transcription={transcription} settranscription={settranscription} />

          <Thumbnail imageUrl={imageUrl} setImageUrl={setImageUrl} />

          <div className="w-full">
            <Button
              type="button"
              onClick={form.handleSubmit(handleSubmit)}
              className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-16 font-bold py-5 transition-all duration-300"
            >
              {submitting ?
                <div className="flex items-center gap-2">
                  <Loader size={20} className="animate-spin" />
                  Submitting...
                </div>
                : "Submit & Generate Podcast"
              }
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default generatePodcast;
