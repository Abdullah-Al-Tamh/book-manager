"use client";
import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import { createClient } from "../../utils/supabase/client";
import ApprovedBooks from "./Approved-Books";
import FetchedBooks from "./Fetched-Books";
import Logoutbutton from "./Logout-button";

const supabase = createClient();
const NumberOfBooks = 40;
const ENABLE_BOOKS_BY_DEFAULT = false;

interface Book {
  id: string;
  title?: string;
  description?: string;
  image_url?: string;
  is_approved: boolean;
}

interface GoogleBook {
  id: string;
  volumeInfo: {
    title?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

export default function AdminDashboard() {
  const [googleBooks, setGoogleBooks] = useState<GoogleBook[]>([]);
  const [unapprovedBooks, setUnapprovedBooks] = useState<Book[]>([]);
  const [approvedBooks, setApprovedBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch both approved and unapproved books from Supabase
  useEffect(() => {
    async function fetchBooks() {
      const { data: approvedData, error: approvedError } = await supabase
        .from("books")
        .select("*")
        .eq("is_approved", true);

      if (!approvedError) {
        setApprovedBooks(approvedData ?? []);
      } else {
        console.error("Error fetching approved books:", approvedError);
      }

      const { data: unapprovedData, error: unapprovedError } = await supabase
        .from("books")
        .select("*")
        .eq("is_approved", false);

      if (!unapprovedError) {
        setUnapprovedBooks(unapprovedData ?? []);
      } else {
        console.error("Error fetching unapproved books:", unapprovedError);
      }
    }

    fetchBooks();
  }, []);

  useEffect(() => {
    async function fetchBookCount() {
      const { count, error } = await supabase
        .from("books")
        .select("*", { count: "exact", head: true });

      if (!error && count !== null) {
        setTotalBooks(count);
      }
    }

    fetchBookCount();
  }, []);

  async function fetchBooksFromGoogleAPI() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=computerscience&maxResults=${NumberOfBooks}`
      );
      const data = await response.json();
      setGoogleBooks(data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  }
  async function handlePushingBooksIntoDatabase() {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("❌ You must be logged in to perform this action.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
      alert("⛔ Access denied. Only admins can save books.");
      return;
    }

    const booksToInsert = googleBooks.map((book) => ({
      title: book.volumeInfo.title || "No title",
      description: book.volumeInfo.description || "No description",
      image_url: book.volumeInfo.imageLinks?.thumbnail || "",
      is_approved: ENABLE_BOOKS_BY_DEFAULT,
    }));

    const { data, error } = await supabase
      .from("books")
      .insert(booksToInsert)
      .select();

    if (error) {
      console.error("Insert error:", error.message);
      if (error.code === "23505") {
        alert("⚠️ Duplicate book entries detected.");
      } else {
        alert(`❌ Error inserting books: ${error.message}`);
      }
    } else {
      alert("✅ Books saved successfully to Supabase!");
      if (ENABLE_BOOKS_BY_DEFAULT) {
        setApprovedBooks([...approvedBooks, ...(data ?? [])]);
      } else {
        setUnapprovedBooks([...unapprovedBooks, ...(data ?? [])]);
      }
      setGoogleBooks([]);

      const { count } = await supabase
        .from("books")
        .select("*", { count: "exact", head: true });

      setTotalBooks(count ?? null);
    }
  }

  async function handleApproveBook(bookId: string) {
    const googleBook = googleBooks.find((b) => b.id === bookId);

    if (googleBook) {
      const { data, error } = await supabase
        .from("books")
        .insert({
          title: googleBook.volumeInfo.title || "No title",
          description: googleBook.volumeInfo.description || "No description",
          image_url: googleBook.volumeInfo.imageLinks?.thumbnail || "",
          is_approved: true,
        })
        .select();

      if (!error && data) {
        setApprovedBooks([...approvedBooks, data[0]]);
        setGoogleBooks(googleBooks.filter((b) => b.id !== bookId));
      } else {
        console.error("Error inserting approved Google book:", error?.message);
      }
    } else {
      const { error } = await supabase
        .from("books")
        .update({ is_approved: true })
        .eq("id", bookId)
        .select();

      if (!error) {
        const bookToApprove = unapprovedBooks.find((b) => b.id === bookId);
        if (bookToApprove) {
          setApprovedBooks([
            ...approvedBooks,
            { ...bookToApprove, is_approved: true },
          ]);
          setUnapprovedBooks(unapprovedBooks.filter((b) => b.id !== bookId));
        }
      } else {
        console.error("Error approving book:", error.message);
      }
    }
  }

  async function handleRemoveBook(bookId: string) {
    const { error } = await supabase
      .from("books")
      .update({ is_approved: false })
      .eq("id", bookId)
      .select();

    if (!error) {
      const bookToRemove = approvedBooks.find((b) => b.id === bookId);
      if (bookToRemove) {
        setUnapprovedBooks([
          ...unapprovedBooks,
          { ...bookToRemove, is_approved: false },
        ]);
        setApprovedBooks(approvedBooks.filter((b) => b.id !== bookId));
      }
    } else {
      console.error("Error removing book:", error.message);
    }
  }

  const shouldDisableFetchButtons =
    totalBooks !== null && totalBooks >= NumberOfBooks;

  if (isLoading) return <Loading />;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen p-8">
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <Logoutbutton />
          <h1 className="text-3xl font-bold text-white text-center flex-1">
            📚 Admin Dashboard
          </h1>
          <div className="flex gap-4">
            <button
              onClick={fetchBooksFromGoogleAPI}
              disabled={shouldDisableFetchButtons || googleBooks.length > 0}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
            >
              Fetch Books from Google
            </button>
            <button
              onClick={handlePushingBooksIntoDatabase}
              disabled={googleBooks.length === 0}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
            >
              Save Fetched Books
            </button>
          </div>
        </div>

        {shouldDisableFetchButtons && (
          <p className="text-white text-sm mt-2">
            ✅ Books already synced. No action needed.
          </p>
        )}

        <div className="flex flex-col lg:flex-row gap-12 w-full px-4">
          <div className="flex-1">
            <FetchedBooks
              books={googleBooks.map((book) => ({
                id: book.id,
                volumeInfo: {
                  title: book.volumeInfo.title,
                  description: book.volumeInfo.description,
                  imageLinks: {
                    thumbnail: book.volumeInfo.imageLinks?.thumbnail,
                  },
                },
              }))}
              unapprovedBooks={unapprovedBooks.map((book) => ({
                id: book.id,
                volumeInfo: {
                  title: book.title,
                  description: book.description,
                  imageLinks: { thumbnail: book.image_url },
                },
              }))}
              onApproveBook={handleApproveBook}
            />
          </div>
          <div className="flex-1">
            <ApprovedBooks
              approvedBooks={approvedBooks.map((book) => ({
                id: book.id,
                volumeInfo: {
                  title: book.title,
                  description: book.description,
                  imageLinks: { thumbnail: book.image_url },
                },
              }))}
              onRemoveBook={handleRemoveBook}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
