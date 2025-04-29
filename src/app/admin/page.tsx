import checkAdmin from "../../../utils/auth/checkAdmin";
import AdminDashboard from "../../components/AdminDashboard";

export default async function AdminPage() {
  await checkAdmin();

  return <AdminDashboard />;
}
