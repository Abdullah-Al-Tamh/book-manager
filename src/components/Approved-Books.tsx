import React from "react";

interface ApprovedBooksProps {
  approvedBooks: {
    volumeInfo: any;
    id: string;
  }[];
  onRemoveBook: (id: string) => void;
}
export default function ApprovedBooks({
  approvedBooks,
  onRemoveBook,
}: ApprovedBooksProps) {
  return (
    <div className="w-full lg:w-1/2">
      <h2 className="text-2xl font-semibold text-white mb-4">
        ✅ Approved Books
      </h2>
      {approvedBooks.length === 0 ? (
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
                  onClick={() => onRemoveBook(book.id)}
                >
                  ❌ Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
