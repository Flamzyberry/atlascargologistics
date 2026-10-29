"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, RefreshCw, Save } from "lucide-react";

type Shipment = {
  _id: string;
  trackingCode: string;
  currentLocation?: string;
  currentLocationCoordinates?: { latitude?: number; longitude?: number; lat?: number; lng?: number; recordedAt?: string };
  origin: string;
  destination: string;
};

export default function ShipmentTrackingControlPage() {
  const params = useParams();
  const id = String(params.id);
  const [shipment, setShipment] = React.useState<Shipment | null>(null);
  const [location, setLocation] = React.useState("");
  const [latitude, setLatitude] = React.useState("");
  const [longitude, setLongitude] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  const loadShipment = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/shipments/${id}`, { cache: "no-store" });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error || "Could not load shipment.");
      const data = json.data as Shipment;
      setShipment(data);
      setLocation(data.currentLocation || "");
      const coords = data.currentLocationCoordinates;
      setLatitude(coords?.latitude != null ? String(coords.latitude) : coords?.lat != null ? String(coords.lat) : "");
      setLongitude(coords?.longitude != null ? String(coords.longitude) : coords?.lng != null ? String(coords.lng) : "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load shipment.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => { void loadShipment(); }, [loadShipment]);

  async function publishLocation(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/shipments/${id}/location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, latitude, longitude }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error || "Could not publish location.");
      setMessage("Location published. Customer tracking will show this admin-updated position.");
      await loadShipment();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not publish location.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className="mx-auto max-w-3xl p-5 text-slate-600">Loading shipment tracking controls…</main>;

  return (
    <main className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <Link href={`/admin/shipments/${id}`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to shipment
      </Link>
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">ShipX Cargo Logistics</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Shipment location control</h1>
        <p className="mt-2 text-slate-600">Publish the position you want shown on the customer tracking page.</p>
      </header>

      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
      {message && <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</div>}

      {shipment && (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-orange-50 p-3 text-orange-600"><MapPin className="h-6 w-6" /></div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-slate-900">{shipment.trackingCode}</h2>
              <p className="mt-1 text-sm text-slate-600">{shipment.origin} → {shipment.destination}</p>
              <p className="mt-2 text-xs font-semibold text-orange-700">ADMIN-UPDATED LOCATION · NOT VERIFIED LIVE GPS</p>
            </div>
          </div>

          <form onSubmit={publishLocation} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-800">
              Location description
              <input required maxLength={160} value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Transit hub, Lagos" className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 px-3 text-base" />
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-800">
                Latitude
                <input required type="number" min="-90" max="90" step="any" value={latitude} onChange={e => setLatitude(e.target.value)} placeholder="e.g. 6.5244" className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 px-3 text-base" />
              </label>
              <label className="block text-sm font-medium text-slate-800">
                Longitude
                <input required type="number" min="-180" max="180" step="any" value={longitude} onChange={e => setLongitude(e.target.value)} placeholder="e.g. 3.3792" className="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 px-3 text-base" />
              </label>
            </div>
            <p className="text-sm text-slate-500">Enter coordinates for the position you want to publish. Each successful update is timestamped in the shipment timeline.</p>
            <button disabled={saving} type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 font-semibold text-white hover:bg-orange-700 disabled:opacity-60">
              <Save className="h-4 w-4" /> {saving ? "Publishing…" : "Publish location"}
            </button>
          </form>
          <button type="button" onClick={() => void loadShipment()} className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            <RefreshCw className="h-4 w-4" /> Reload latest location
          </button>
          {shipment.currentLocationCoordinates?.recordedAt && (
            <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
              Last published: {new Date(shipment.currentLocationCoordinates.recordedAt).toLocaleString()}
            </p>
          )}
        </section>
      )}
    </main>
  );
}
