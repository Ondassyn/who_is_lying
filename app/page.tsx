import Image from "next/image";
import JoinCard from "./join/JoinCard";

export default function Home() {
  return (
    <div className="h-screen flex flex-col gap-8 justify-center items-center p-4">
      <Image
        src="/logo.png" // Path relative to the public directory
        alt="Description of my local image"
        width={300} // Intrinsic width of the image in pixels
        height={200} // Intrinsic height of the image in pixels
      />
      <JoinCard />
    </div>
  );
}
