import React from "react";
import { Button } from "./ui/button";
import { signout } from "@/lib/auth-actions";

export default function Logoutbutton() {
  return (
    <Button
      onClick={() => {
        signout();
      }}
    >
      Log out
    </Button>
  );
}
