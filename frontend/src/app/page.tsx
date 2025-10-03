"use client";

import { useEffect, useState } from "react";

type Event = { id: number; type: string; payload: string; created_at: string };
const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/events/`, { cache: "no-store" });
      if (!res.ok) throw new Error("GET /events failed");
      setEvents(await res.json());
    } catch (e: any) {
      setError(e.message ?? "Load error");
    } finally {
      setLoading(false);
    }
  }

  async function createTest() {
    try {
      setCreating(true);
      setError(null);
      const res = await fetch(`${API}/events/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "fall_detected", payload: "room=101" }),
      });
      if (!res.ok) throw new Error("POST /events failed");
      await load();
    } catch (e: any) {
      setError(e.message ?? "Create error");
    } finally {
      setCreating(false);
    }
  }

  async function deleteEvent(id: number) {
    try {
      setError(null);
      const res = await fetch(`${API}/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("DELETE /events failed");
      await load();
    } catch (e: any) {
      setError(e.message ?? "Delete error");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Monitoreo de personas mayores — Interfaz</h1>
      <p className="mt-2">Estado del backend: <b>ok</b></p>

      <div className="mt-6 flex gap-3">
        <button onClick={load} disabled={loading} className="px-4 py-2 rounded-xl shadow border">
          {loading ? "Cargando..." : "Refrescar"}
        </button>
        <button onClick={createTest} disabled={creating} className="px-4 py-2 rounded-xl shadow border">
          {creating ? "Creando..." : "Crear evento de prueba"}
        </button>
      </div>

      {error && <p className="mt-3 text-red-600">Error: {error}</p>}

      <table className="mt-6 w-full text-sm">
        <thead className="text-left border-b">
          <tr>
            <th className="py-2">IDENTIFICACIÓN</th>
            <th>Tipo</th>
            <th>Carga útil</th>
            <th>Creado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id} className="border-b last:border-0">
              <td className="py-2">{e.id}</td>
              <td>{e.type}</td>
              <td>{e.payload}</td>
              <td>{new Date(e.created_at).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => deleteEvent(e.id)}
                  className="px-3 py-1 rounded-lg border shadow"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {events.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-gray-500">Sin eventos aún.</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
