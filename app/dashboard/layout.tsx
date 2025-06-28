import type { Metadata } from "next";
import "../globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { getUserFromToken } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Task tracker app",
  description: "a web application that keep track of you tasks, make you productive everyday",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const user = await getUserFromToken();

  return (
    <div>
      <Navbar userEmail={user?.email}/>
      <div className="min-h-screen flex flex-1">
        <main className="flex-1 bg-gray-200 p-6 overflow-auto">
          {children}
        </main>
      </div>

    </div>

  );
}
