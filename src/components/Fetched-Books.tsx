"use client";
import React from "react";

interface BookInfo {
  id: string;
  volumeInfo: {
    title?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

interface FetchedBooksProps {
  books: BookInfo[]; // Google API books
  unapprovedBooks: BookInfo[]; // Books from Supabase that are unapproved
  onApproveBook: (id: string) => void;
}

export default function FetchedBooks({
  books,
  unapprovedBooks,
  onApproveBook,
}: FetchedBooksProps) {
  const allBooks = [...books, ...unapprovedBooks];

  return (
    <div className="flex flex-wrap justify-center gap-8">
      <div className="w-full text-center">
        <h2 className="text-2xl font-semibold text-white mb-8">
          📚 Books to Review
        </h2>
      </div>

      {allBooks.length === 0 ? (
        <p className="text-white text-center w-full">
          No books to review. Try fetching some books first.
        </p>
      ) : (
        allBooks.map((book) => {
          const info = book.volumeInfo;

          return (
            <a
              href="#"
              className="group relative block w-60 h-80 sm:h-96 overflow-hidden rounded-lg"
            >
              <span className="absolute inset-0 border-2 border-dashed border-black"></span>

              <div className="relative flex h-full w-full items-end border-2 border-black transition-transform group-hover:scale-105">
                {/* Full background image */}
                <img
                  src={
                    info.imageLinks?.thumbnail ||
                    "https://via.placeholder.com/150"
                  }
                  alt={info.title || "No title"}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* First Layer (Title only) */}
                <div className="p-4 transition-opacity group-hover:opacity-0 z-10 w-full text-center bg-black/40">
                  <h3 className="text-lg font-bold text-white truncate">
                    {info.title || "No title"}
                  </h3>
                </div>

                {/* Hover Layer (Details + Button) */}
                <div className="absolute inset-0 p-4 opacity-0 transition-opacity group-hover:opacity-100 flex flex-col justify-end bg-black/60 text-white z-10">
                  <h3 className="text-lg font-bold mb-2">{info.title}</h3>
                  <p className="text-sm mb-4">
                    {info.description
                      ? info.description.slice(0, 80) + "..."
                      : "No description available"}
                  </p>

                  <button
                    className="w-full py-2 px-4 rounded font-semibold text-white bg-green-600 hover:bg-green-700 transition"
                    onClick={(e) => {
                      e.preventDefault();
                      onApproveBook(book.id);
                    }}
                  >
                    Approve
                  </button>
                </div>
              </div>
            </a>
          );
        })
      )}
    </div>
  );
}
