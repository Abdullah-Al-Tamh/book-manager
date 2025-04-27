import AdminDashboard from "@/components/AdminDashboard";
import LoginButton from "@/components/LoginButton";
import UserDashboard from "@/components/UserDashboard";
import CtButton from "../components/CtButton";
import { LoginForm } from "@/components/Login-Form";

export default function Home() {
  return (
    <main className="bg-black flex min-h-screen items-center justify-center">
      <LoginForm />
    </main>
  );
}
