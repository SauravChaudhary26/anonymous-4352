"use client";

const LoadingScreen = () => {
   return (
      <div className="flex flex-col items-center justify-center w-full h-screen">
         <div className="w-24 h-24 border-4 border-transparent animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
            <div className="w-20 h-20 border-4 border-transparent animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
         </div>
      </div>
   );
};

export default LoadingScreen;
