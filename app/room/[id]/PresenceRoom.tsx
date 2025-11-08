"use client";

import * as Ably from "ably";
import names from "random-names-generator";

import {
  AblyProvider,
  ChannelProvider,
  useAbly,
  useChannel,
  usePresence,
  usePresenceListener,
} from "ably/react";
import {
  useState,
  ReactElement,
  FC,
  MouseEventHandler,
  MouseEvent,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useParams, useSearchParams } from "next/navigation";
import Card from "../../../components/Card";
import { CheckIcon, MessageCircleMore, UserRound } from "lucide-react";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { toast } from "react-toastify";
import { getRandomInt } from "../../../lib/utli/getRandomInt";

interface Question {
  _id: string;
  mainQuestion: string;
  oddQuestion: string;
  category: string;
  createdAt: Date;
  // add other fields here
}

export default function Presence({ data }: { data: Question[] }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const [username] = useState(searchParams.get("username") ?? names.random());
  const [isHost] = useState(searchParams.get("isHost") === "true");
  const [roomId] = useState(`room:` + params.id);
  const [answers, setAnswers] = useState(new Map());
  const [isReady, setIsReady] = useState(false);

  const client = new Ably.Realtime({
    authUrl: "/token",
    authMethod: "POST",
    clientId: username,
  });

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={roomId}>
        <div className="flex flex-col gap-2 items-center">
          <div className="text-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
            {`Room ID: ` + params.id}
          </div>
          <div className="text-lg">Players in the room</div>
          <PresenceList
            roomId={roomId}
            answers={answers}
            setAnswers={setAnswers}
            isReady={isReady}
            setIsReady={setIsReady}
            isHost={isHost}
          />
        </div>

        <PubSubMessages
          roomId={roomId}
          questions={data}
          isHost={isHost}
          answers={answers}
          setAnswers={setAnswers}
          clientId={username}
          isReady={isReady}
        />
      </ChannelProvider>
    </AblyProvider>
  );
}

const PresenceList: FC<any> = ({
  roomId,
  answers,
  setAnswers,
  isReady,
  setIsReady,
  isHost,
}): ReactElement => {
  const { updateStatus } = usePresence(roomId, { status: "available" });
  const { presenceData } = usePresenceListener(roomId, (member) => {
    console.log("member", member);
  });

  const onReady = () => {
    console.log("presenceData", presenceData);
    const newMap = new Map();
    for (let i = 0; i < presenceData.length; i++) {
      newMap.set(presenceData[0].clientId, "");
    }
    setAnswers(newMap);
    setIsReady(true);
  };

  return (
    <>
      <Card>
        <div className="min-w-[227px] max-h-52 overflow-y-auto">
          <ul>
            {presenceData.map((member) => {
              return (
                <li className="" key={member.id}>
                  <div className="flex flex-row items-center gap-2">
                    <UserRound className="w-4 h-4" />
                    <div>{member.clientId}</div>
                    {answers.get(member.clientId) && (
                      <CheckIcon className="h-5 text-green-800" />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Card>
      {isHost && !isReady && <Button text="Ready" onClick={onReady} />}
    </>
  );
};

function PubSubMessages({
  roomId,
  questions,
  isHost,
  setAnswers,
  answers,
  clientId,
  isReady,
}: {
  roomId: string;
  questions: Question[];
  isHost: boolean;
  answers: Map<string, string>;
  setAnswers: Dispatch<SetStateAction<Map<string, string>>>;
  clientId: string;
  isReady: boolean;
}) {
  const QUESTIONS_CHANNEL = "questions";
  const ANSWERS_CHANNEL = "answers";
  const MAIN_CHANNEL = "main";

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [areAnswersDisplayed, setAreAnswersDisplayed] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState("");

  const { channel } = useChannel(roomId, (message: Ably.Message) => {
    console.log(message);
    if (message.name === QUESTIONS_CHANNEL) {
      if (message.data.oddPlayer === clientId) {
        setQuestion(message.data.oddQuestion);
      } else {
        setQuestion(message.data.mainQuestion);
      }
    } else if (message.name === ANSWERS_CHANNEL) {
      toast.success(message.clientId + " submitted an answer", {
        position: "top-center",
        autoClose: 2000,
      });
      const newMap = new Map(answers);
      newMap.set(message.clientId!, message.data.text);
      setAnswers(newMap);
    } else if (message.name === MAIN_CHANNEL) {
      if (message.data.text === "clear") {
        clear();
      } else if (message.data.text === "showAnswers") {
        setAreAnswersDisplayed(true);
      }
    }
  });

  const onSubmit = () => {
    channel.publish(ANSWERS_CHANNEL, {
      text: answer,
    });
    setSubmittedAnswer(answer);
  };

  const sendQuestion = () => {
    const randomPlayerIndex = getRandomInt(answers.entries.length);
    const randomQuestionIndex = getRandomInt(questions.length);
    const randomIndex = getRandomInt(2);
    const keys = Array.from(answers.keys());

    if (randomIndex) {
      channel.publish(QUESTIONS_CHANNEL, {
        mainQuestion: questions[randomQuestionIndex].mainQuestion,
        oddQuestion: questions[randomQuestionIndex].oddQuestion,
        oddPlayer: keys[randomPlayerIndex],
      });

      if (clientId === keys[randomPlayerIndex]) {
        setQuestion(questions[randomQuestionIndex].oddQuestion);
      } else {
        setQuestion(questions[randomQuestionIndex].mainQuestion);
      }
    } else {
      channel.publish(QUESTIONS_CHANNEL, {
        mainQuestion: questions[randomQuestionIndex].oddQuestion,
        oddQuestion: questions[randomQuestionIndex].mainQuestion,
        oddPlayer: keys[randomPlayerIndex],
      });
      if (clientId === keys[randomPlayerIndex]) {
        setQuestion(questions[randomQuestionIndex].mainQuestion);
      } else {
        setQuestion(questions[randomQuestionIndex].oddQuestion);
      }
    }
  };

  const onStart = () => {
    sendQuestion();
  };

  const onAnotherQuestion = () => {
    sendQuestion();

    channel.publish(MAIN_CHANNEL, {
      text: "clear",
    });

    clear();
  };

  const clear = () => {
    const newMap = new Map(answers);
    for (const key of newMap.keys()) {
      newMap.set(key, "");
    }
    setAnswers(newMap);
    setAreAnswersDisplayed(false);
    setAnswer("");
    setSubmittedAnswer("");
  };

  const showAnswers = () => {
    setAreAnswersDisplayed(true);

    channel.publish(MAIN_CHANNEL, {
      text: "showAnswers",
    });
  };

  return (
    <div className="p-2">
      {isHost && isReady ? (
        question ? (
          <div className="flex flex-row gap-2 justify-center">
            <Button text="Another question" onClick={onAnotherQuestion} />
            <Button text="Show answers" onClick={showAnswers} />
          </div>
        ) : (
          <Button text="Start" onClick={onStart} />
        )
      ) : (
        <div></div>
      )}
      {question ? (
        <div className="p-4">
          <Card>
            <div className="flex flex-col gap-2">
              <div className="text-xl text-center font-semibold">
                {question}
              </div>
              {areAnswersDisplayed ? (
                <div className="grid grid-cols-2 gap-3">
                  {[...answers.entries()].map(([key, value]) => (
                    <div key={key}>
                      {key}:{" "}
                      <span className="text-lg text-purple-500 font-semibold">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
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
                        {answer}
                      </span>
                    </div>
                  ) : (
                    <Button text="Submit" onClick={onSubmit} />
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
