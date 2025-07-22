import React, { useState, useEffect } from 'react';
import UserCard from "./UseCard";

export default function UserCardCarousel({ users }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalUsers = users.length;

   useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((currentActiveIndex) => (currentActiveIndex + 1) % totalUsers);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalUsers])
  if (!users || !Array.isArray(users) || users.length === 0) {
    return (
      <p className="text-center text-sm text-gray-500">No users to display</p>
    );
  }


 ;

  const goToPrevSlide = () => {
    setActiveIndex((currentActiveIndex) =>
      currentActiveIndex === 0 ? totalUsers - 1 : currentActiveIndex - 1
    );
  };

  const goToNextSlide = () => {
    setActiveIndex((currentActiveIndex) =>
      (currentActiveIndex + 1) % totalUsers
    );
  };

  return (
    <div className="relative w-full max-w-xl mx-auto overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {users.map((user, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <div className="flex justify-center py-6">
              <UserCard {...user} />
            </div>
          </div>
        ))}
      </div>

      <button
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full cursor-pointer hover:bg-opacity-75 focus:outline-none z-10"
        onClick={goToPrevSlide}
        aria-label="Previous slide"
      >
        &#10094;
      </button>
      <button
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full cursor-pointer hover:bg-opacity-75 focus:outline-none z-10"
        onClick={goToNextSlide}
        aria-label="Next slide"
      >
        &#10095;
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {users.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === activeIndex ? 'bg-white' : 'bg-gray-400'
            } focus:outline-none`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}