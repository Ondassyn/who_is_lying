import Image from "next/image";
import JoinCard from "./join/JoinCard";
import { Suspense } from "react";
import JoinCardSkeleton from "@/components/JoinCardSkeleton";

export default function Home() {
  return (
    <div className="h-screen flex flex-col gap-8 justify-center items-center p-4">
      <Image
        src="/logo.png"
        alt="App Logo"
        width={300}
        height={200}
        priority // Add priority so the logo loads fast!
      />
      <Suspense fallback={<JoinCardSkeleton />}>
        <JoinCard />
      </Suspense>
    </div>
  );
}
