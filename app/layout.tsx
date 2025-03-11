import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar"; // Move the client-side logic to Navbar.tsx

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
   title: "Personal Finance Visualizer",
   description: "Track your expenses, budgets, and more.",
};

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en">
         <body
            className={`${inter.className} bg-black text-white min-h-screen`}
         >
            <ThemeProvider
               attribute="class"
               defaultTheme="dark"
               enableSystem={false}
            >
               <Navbar />
               <main className="container mx-auto p-4">{children}</main>
            </ThemeProvider>
            <Toaster richColors />
         </body>
      </html>
   );
}
