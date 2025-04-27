"use client";

import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import Link from "next/link";
import { createClient } from "../../utils/supabase/client";

export default function UserDashboard() {
  const [approvedBooks, setApprovedBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchApprovedBooks() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("is_approved", true);
      if (error) {
        console.error("Error fetching approved books:", error);
        setIsLoading(false);
        return;
      }
      setApprovedBooks(data);
      setIsLoading(false);
    }
    fetchApprovedBooks();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="p-8 bg-black min-h-screen flex flex-col items-center">
      <div className="mb-8">
        <Link
          href="/"
          className="bg-white text-black font-semibold py-2 px-6 rounded-lg shadow hover:bg-gray-200 transition"
        >
          ⬅ Back to Home
        </Link>
      </div>

      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-center">
        {approvedBooks.length > 0 ? (
          approvedBooks.map((book) => (
            <a
              key={book.id}
              className="relative w-60 h-80 rounded-lg overflow-hidden group shadow-lg border border-gray-300"
            >
              <img
                src={book.image_url || "https://via.placeholder.com/150"}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-white bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-4">
                <h3 className="text-black text-lg font-semibold mb-2">
                  {book.title ? book.title.slice(0, 60) : "Book Title"}
                </h3>
                <p className="text-black text-sm">
                  {book.description
                    ? book.description.slice(0, 100) + "..."
                    : "No description available."}
                </p>
              </div>
            </a>
          ))
        ) : (
          <p className="text-white text-lg col-span-full text-center">
            No approved books found. 📚
          </p>
        )}
      </div>
    </div>
  );
}
