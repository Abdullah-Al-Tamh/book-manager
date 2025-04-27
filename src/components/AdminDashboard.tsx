"use client";

import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import Link from "next/link";
import { createClient } from "../../utils/supabase/client";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const [books, setBooks] = useState<
    {
      id: string;
      volumeInfo: {
        title?: string;
        description?: string;
        imageLinks?: { thumbnail?: string };
      };
    }[]
  >([]);
  const [approvedBooks, setApprovedBooks] = useState<typeof books>([]);

  useEffect(() => {
    async function fetchBooks() {
      setIsLoading(true);
      const res = await fetch(
        "https://www.googleapis.com/books/v1/volumes?q=computerscience&maxResults=30"
      );
      const data = await res.json();
      setBooks(data.items || []);
      setIsLoading(false);
    }
    fetchBooks();
  }, []);

  function handleApproveBook(bookId: string) {
    const book = books.find((b) => b.id === bookId);
    if (book && !approvedBooks.some((b) => b.id === bookId)) {
      setApprovedBooks([...approvedBooks, book]);
    }
  }

  function handleRemoveBook(bookId: string) {
    setApprovedBooks(approvedBooks.filter((b) => b.id !== bookId));
  }

  async function handleSaveApprovedBooks() {
    if (approvedBooks.length === 0) {
      alert("No approved books to save.");
      return;
    }
  async function handleSaveApprovedBooks() {
    const approvedBooks = await supabase.from("books").select("*");
    return approvedBooks.data;
  }

    const BooksInfo = approvedBooks.map((book) => ({
      title: book.volumeInfo.title || "No title",
      description: book.volumeInfo.description || "No description",
      image_url: book.volumeInfo.imageLinks?.thumbnail || "",
    }));

    const { error } = await supabase.from("books").insert(BooksInfo);

    if (error) {
      if (error.code === "23505") {
        alert("⚠️ Duplicate book entries detected. Please check your data.");
      }
    } else {
      alert("✅ Approved books saved successfully to Supabase!");
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="bg-white text-black font-semibold py-2 px-6 rounded-lg shadow hover:bg-gray-200 transition"
        >
          ⬅ Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-white">📚 Admin Dashboard</h1>
        <button
          onClick={handleSaveApprovedBooks}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Save Approved Books
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-semibold text-white mb-4">
            All Fetched Books
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {books.map((book) => {
              const info = book.volumeInfo;
              const isApproved = approvedBooks.some((b) => b.id === book.id);
              
              return (
                <div
                  key={book.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 p-4 flex flex-col"
                >
                  <img
                    src={
                      info.imageLinks?.thumbnail ||
                      "https://via.placeholder.com/150"
                    }
                    alt={info.title || "No title"}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h3 className="text-lg font-bold mb-2">{info.title}</h3>
                  <p className="text-gray-700 text-sm flex-grow">
                    {info.description
                      ? info.description.slice(0, 100) + "..."
                      : "No description available"}
                  </p>

                  <button
                    className={`mt-4 py-2 px-4 rounded font-semibold text-white transition
                      ${
                        isApproved
                          ? "bg-gray-500 hover:bg-gray-600"
                          : "bg-green-600 hover:bg-green-700"
                      }
                    `}
                    onClick={() => handleApproveBook(book.id)}
                    disabled={isApproved}
                  >
                    {isApproved ? "✅ Approved" : "Approve"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Approved Books */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-semibold text-white mb-4">
            ✅ Approved Books
          </h2>
          {approvedBooks.length === 0 ? (
            handleSaveApprovedBooks()
            <p className="text-white">No books approved yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approvedBooks.map((book) => {
                const info = book.volumeInfo;
                return (
                  <div
                    key={book.id}
                    className="bg-green-100 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 p-4 flex flex-col"
                  >
                    <img
                      src={
                        info.imageLinks?.thumbnail ||
                        "https://via.placeholder.com/150"
                      }
                      alt={info.title || "No title"}
                      className="w-full h-48 object-cover rounded mb-4"
                    />
                    <h3 className="text-lg font-bold mb-2">{info.title}</h3>
                    <p className="text-gray-700 text-sm flex-grow">
                      {info.description
                        ? info.description.slice(0, 100) + "..."
                        : "No description available"}
                    </p>

                    <button
                      className="mt-4 py-2 px-4 rounded font-semibold text-white bg-red-600 hover:bg-red-700 transition"
                      onClick={() => handleRemoveBook(book.id)}
                    >
                      ❌ Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
