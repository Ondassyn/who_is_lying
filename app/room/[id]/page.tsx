/**
 * Warning: Opening too many live preview tabs will slow down performance.
 * We recommend closing them after you're done.
 */
import React from "react";
import dynamic from "next/dynamic";

const PresenceRoom = dynamic(() => import("./PresenceRoom.tsx"), {
  ssr: false,
});

const Presence = async () => {
  const response = await fetch(process.env.URL + "/api/questions", {
    cache: "no-store",
  });
  const data = await response.json();

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <PresenceRoom data={data} />
      </div>
    </>
  );
};

export default Presence;
