"use client";

import axios from "axios";
import { useState, useEffect } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [quality, setQuality] = useState("192");
  const [format, setFormat] = useState("mp3");

  useEffect(() => {
    console.log(`Backend API URL: ${process.env.NEXT_PUBLIC_BACKEND_API_URL}`);
  }, []);

  const validateYouTubeURL = (url: string) => {
    const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(url);
  };

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLink("");
    setIsLoading(true);
    setError("");

    if (!url) {
      setError("Please enter a YouTube URL");
      setIsLoading(false);
      return;
    }

    if (!validateYouTubeURL(url)) {
      setError("Please enter a valid YouTube URL");
      setIsLoading(false);
      return;
    }

    try {
      console.log(
        `Sending request to: ${process.env.NEXT_PUBLIC_BACKEND_API_URL}/download`
      );
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/download`,
        { url, quality, format },
        { timeout: 30000 } 
      );
      setLink(response.data.download_url);
    } catch (error: any) {
      console.error("Error details:", error);
      if (error.response) {
        setError(
          `Server error: ${error.response.status} - ${
            error.response.data.detail || "Unknown error"
          }`
        );
      } else if (error.request) {
        setError(
          "No response received from server. Please check your connection."
        );
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="flex flex-col gap-8 items-center justify-center w-[70vw] h-[50vh]">
        <h1 className="text-6xl font-bold text-center">
          idk what to name it!
        </h1>
        <form onSubmit={handleSubmission} className="space-y-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="Enter YouTube URL"
            className="input input-bordered input-accent w-full max-w-xs"
          />

          <div className="flex justify-center space-x-4">
            <label className="flex items-center justify-center gap-2">
              <input
                type="radio"
                name="format"
                value="mp3"
                checked={format === "mp3"}
                onChange={() => setFormat("mp3")}
                className="radio radio-primary"
              />
              MP3
            </label>
            <label className="flex items-center justify-center gap-2">
              <input
                type="radio"
                name="format"
                value="mp4"
                checked={format === "mp4"}
                onChange={() => setFormat("mp4")}
                className="radio radio-primary"
              />
              MP4
            </label>
          </div>

          {format === "mp3" && (
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="select select-accent w-full max-w-xs"
            >
              <option disabled selected>Choose Quality </option>
              <option value="128">128 kbps (Standard)</option>
              <option value="192">192 kbps (Better)</option>
              <option value="320">320 kbps (Best)</option>
            </select>
          )}

          <div className="w-full flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={` ${isLoading ? "btn btn-active btn-ghost" : "btn btn-active btn-primary"}`}
            >
              {isLoading ? "Processing..." : "Download"}
            </button>
          </div>
        </form>

        {error && <p className="text-error">{error}</p>} 
        {link && (
          <div className="">
            <a
              href={link}
              className="link link-success"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Link
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
