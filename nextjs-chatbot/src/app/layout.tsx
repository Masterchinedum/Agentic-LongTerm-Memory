import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Advanced Chatbot with Long-Term Memory",
  description: "AI chatbot with semantic memory and agentic capabilities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
