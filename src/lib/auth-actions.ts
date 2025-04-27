"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../../utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log("Error logging in:", error);
    redirect("/error");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("User not found after login");
    redirect("/error");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    console.log("Error fetching profile:", profileError);
    redirect("/error");
  }

  if (profile.role === "admin") {
    revalidatePath("/admin", "layout");
    redirect("/admin");
  } else if (profile.role === "user") {
    revalidatePath("/user", "layout");
    redirect("/user");
  } else {
    console.log("Unknown role:", profile.role);
    redirect("/error");
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`,
        email,
        role,
      },
    },
  });

  if (error) {
    console.log("Error signing up:", error);
    redirect("/error");
  }

  revalidatePath("/login", "layout");
  redirect("/login");
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/logout");
}
