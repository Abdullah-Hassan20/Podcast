"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Empty from "@/components/Empty";
import LoaderSpinner from "@/components/LoaderSpinner";
import Podcast from "@/components/Podcast";
import Searchbar from "@/components/Searchbar";

const Discover = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const [podcastsData, setPodcastsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/s_podcast?search=${encodeURIComponent(search)}`);
        const data = await response.json();
        const podcasts = data.podcasts;
        setPodcastsData(podcasts);
      } catch (error) {
        console.error("Failed to fetch podcasts:", error);
        setPodcastsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, [search]);

  return (
    <div className="flex flex-col gap-9">
      <Searchbar />
      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bold text-white">
          {!search ? "Discover Trending Podcasts" : "Search results for "}
          {search && <span className="text-[#cacaca]">{search}</span>}
        </h1>
        {loading ? (
          <LoaderSpinner />
        ) : (
          <>
            {podcastsData.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {podcastsData.map((data) => (<Podcast key={data._id} data={data}/>))}
              </div>
            ) : (
              <Empty title="No results found" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Discover;
