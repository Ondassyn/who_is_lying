/**
 * Warning: Opening too many live preview tabs will slow down performance.
 * We recommend closing them after you're done.
 */
import React from "react";
import "./global.css";
import JoinCard from "./join/JoinCard";
import Image from "next/image";

const Home = () => {
  const pageId = "Start";

  return (
    <>
      <div className="h-screen flex flex-col gap-8 justify-center items-center p-4">
        <Image
          src="/logo.png" // Path relative to the public directory
          alt="Description of my local image"
          width={300} // Intrinsic width of the image in pixels
          height={200} // Intrinsic height of the image in pixels
        />
        <JoinCard />
      </div>
    </>
  );
};
export default Home;
