"use client";

import { useEffect, useMemo, useState } from "react";

type Event = { id: number; type: string; payload: string; created_at: string };
const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type Toast = { kind: "success" | "error"; msg: string } | null;

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UX state
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [toast, setToast] = useState<Toast>(null);

  function showToast(t: Toast, ms = 2200) {
    setToast(t);
    if (t) setTimeout(() => setToast(null), ms);
  }

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API}/events/`, { cache: "no-store" });
      if (!res.ok) throw new Error("GET /events failed");
      setEvents(await res.json());
    } catch (e: any) {
      setError(e.message ?? "Load error");
      showToast({ kind: "error", msg: "No se pudo cargar" });
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
      showToast({ kind: "success", msg: "Evento creado" });
    } catch (e: any) {
      setError(e.message ?? "Create error");
      showToast({ kind: "error", msg: "Error al crear" });
    } finally {
      setCreating(false);
    }
  }

  async function deleteEvent(id: number) {
    if (!confirm(`¿Eliminar evento ${id}?`)) return;
    try {
      setError(null);
      const res = await fetch(`${API}/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("DELETE /events failed");
      await load();
      showToast({ kind: "success", msg: "Evento eliminado" });
    } catch (e: any) {
      setError(e.message ?? "Delete error");
      showToast({ kind: "error", msg: "Error al eliminar" });
    }
  }

  useEffect(() => { load(); }, []);

  // Opciones de tipo (derivadas)
  const types = useMemo(() => {
    const set = new Set(events.map(e => e.type));
    return ["all", ...Array.from(set)];
  }, [events]);

  // Filtro + búsqueda + orden desc por fecha
  const view = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events
      .filter(e => typeFilter === "all" ? true : e.type === typeFilter)
      .filter(e =>
        q.length === 0
          ? true
          : e.payload.toLowerCase().includes(q) || e.type.toLowerCase().includes(q)
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [events, query, typeFilter]);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Monitoreo de personas mayores — Interfaz</h1>
      <p className="mt-2">Estado del backend: <b>ok</b></p>

      {/* Controles */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Buscar (payload o tipo)</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ej: room=101"
            className="w-full px-3 py-2 rounded-lg border"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Filtrar por tipo</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border"
          >
            {types.map(t => (
              <option key={t} value={t}>{t === "all" ? "Todos" : t}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={load} disabled={loading} className="px-4 py-2 rounded-xl shadow border w-full">
            {loading ? "Cargando..." : "Refrescar"}
          </button>
          <button onClick={createTest} disabled={creating} className="px-4 py-2 rounded-xl shadow border w-full">
            {creating ? "Creando..." : "Crear evento de prueba"}
          </button>
        </div>
      </div>

      {error && <p className="mt-3 text-red-600">Error: {error}</p>}

      {/* Tabla */}
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
          {view.map((e) => (
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
          {view.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-gray-500">Sin eventos que coincidan.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Toast */}
      {toast && (
        <div
          className={
            "fixed bottom-6 right-6 px-4 py-2 rounded-xl shadow " +
            (toast.kind === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white")
          }
        >
          {toast.msg}
        </div>
      )}
    </main>
  );
}
