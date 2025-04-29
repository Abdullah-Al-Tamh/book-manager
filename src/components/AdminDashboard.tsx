"use client";

import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { createClient } from "../../utils/supabase/client";
import ApprovedBooks from "./Approved-Books";
import FetchedBooks from "./Fetched-Books";
import Logoutbutton from "./Logout-button";

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
        "https://www.googleapis.com/books/v1/volumes?q=computerscience&maxResults=40"
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 bg-black">
        <div className="relative h-full w-full bg-black">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen p-8">
        <div className="flex items-start justify-between mb-8">
          <Logoutbutton />
          <h1 className="text-3xl font-bold text-white">📚 Admin Dashboard</h1>
          <button
            onClick={handleSaveApprovedBooks}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Save Approved Books
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 w-full px-4">
          <div className="flex-1">
            <FetchedBooks
              books={books}
              approvedBooks={approvedBooks}
              onApproveBook={handleApproveBook}
            />
          </div>

          <div className="flex-1">
            <ApprovedBooks
              approvedBooks={approvedBooks}
              onRemoveBook={handleRemoveBook}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
