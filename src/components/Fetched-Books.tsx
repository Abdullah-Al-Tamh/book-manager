import React from "react";

interface FetchedBooksProps {
  books: { volumeInfo: any; id: string | null | undefined }[];
  approvedBooks: { id: string }[];
  onApproveBook: (id: string) => void;
}

export default function FetchedBooks({
  books,
  approvedBooks,
  onApproveBook,
}: FetchedBooksProps) {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      {books.map((book) => {
        const info = book.volumeInfo;
        const isApproved = approvedBooks.some(
          (b: { id: any }) => b.id === book.id
        );

        return (
          <a
            key={book.id}
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
                  className={`w-full py-2 px-4 rounded font-semibold text-white transition ${
                    isApproved
                      ? "bg-gray-500 hover:bg-gray-600"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  onClick={(e) => {
                    e.preventDefault(); // prevent link click
                    onApproveBook(book.id ?? "");
                  }}
                  disabled={isApproved}
                >
                  {isApproved ? "✅ Approved" : "Approve"}
                </button>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
