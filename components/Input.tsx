import React, { Dispatch, SetStateAction, useState } from "react";
import { motion } from "motion/react";

const Input = ({
  label,
  inputValue,
  setInputValue,
  Icon,
}: {
  label?: string;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  Icon?: any;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="space-y-2">
      {label && <label className="text-amber-400 text-sm">{label}</label>}
      <motion.div
        animate={{
          borderColor: isFocused
            ? "rgba(245, 158, 11, 0.6)"
            : "rgba(245, 158, 11, 0.3)",
          boxShadow: isFocused
            ? "0 0 20px rgba(245, 158, 11, 0.2)"
            : "0 0 0px rgba(245, 158, 11, 0)",
        }}
        className="relative rounded-xl overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 border transition-all"
      >
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Icon className="w-4 h-4 text-amber-400/70" />
          </div>
        )}
        <input
          type="text"
          maxLength={20}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type here..."
          className="w-full py-3.5 pl-12 pr-4 bg-transparent text-amber-300 placeholder:text-zinc-600 focus:outline-none"
        />
      </motion.div>
    </div>
  );
};

export default Input;
