"use client";

import { redirect } from "next/dist/server/api-utils";
import { useEffect } from "react";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="text-lg text-gray-600 mb-6">
        We're sorry for the inconvenience. Please try again.
      </p>
    </div>
  );
}
