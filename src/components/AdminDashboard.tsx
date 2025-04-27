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

  async function checkIfApproved(bookId: string) {
    const { data, error } = await supabase
      .from("books")
      .select("is_approved")
      .eq("id", bookId)
      .single();

    if (error) {
      console.error("Error checking approval:", error.message);
      return false;
    }

    return data?.is_approved === true;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
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

      <FetchedBooks
        books={books}
        approvedBooks={approvedBooks}
        onApproveBook={handleApproveBook}
      />

      <ApprovedBooks
        approvedBooks={approvedBooks}
        onRemoveBook={handleRemoveBook}
      />
    </div>
  );
}
