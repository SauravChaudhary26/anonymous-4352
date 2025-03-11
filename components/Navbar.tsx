"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LoadingScreen from "./LoadingScreen";
import {
   NavigationMenu,
   NavigationMenuList,
   NavigationMenuItem,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
   const [loading, setLoading] = useState(true);
   const pathname = usePathname(); // Detect route changes

   // Simulate initial loading screen
   useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
   }, []);

   // Show loading when changing routes
   useEffect(() => {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
   }, [pathname]); // Runs when pathname changes

   return (
      <>
         {loading && <LoadingScreen />}
         {!loading && (
            <header className="border-b border-gray-800">
               <nav className="container mx-auto flex items-center justify-center h-20">
                  <NavigationMenu>
                     <NavigationMenuList className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8">
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
         )}
      </>
   );
};

export default Navbar;
