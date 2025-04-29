"use client";
import React from "react";

interface ApprovedBooksProps {
  approvedBooks: {
    id: string;
    volumeInfo: {
      title?: string;
      description?: string;
      imageLinks?: { thumbnail?: string };
    };
  }[];
  onRemoveBook: (id: string) => void;
}

export default function ApprovedBooks({
  approvedBooks,
  onRemoveBook,
}: ApprovedBooksProps) {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      <div className="w-full text-center">
        <h2 className="text-2xl font-semibold text-white mb-8">
          ✅ Approved Books
        </h2>
      </div>
      {approvedBooks.length === 0 ? (
        <p className="text-white text-center w-full">No books approved yet.</p>
      ) : (
        approvedBooks.map((book) => {
          const info = book.volumeInfo;
          return (
            <a
              key={book.id}
              href="#"
              className="group relative block w-60 h-80 sm:h-96 overflow-hidden rounded-lg"
            >
              <span className="absolute inset-0 border-2 border-dashed border-green-700"></span>

              <div className="relative flex h-full w-full items-end border-2 border-green-700 transition-transform group-hover:scale-105">
                <img
                  src={
                    info.imageLinks?.thumbnail ||
                    "https://via.placeholder.com/150"
                  }
                  alt={info.title || "No title"}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="p-4 transition-opacity group-hover:opacity-0 z-10 w-full text-center bg-green-800/50">
                  <h3 className="text-lg font-bold text-white truncate">
                    {info.title || "No title"}
                  </h3>
                </div>

                <div className="absolute inset-0 p-4 opacity-0 transition-opacity group-hover:opacity-100 flex flex-col justify-end bg-green-900/70 text-white z-10">
                  <h3 className="text-lg font-bold mb-2">{info.title}</h3>
                  <p className="text-sm mb-4">
                    {info.description
                      ? info.description.slice(0, 80) + "..."
                      : "No description available"}
                  </p>

                  <button
                    className="w-full py-2 px-4 rounded font-semibold text-white bg-red-600 hover:bg-red-700 transition"
                    onClick={(e) => {
                      e.preventDefault();
                      onRemoveBook(book.id);
                    }}
                  >
                    ❌ Remove
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
