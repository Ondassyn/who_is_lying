import React from "react";
import { motion } from "motion/react";

const Button = ({
  text,
  full = true,
  onClick,
  loading = false,
}: {
  text: string;
  full?: boolean;
  onClick: () => void;
  loading?: boolean;
}) => {
  return (
    <div>
      <motion.button
        whileHover={{
          scale: 1.02,
          boxShadow: "0 20px 40px rgba(245, 158, 11, 0.3)",
        }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`${
          full ? "w-full" : ""
        } py-2 px-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 rounded-xl text-black shadow-xl relative overflow-hidden group`}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ["-200%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />
        <span className="relative font-semibold text-xl h-10">
          {loading ? (
            <div
              className="inline-block h-5 w-5 mt-1 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
            </div>
          ) : (
            text
          )}
        </span>
      </motion.button>
    </div>
  );
};

export default Button;
