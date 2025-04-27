import Link from "next/link";
import React from "react";

export default function CtButton() {
  return (
    <div className="flex gap-4 p-4">
      <Link
        href="/login"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
      >
        Login
      </Link>

      <Link
        href="/admin"
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
      >
        Admin
      </Link>

      <Link
        href="/user"
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300"
      >
        User
      </Link>
    </div>
  );
}
