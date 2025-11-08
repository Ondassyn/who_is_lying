import ToastProvider from "../providers/toast.provider";
import "./global.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Who is lying",
  description: "A game of eloquence and deception",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <div className="flex flex-row bg-black">
            <div className="h-screen w-full text-amber-400">{children}</div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
