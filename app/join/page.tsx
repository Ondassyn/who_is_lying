import { Suspense } from "react";
import JoinCard from "./JoinCard";
import Card from "@/components/Card";

const JoinCardFallback = () => (
  <Card>
    <div className="flex flex-col gap-4 w-[300] h-[250] animate-pulse">
      <div className="h-10 bg-slate-700/20 rounded-md w-full"></div>
      <div className="h-10 bg-slate-700/20 rounded-md w-full"></div>
      <div className="h-1 bg-amber-400/20 w-full my-2"></div>
      <div className="h-10 bg-slate-700/20 rounded-md w-full mt-auto"></div>
    </div>
  </Card>
);

const Join = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center p-4">
      <Suspense fallback={<JoinCardFallback />}>
        <JoinCard />
      </Suspense>
    </div>
  );
};

export default Join;
