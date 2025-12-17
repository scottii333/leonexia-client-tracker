import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import CompaniesTable from "@/components/CompaniesTable";

const DashboardPage = async () => {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("auth")?.value === "1";

  if (!isAuthenticated) {
    redirect("/");
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage your companies and clients
          </p>
        </div>
        <LogoutButton />
      </div>

      <CompaniesTable />
    </div>
  );
};

export default DashboardPage;
