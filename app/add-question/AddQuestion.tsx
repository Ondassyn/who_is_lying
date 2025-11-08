"use client";

import React, { useState } from "react";
import Input from "../../components/Input";
import Card from "../../components/Card";
import {
  BadgeQuestionMark,
  MessageCircleQuestionMark,
  Ungroup,
} from "lucide-react";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import TextArea from "../../components/TextArea";

const AddQuestion = () => {
  const [mainQuestion, setMainQuestion] = useState("");
  const [oddQuestion, setOddQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/questions", {
        // Target your API route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mainQuestion,
          oddQuestion,
          category,
          createdAt: new Date(),
        }), // Send the name from the form state
      });

      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      const result = await response.json();
      toast.success(`Question successfully insterted`);
      setMainQuestion("");
      setOddQuestion("");
      setCategory(""); // Clear the form input
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="text-xl mb-4">Add question</div>
      <Card>
        <div className="flex flex-col gap-4">
          <TextArea
            label="Main question"
            inputValue={mainQuestion}
            setInputValue={setMainQuestion}
          />
          <TextArea
            label="Odd question"
            inputValue={oddQuestion}
            setInputValue={setOddQuestion}
          />
          <Input
            label="Category"
            inputValue={category}
            setInputValue={setCategory}
            Icon={Ungroup}
          />

          <div>
            <Button text="Submit" onClick={onSubmit} loading={loading} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddQuestion;
