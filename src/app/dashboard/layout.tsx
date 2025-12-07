'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, logoutUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { FaHome } from 'react-icons/fa';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // loading state while checking token

  useEffect(() => {
    const t = getToken();
    if (!t) {
      router.push('/login'); // redirect safely on client
    } else {
      setToken(t); // token exists
    }
    setIsLoading(false);
  }, [router]);

  function handleLogout() {
    logoutUser();
    router.push('/login');
  }

  // While we check token, show nothing or a loader
  if (isLoading) return null;

  // If no token, we already redirected
  if (!token) return null;

  return (
    <div className="min-h-screen w-full bg-black text-white p-10">

      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-bold">Dashboard</h1>

        {/* RIGHT SECTION: HOME ICON + LOGOUT BUTTON */}
        <div className="flex items-center gap-4">

          {/* HOME ICON (Not Clickable) */}
          <div className="w-12 h-12 bg-black border border-gray-500 rounded-full flex items-center justify-center">
            <FaHome className="text-white" size={28} />
          </div>

          {/* GRAY LOGOUT BUTTON */}
          <Button
            className="bg-gray-500 text-white hover:bg-gray-400"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </header>

      {/* PAGE CONTENT */}
      {children}
    </div>
  );
}
