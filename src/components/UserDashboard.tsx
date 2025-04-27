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

  return <UserCard approvedBooks={approvedBooks} />;
}
