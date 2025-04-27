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
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl font-semibold text-white mb-4">
          All Fetched Books
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {books.map((book) => {
            const info = book.volumeInfo;
            const isApproved = approvedBooks.some(
              (b: { id: any }) => b.id === book.id
            );

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
                  onClick={() => onApproveBook(book.id ?? "")}
                  disabled={isApproved}
                >
                  {isApproved ? "✅ Approved" : "Approve"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
