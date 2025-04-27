import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex gap-2 items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-green-500 animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-green-500 animate-bounce [animation-delay:-.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-green-500 animate-bounce [animation-delay:-.5s]"></div>
      </div>
    </div>
  );
}
