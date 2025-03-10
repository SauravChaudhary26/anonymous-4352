// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

// If you're using the next-themes-based ThemeProvider from shadcn:
import { ThemeProvider } from "@/components/theme-provider";

// shadcn navigation menu components
import {
   NavigationMenu,
   NavigationMenuList,
   NavigationMenuItem,
} from "@/components/ui/navigation-menu";

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
      <html lang="en" className="dark">
         {/* 
        If you want to fully force dark mode with no toggle, 
        you could omit the ThemeProvider or set it to always dark 
        (e.g., defaultTheme="dark" enableSystem={false}).
      */}
         <body
            className={`${inter.className} bg-black text-white min-h-screen`}
         >
            <ThemeProvider
               attribute="class"
               defaultTheme="dark"
               enableSystem={false}
            >
               <header className="border-b border-gray-800">
                  <nav className="container mx-auto p-4">
                     <NavigationMenu>
                        <NavigationMenuList>
                           <NavigationMenuItem>
                              <Link
                                 href="/dashboard"
                                 className="px-4 py-2 hover:underline"
                              >
                                 Dashboard
                              </Link>
                           </NavigationMenuItem>
                           <NavigationMenuItem>
                              <Link
                                 href="/transactions"
                                 className="px-4 py-2 hover:underline"
                              >
                                 Transactions
                              </Link>
                           </NavigationMenuItem>
                           <NavigationMenuItem>
                              <Link
                                 href="/categories"
                                 className="px-4 py-2 hover:underline"
                              >
                                 Categories
                              </Link>
                           </NavigationMenuItem>
                           <NavigationMenuItem>
                              <Link
                                 href="/budgeting"
                                 className="px-4 py-2 hover:underline"
                              >
                                 Budgeting
                              </Link>
                           </NavigationMenuItem>
                        </NavigationMenuList>
                     </NavigationMenu>
                  </nav>
               </header>

               <main className="container mx-auto p-4">{children}</main>
            </ThemeProvider>
         </body>
      </html>
   );
}
