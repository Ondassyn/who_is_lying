const JoinCardSkeleton = () => {
  return (
    <div className="w-full max-w-[400px] bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col gap-6 animate-pulse">
      {/* Name Input Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-4 w-32 bg-slate-700 rounded mb-1"></div>
        <div className="h-12 w-full bg-slate-700/50 rounded-lg"></div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Create Button Skeleton */}
        <div className="h-12 w-full bg-amber-400/20 rounded-lg"></div>

        {/* Divider Skeleton */}
        <div className="flex items-center gap-4 py-2">
          <div className="h-[1px] bg-slate-700 w-full"></div>
          <div className="h-4 w-4 bg-slate-700 rounded-full"></div>
          <div className="h-[1px] bg-slate-700 w-full"></div>
        </div>

        {/* Join Row Skeleton */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <div className="h-4 w-24 bg-slate-700 rounded mb-2"></div>
            <div className="h-12 w-full bg-slate-700/50 rounded-lg"></div>
          </div>
          <div className="h-12 w-28 bg-slate-700/50 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default JoinCardSkeleton;
