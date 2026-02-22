"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Card from "../../../components/Card";
import { Copy, MessageCircleMore, QrCode, UserRound, X } from "lucide-react";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { toast } from "react-toastify";
import { getRandomInt } from "../../../lib/util/getRandomInt";
import LoadingDots from "../../../components/LoadingDots";
import { onChildAdded, onValue, ref, set } from "firebase/database";
import { db } from "@/lib/firebase";
import { QRCodeSVG } from "qrcode.react";

interface Question {
  _id: string;
  mainQuestion: string;
  oddQuestion: string;
  category: string;
  createdAt: Date;
  // add other fields here
}

export default function PresenceRoom({ data }: { data: Question[] }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const [username] = useState(searchParams.get("username") ?? "John Doe");
  const [isHost] = useState(searchParams.get("isHost") === "true");
  const [roomId] = useState(params.id);
  const [copyStatus, setCopyStatus] = useState("");
  const [players, setPlayers] = useState(new Map());
  const [answer, setAnswer] = useState("");
  const [submittedAnswer, setSubmittedAnswer] = useState("");
  const [areAnswersDisplayed, setAreAnswersDisplayed] = useState(false);
  const [mainQuestion, setMainQuestion] = useState("");
  const [oddQuestion, setOddQuestion] = useState("");
  const [oddPlayer, setOddPlayer] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingShowAnswers, setLoadingShowAnswers] = useState(false);
  const [loadingAnotherQuestion, setLoadingAnotherQuestion] = useState(false);
  const [loadingStart, setLoadingStart] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const playersRef = ref(db, `rooms/${roomId}/players`);

    const unsubscribe = onChildAdded(playersRef, (snapshot) => {
      setPlayers((prev) => {
        if (prev.has(snapshot.key)) return prev;

        const next = new Map(prev);
        next.set(snapshot.key!, { answer: "" });
        return next;
      });
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const questionRef = ref(db, `rooms/${roomId}/mainQuestion`);

    const unsubscribe = onValue(questionRef, (snapshot) => {
      setMainQuestion(snapshot.val());
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const questionRef = ref(db, `rooms/${roomId}/oddQuestion/`);

    const unsubscribe = onValue(questionRef, (snapshot) => {
      setOddQuestion(snapshot.val());
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const playerRef = ref(db, `rooms/${roomId}/oddPlayer/`);

    const unsubscribe = onValue(playerRef, (snapshot) => {
      setOddPlayer(snapshot.val());
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const playersRef = ref(db, `rooms/${roomId}/players/`);

    const unsubscribe = onValue(playersRef, (snapshot) => {
      const valObject = snapshot.val();

      const newMap = new Map(players);
      for (const key of Object.keys(valObject)) {
        newMap.set(key, valObject[key].answer);
      }
      setPlayers(newMap);
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    const questionRef = ref(db, `rooms/${roomId}/showAnswers`);

    const unsubscribe = onValue(questionRef, (snapshot) => {
      setAreAnswersDisplayed(snapshot.val());
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    if (!areAnswersDisplayed) {
      clearForms();
    }
  }, [areAnswersDisplayed]);

  const getJoinURL = () => {
    if (typeof window !== "undefined") {
      // Pointing to your home/join page with the room query param
      return `${window.location.origin}/?room=${roomId}`;
    }
    return "";
  };

  const onCopy = () => {
    navigator.clipboard.writeText(
      typeof params.id === "string" ? params.id : "",
    );
    setCopyStatus("copied!");
  };

  const onStart = () => {
    sendQuestion();
  };

  const sendQuestion = async () => {
    const randomPlayerIndex = getRandomInt(players.size);
    const randomQuestionIndex = getRandomInt(data.length);
    const randomIndex = getRandomInt(2);
    const keys = Array.from(players.keys());

    set(
      ref(db, `rooms/${roomId}/mainQuestion`),
      randomIndex
        ? data[randomQuestionIndex].mainQuestion
        : data[randomQuestionIndex].oddQuestion,
    );

    set(
      ref(db, `rooms/${roomId}/oddQuestion`),
      randomIndex
        ? data[randomQuestionIndex].oddQuestion
        : data[randomQuestionIndex].mainQuestion,
    );

    set(ref(db, `rooms/${roomId}/oddPlayer`), keys[randomPlayerIndex]);
  };

  const onAnotherQuestion = () => {
    clear();

    sendQuestion();
  };

  const clear = () => {
    // const newMap = new Map(players);
    for (const key of players.keys()) {
      // newMap.set(key, "");
      set(ref(db, `rooms/${roomId}/players/${key}/answer`), "");
    }

    // setPlayers(newMap);
    set(ref(db, `rooms/${roomId}/showAnswers`), false);
    // clearForms();
  };

  const clearForms = () => {
    setAnswer("");
    setSubmittedAnswer("");
  };

  const showAnswers = () => {
    set(ref(db, `rooms/${roomId}/showAnswers`), true);
  };

  const onSubmit = () => {
    setLoadingSubmit(true);
    set(ref(db, `rooms/${roomId}/players/${username}/answer`), answer)
      .then(() => setSubmittedAnswer(answer))
      .catch((e) => toast.error("Submit failed: " + e))
      .finally(() => setLoadingSubmit(false));
  };

  return (
    <div className="max-w-[600] w-full">
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative bg-white p-8 rounded-2xl flex flex-col items-center gap-4 shadow-2xl animate-in zoom-in duration-200">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-2 right-2 p-1 text-slate-500 hover:text-black"
            >
              <X size={24} />
            </button>

            <h2 className="text-black font-bold text-xl">Invite Players</h2>

            <div className="bg-white p-2 border-4 border-amber-400 rounded-xl">
              <QRCodeSVG value={getJoinURL()} size={250} />
            </div>

            <div className="text-center">
              <p className="text-slate-600 text-sm">Scan to join room</p>
              <p className="text-amber-600 font-mono font-bold text-lg">
                {roomId}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 items-center px-2 w-full">
        <div className="flex flex-row items-end gap-2 font-semibold text-2xl bg-linear-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
          {`Room ID: ` + params.id}
          {!copyStatus ? (
            <Copy onClick={onCopy} className="h-5 text-amber-400" />
          ) : (
            <div className="text-sm">{copyStatus}</div>
          )}
        </div>

        <button
          onClick={() => setShowQR(true)}
          className="p-1.5 -mt-2 bg-amber-400/10 rounded-lg border border-amber-400/20 hover:bg-amber-400/20 transition-colors"
          title="Show QR Code"
        >
          <div className="flex gap-2 items-center">
            Show QR Code
            <QrCode className="h-5 w-5 text-amber-500" />
          </div>
        </button>

        {mainQuestion ? (
          <Card>
            <div className="flex flex-col gap-8">
              <div className="text-xl text-center font-semibold">
                {areAnswersDisplayed
                  ? mainQuestion
                  : oddPlayer === username
                    ? oddQuestion
                    : mainQuestion}
              </div>
              {!areAnswersDisplayed && (
                <div className="flex flex-col gap-2 justify-center items-center">
                  <div className="w-full">
                    <Input
                      inputValue={answer}
                      setInputValue={setAnswer}
                      Icon={MessageCircleMore}
                    />
                  </div>
                  {submittedAnswer ? (
                    <div>
                      Your answer:{" "}
                      <span className="text-lg text-purple-500 font-semibold">
                        {submittedAnswer}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <Button
                        text="Submit"
                        onClick={onSubmit}
                        loading={loadingSubmit}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        ) : (
          <div></div>
        )}

        <div className="flex flex-col gap-2 items-center w-full">
          <div className="text-lg">Players in the room</div>

          <Card>
            <div className="w-full max-h-52 overflow-y-auto">
              <ul className="grid grid-cols-2 gap-3 px-4">
                {[...players.entries()].map(([key, value]) => {
                  return (
                    <li className="flex flex-col items-center" key={key}>
                      <div className="flex flex-row items-center gap-2">
                        <UserRound className="w-4 h-4" />
                        <div>{key}</div>
                      </div>
                      {mainQuestion && (
                        <div className="text-fuchsia-400">
                          {areAnswersDisplayed ? (
                            value || (
                              <span className="text-pink-500">
                                {"no answer"}
                              </span>
                            )
                          ) : value ? (
                            <span className="text-emerald-500">{"Ready"}</span>
                          ) : (
                            "..."
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Card>
          {isHost ? (
            mainQuestion ? (
              <div className="flex flex-row gap-2 justify-center">
                <Button
                  text="Another question"
                  onClick={onAnotherQuestion}
                  loading={loadingAnotherQuestion}
                />
                <Button
                  text="Show answers"
                  onClick={showAnswers}
                  loading={loadingShowAnswers}
                />
              </div>
            ) : (
              <Button text="Start" onClick={onStart} loading={loadingStart} />
            )
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
