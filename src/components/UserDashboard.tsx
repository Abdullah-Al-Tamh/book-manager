"use client";

import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { createClient } from "../../utils/supabase/client";
import Logoutbutton from "./Logout-button";
import UserCard from "./User-Card";

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
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen p-8">
        <div className="flex justify-between items-center mb-8">
          <Logoutbutton />
          <h1 className="text-3xl font-bold text-white">📚 User Dashboard</h1>
        </div>

        <UserCard approvedBooks={approvedBooks} />
      </div>
    </div>
  );
}
