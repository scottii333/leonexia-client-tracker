import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { ProspectTable } from "@/components/ProspectTable";
import { AddProspectsDialog } from "@/components/AddProspectDialog";

const DashboardPage = async () => {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("auth")?.value === "1";

  if (!isAuthenticated) {
    redirect("/");
  }

  return (
    <section className="min-h-[200vh] flex flex-col gap-5   ">
      <Header />
      <div className="p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 w-full">
        <h1 className="text-4xl font-medium">Cold Call Tracker </h1>
        <AddProspectsDialog />
      </div>

      <ProspectTable />
    </section>
  );
};

export default DashboardPage;
