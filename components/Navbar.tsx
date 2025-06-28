"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeProvider";
import { Book, LogOut, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar({ userEmail }: { userEmail: string }) {
  const { theme, toggle } = useTheme();

  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
  const fetchName = async () => {
    const res = await fetch('/api/user/name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail }),
    });

    const data = await res.json();
    const fullName = data.name;

    // Get only the first word of the name
    const firstName = fullName?.split(' ')[0] || null;

    setName(firstName);
  };

  fetchName();
}, [userEmail]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        window.location.href = "/auth/login";
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <header className="px-6 md:px-16 py-4 flex items-center justify-between border-b">
      <div className="text-foreground font-medium text-sm md:text-2xl flex items-center gap-2">{`${name}`}'s Space<Book /></div>
      <div className="text-md md:text-2xl font-bold">Task Tracker</div>
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          className="bg-accent border-1 border-amber-400"
          size="icon"
          onClick={toggle}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-2 h-2 mr-1 md:w-4 md:h-4 md:mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}