import React, { useState, useEffect } from "react";
import { Rocket, Flame, Star } from "lucide-react";

const greetings = [
  { icon: <Rocket className="w-5 h-5 text-purple-600" />, text: "Keep growing — Your Success Is Our Success and Our Mission!" },
  { icon: <Star className="w-5 h-5 text-yellow-400" />, text: "You're smashing it today!" },
  { icon: <Flame className="w-5 h-5 text-red-500" />, text: "Check out our latest features!" },
];


export default function TopBanner({ user, onAction }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const { icon, text } = greetings[messageIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((idx) => (idx + 1) % greetings.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-12 z-50 flex justify-center items-center bg-gradient-to-l from-violet-600 to-pink-700 shadow-md">
    <div className="text-white text-sm px-6 py-3 rounded-md flex items-center gap-4">
      <span className="flex items-center gap-2 text-center text-xl font-semibold">
        {icon}
        {text}
      </span>

      <button
        onClick={onAction}
        className="px-4 py-1.5 bg-white text-pink-700 font-semibold text-xs sm:text-sm rounded-full shadow hover:bg-pink-100 hover:text-pink-800 transition-all duration-300"
      >
        {user?.isPremium ? "Thanks for being premium!" : "🚀 Wanna Grow Up!"}
      </button>
    </div>
  </div>
  );
}
