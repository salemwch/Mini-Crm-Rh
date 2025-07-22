import React from 'react';

const WelcomeMessage = ({ name = 'Salem Wachwacha' }) => {
  if (typeof name !== 'string') {
    console.warn('WelcomeMessage received non-string name:', name);
    name = String(name);
  }

  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const currentHour = new Date().getHours();
  let greeting;
  if (currentHour < 12) {
    greeting = 'Good morning';
  } else if (currentHour < 18) {
    greeting = 'Good afternoon';
  } else if (currentHour < 22) {
    greeting = 'Good evening';
  } else {
    greeting = 'Good night';
  }

  return (
    <div className="flex items-center justify-between p-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-cyan-900 text-white flex items-center justify-center font-semibold text-sm">
          {initials}
        </div>
        <h1 className="text-2xl font-semibold text-zinc-700">
          {greeting}, {name.split(' ')[0]}!
        </h1>
      </div>
    </div>
  );
};

export default WelcomeMessage;
