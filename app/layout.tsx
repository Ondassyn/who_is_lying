import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/providers/toast.provider";

export const metadata: Metadata = {
  title: "Who is lying",
  description: "A game of eloquence and deception",
  icons: {
    icon: "/lying_logo.png", // points to public/my-custom-icon.png
    shortcut: "/lying_logo.png",
    apple: "/lying_logo.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/lying_logo.png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
