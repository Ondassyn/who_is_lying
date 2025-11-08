import React from "react";

const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950
        md:border lg:border border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
      {children}
    </div>
  );
};

export default Card;
