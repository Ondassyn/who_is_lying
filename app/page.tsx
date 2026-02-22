import Image from "next/image";
import JoinCard from "./join/JoinCard";
import { Suspense } from "react";
import JoinCardSkeleton from "@/components/JoinCardSkeleton";

export default function Home() {
  return (
    <div className="h-screen flex flex-col gap-8 justify-center items-center p-4">
      <Image
        src="/logo.png" // Path relative to the public directory
        alt="Description of my local image"
        width={300} // Intrinsic width of the image in pixels
        height={200} // Intrinsic height of the image in pixels
      />
      <Suspense fallback={<JoinCardSkeleton />}>
        <JoinCard />
      </Suspense>
    </div>
  );
}
