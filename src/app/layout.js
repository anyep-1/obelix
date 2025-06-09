import localFont from "next/font/local";
import "./globals.css";
import ClientLayout from "@/app/layoutClient";

// Import font lokal
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata untuk SEO
export const metadata = {
  title: "Outcome Based Education",
  description: "Telkom University",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
