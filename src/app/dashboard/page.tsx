'use client'

import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const API_BASE: string =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://adet-nestjs.onrender.com";

interface Position {
  id: number;              
  positionCode: string;
  positionName: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null); // <-- username state

  const [positionCode, setPositionCode] = useState<string>("");
  const [positionName, setPositionName] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Hydration fix
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Require login & decode username
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    // Decode token to get username
    try {
      const decoded: any = jwtDecode(token);
      setUsername(decoded.username || decoded.user || "Master");
    } catch (err) {
      console.error("Failed to decode token", err);
      setUsername("Master");
    }

    fetchPositions();
  }, []);

  function authHeaders() {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async function fetchPositions() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/positions`, {
        method: "GET",
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

      const data = await res.json();
      setPositions(data);
    } catch (e: any) {
      setError(e.message || "Failed to fetch positions");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = {
      positionCode,
      positionName,
    };

    try {
      let res: Response;

      if (editingId) {
        res = await fetch(`${API_BASE}/positions/${editingId}`, {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/positions`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      setPositionCode("");
      setPositionName("");
      setEditingId(null);
      fetchPositions();
    } catch (e: any) {
      setError(e.message || "Save failed");
    }
  }

  function startEdit(p: Position) {
    setEditingId(p.id ?? null);
    setPositionCode(p.positionCode ?? "");
    setPositionName(p.positionName ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this position?")) return;

    try {
      const res = await fetch(`${API_BASE}/positions/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);

      fetchPositions();
    } catch (e: any) {
      setError(e.message || "Delete failed");
    }
  }

  if (!hasMounted) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <header className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold">Positions Dashboard</h1>
            {username && (
              <p className="text-md text-gray-300">Welcome Master {username}</p>
            )}
          </div>

          <Button
            className="bg-black border border-white text-white hover:bg-neutral-800"
            onClick={() => fetchPositions()}
          >
            Refresh
          </Button>
        </header>

        {/* FORM */}
        <Card className="mh-6 bg-neutral-900 text-white border border-neutral-700">
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">
              {editingId ? "Edit Position" : "Create Position"}
            </h2>

            <form
              onSubmit={handleCreateOrUpdate}
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
            >
              <Input
                placeholder="Position Code"
                value={positionCode ?? ""}
                onChange={(e) => setPositionCode(e.target.value)}
                required
                className="bg-neutral-800 text-white border-neutral-600"
              />

              <Input
                placeholder="Position Name"
                value={positionName ?? ""}
                onChange={(e) => setPositionName(e.target.value)}
                required
                className="bg-neutral-800 text-white border-neutral-600"
              />

              <div className="flex gap-2">
                <Button className="bg-black text-white hover:bg-neutral-800" type="submit">
                  {editingId ? "Update" : "Create"}
                </Button>

                {editingId && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setPositionCode("");
                      setPositionName("");
                    }}
                    className="border-black text-white"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>

            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </CardContent>
        </Card>

        {/* TABLE */}
        <section>
          <h2 className="text-lg font-semibold mb-2">
            Positions List {loading && "(loading...)"}
          </h2>

          <div className="overflow-x-auto bg-neutral-900 rounded shadow border border-neutral-700">
            <table className="w-full text-left text-white">
              <thead className="bg-neutral-800">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Code</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {positions.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-sm text-neutral-400"
                    >
                      No positions found.
                    </td>
                  </tr>
                )}

                {positions.map((p) => (
                  <tr
                    key={p.id ?? `${p.positionCode}-${Math.random()}`}
                    className="border-t border-neutral-700"
                  >
                    <td className="px-4 py-2">{p.id}</td>              
                    <td className="px-4 py-2">{p.positionCode}</td>
                    <td className="px-4 py-2">{p.positionName}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Button
                          className="bg-black border border-white text-white hover:bg-neutral-800"
                          size="sm"
                          onClick={() => startEdit(p)}
                        >
                          Edit
                        </Button>

                        <Button
                          className="bg-black border border-red-500 text-red-500 hover:bg-neutral-800"
                          size="sm"
                          onClick={() => handleDelete(p.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
