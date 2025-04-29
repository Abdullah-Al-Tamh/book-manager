import checkUser from "../../../utils/auth/checkUser";
import UserDashboard from "@/components/UserDashboard";
import React from "react";

export default async function page() {
  await checkUser();
  return <UserDashboard />;
}
