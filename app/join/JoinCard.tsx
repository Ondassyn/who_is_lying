"use client";

import { useState } from "react";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Hash, UserRound } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import random from "random-string-generator";
import { useRouter } from "next/navigation";
import { ref, set } from "firebase/database";
import { db } from "@/lib/firebase";

const JoinCard = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [roomID, setRoomID] = useState("");

  const onJoin = () => {
    if (!name) {
      toast.error("Your name cannot be empty!");
      return;
    }

    if (!roomID) {
      toast.error("You need to specify room ID!");
      return;
    }

    const playerData = {
      isAdmin: false,
      answer: "",
    };
    const newPlayerRef = ref(
      db,
      `rooms/${roomID.toUpperCase()}/players/${name}`
    );
    set(newPlayerRef, playerData);

    router.push(
      `/room/${roomID.toUpperCase()}?username=${name}&isHost=${false}`
    );
  };

  const onCreate = async () => {
    if (!name) {
      toast.error("Your name cannot be empty!");
      return;
    }

    const GeneratedID = random(4, "upper");

    const roomData = {
      roomID: GeneratedID,
      players: { [name]: { isAdmin: true, answer: "" } },
    };

    await set(ref(db, `rooms/${GeneratedID}`), roomData);

    router.push(`/room/${GeneratedID}?username=${name}&isHost=${true}`);
  };

  return (
    <div className="">
      <Card>
        <div className="flex flex-col gap-8">
          <Input
            inputValue={name}
            setInputValue={setName}
            label={"Enter your name"}
            Icon={UserRound}
          />
          <div className="flex flex-col gap-1">
            <div>
              <Button text="Create room" onClick={onCreate} />
            </div>

            <div className="flex flex-row items-center w-full gap-4">
              <div className="h-[0.05rem] bg-amber-400 w-full"></div>
              <div className="">or</div>
              <div className="h-[0.05rem] bg-amber-400 w-full"></div>
            </div>

            <div className="flex flex-row items-end gap-2">
              <Input
                inputValue={roomID}
                setInputValue={setRoomID}
                label={"Enter room ID"}
                Icon={Hash}
              />
              <div className="w-28">
                <Button text="Join" onClick={onJoin} />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JoinCard;
