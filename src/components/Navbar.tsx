"use client";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";

export default function Navbar() {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#3a0ca3] via-[#4361ee] to-[#4cc9f0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                Team Scheduler
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {!loading && (
              <div className="ml-4 flex items-center md:ml-6">
                {user ? (
                  <>
                    <span className="mr-4 text-sm">{user.email}</span>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1 rounded-md text-sm font-medium text-white bg-[#f72585] hover:bg-[#b5179e]">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="px-3 py-1 rounded-md text-sm font-medium text-white bg-[#f72585] hover:bg-[#b5179e]">
                    Sign In
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
