"use client";

import * as React from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { cn } from "@/lib/utils";
import { type Coordinates, type Shipment } from "@/lib/api";
import { MapPin } from "lucide-react";

interface ShipmentMapProps {
  shipment: Shipment;
  className?: string;
}

// Compute arc height based on true Euclidean distance in degrees.
// Uses sqrt(dx²+dy²) so north-south routes get the same treatment as east-west ones.
function computeArcHeight(start: [number, number], end: [number, number]): number {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 1)  return 0.4;   // < ~100 km  — subtle curve
  if (dist < 5)  return 1.5;   // ~100–500 km — clear local arc
  if (dist < 15) return 4;     // ~500–1 500 km — solid domestic arc
  if (dist < 40) return 8;     // ~1 500–4 000 km — continental
  return Math.min(dist * 0.12, 15); // intercontinental — capped at 15°
}

// Generate curved arc points between two coordinates (great circle approximation)
function generateArcPoints(
  start: [number, number],
  end: [number, number],
  numPoints: number = 50
): [number, number][] {
  const points: [number, number][] = [];
  const curveHeight = computeArcHeight(start, end);

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lng = start[0] + (end[0] - start[0]) * t;
    const lat = start[1] + (end[1] - start[1]) * t;
    const curve = Math.sin(t * Math.PI) * curveHeight;
    points.push([lng, lat + curve]);
  }

  return points;
}

// Simple marker elements
function createMarkerElement(type: "origin" | "destination"): HTMLElement {
  const el = document.createElement("div");
  
  const styles: Record<string, { bg: string; size: number; icon: string }> = {
    origin: { bg: "#3b82f6", size: 28, icon: "O" },
    destination: { bg: "#22c55e", size: 28, icon: "D" },
  };
  
  const s = styles[type];
  
  el.innerHTML = `<div style="
    width: ${s.size}px; height: ${s.size}px;
    background: ${s.bg}; border-radius: 50%;
    border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: bold; font-size: 12px;
  ">${s.icon}</div>`;
  
  return el.firstElementChild as HTMLElement;
}

export function ShipmentMap({ shipment, className }: ShipmentMapProps) {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = React.useState<string | null>(null);

  // Use pre-stored coordinates from shipment data (geocoded at creation/update time)
  const origin: Coordinates | null = 
    shipment.originLocation?.coordinates || 
    shipment.sender.coordinates || 
    null;
  const destination: Coordinates | null = 
    shipment.destinationLocation?.coordinates || 
    shipment.receiver.coordinates || 
    null;

  React.useEffect(() => {
    if (!mapContainer.current) return;

    // Check if we have coordinates
    if (!origin && !destination) {
      setMapError("No coordinates available for this shipment");
      return;
    }

    // Initialize map
    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (token) mapboxgl.accessToken = token;
      const mapStyle = token ? "mapbox://styles/mapbox/streets-v12" : {
        version: 8 as const,
        sources: {
          osm: {
            type: "raster" as const,
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [{ id: "osm-tiles", type: "raster" as const, source: "osm" }],
      };

      // Calculate center point between origin and destination
      const center: [number, number] = origin && destination
        ? [(origin.lng + destination.lng) / 2, (origin.lat + destination.lat) / 2]
        : origin
          ? [origin.lng, origin.lat]
          : destination
            ? [destination.lng, destination.lat]
            : [0, 0];

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle, // Standard flat street map
        center,
        zoom: 3,
        pitch: 0,
        dragPan: true,
        scrollZoom: true,
        doubleClickZoom: true,
        touchZoomRotate: true,
      });

      // Add compact navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        "top-right"
      );

      // Build human-readable labels that include state when available
      const originLabel =
        [shipment.originLocation?.state, shipment.originLocation?.country]
          .filter(Boolean)
          .join(", ") || shipment.origin;
      const destLabel =
        [shipment.destinationLocation?.state, shipment.destinationLocation?.country]
          .filter(Boolean)
          .join(", ") || shipment.destination;

      // Determine whether both endpoints are in the same country (used for zoom)
      const isSameCountry =
        !!shipment.originLocation?.country &&
        shipment.originLocation.country === shipment.destinationLocation?.country;

      // Add markers and route when map loads
      map.current.on("load", () => {
        if (!map.current) return;

        const allCoords: [number, number][] = [];

        // Add origin marker
        if (origin) {
          new mapboxgl.Marker({ element: createMarkerElement("origin") })
            .setLngLat([origin.lng, origin.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
                <div style="padding: 8px 12px;">
                  <div style="font-weight: 600; color: #1d4ed8; margin-bottom: 4px;">📍 Origin</div>
                  <div style="font-size: 13px; color: #374151;">${originLabel}</div>
                  <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">${shipment.sender.name}</div>
                </div>
              `)
            )
            .addTo(map.current!);
          allCoords.push([origin.lng, origin.lat]);
        }

        // Add destination marker
        if (destination) {
          new mapboxgl.Marker({ element: createMarkerElement("destination") })
            .setLngLat([destination.lng, destination.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
                <div style="padding: 8px 12px;">
                  <div style="font-weight: 600; color: #15803d; margin-bottom: 4px;">🏁 Destination</div>
                  <div style="font-size: 13px; color: #374151;">${destLabel}</div>
                  <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">${shipment.receiver.name}</div>
                </div>
              `)
            )
            .addTo(map.current!);
          allCoords.push([destination.lng, destination.lat]);
        }

        // Draw curved route arc with progress if we have both endpoints
        if (origin && destination) {
          // Calculate progress based on status
          const statusProgress: Record<string, number> = {
            SHIPMENT_CREATED: 0,
            PICKED_UP: 0.1,
            EXPORT_CUSTOMS: 0.2,
            IN_TRANSIT: 0.5,
            ARRIVED: 0.7,
            IMPORT_CUSTOMS: 0.8,
            OUT_FOR_DELIVERY: 0.9,
            DELIVERED: 1.0,
            ON_HOLD: 0.5,
            RETURNED: 0,
            DAMAGED: 0.5,
          };
          const progress = statusProgress[shipment.status] ?? 0.3;

          const arcPoints = generateArcPoints(
            [origin.lng, origin.lat],
            [destination.lng, destination.lat]
          );

          // Full route (dashed gray background)
          map.current.addSource("route-bg", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: { type: "LineString", coordinates: arcPoints },
            },
          });

          map.current.addLayer({
            id: "route-bg-line",
            type: "line",
            source: "route-bg",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#cbd5e1",
              "line-width": 4,
              "line-dasharray": [2, 2],
            },
          });

          // Progress route (solid colored line showing progress)
          const progressIndex = Math.floor(arcPoints.length * progress);
          const progressPoints = arcPoints.slice(0, Math.max(progressIndex + 1, 2));

          map.current.addSource("route-progress", {
            type: "geojson",
            lineMetrics: true,
            data: {
              type: "Feature",
              properties: {},
              geometry: { type: "LineString", coordinates: progressPoints },
            },
          });

          map.current.addLayer({
            id: "route-progress-line",
            type: "line",
            source: "route-progress",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#3b82f6",
              "line-width": 4,
              "line-gradient": [
                "interpolate",
                ["linear"],
                ["line-progress"],
                0, "#3b82f6",
                1, "#22c55e"
              ],
            },
          });
        }

        // Fit bounds to show origin and destination.
        // Domestic routes (same country) allow a higher max zoom so the map
        // zooms in on the relevant region rather than staying at world scale.
        if (allCoords.length >= 2) {
          const bounds = new mapboxgl.LngLatBounds();
          allCoords.forEach((coord) => bounds.extend(coord));
          map.current.fitBounds(bounds, {
            padding: { top: 80, bottom: 80, left: 80, right: 80 },
            maxZoom: isSameCountry ? 8 : 5,
          });
        } else if (allCoords.length === 1) {
          map.current.setCenter(allCoords[0]);
          map.current.setZoom(8);
        }
      });
    } catch (error) {
      setMapError("Failed to initialize map");
      console.error("Map error:", error);
    }

    return () => {
      map.current?.remove();
    };
  }, [origin, destination, shipment.origin, shipment.destination, shipment.sender, shipment.receiver, shipment.status]);

  if (mapError || (!origin && !destination)) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-200",
          className
        )}
        style={{ height: 350 }}
      >
        <MapPin className="h-8 w-8 text-gray-400 mb-2" />
        <p className="text-gray-500 text-sm">{mapError || "No coordinates available"}</p>
        <p className="text-gray-400 text-xs mt-1">{shipment.origin} → {shipment.destination}</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    if (status === "DELIVERED") return "text-green-600";
    if (status === "IN_TRANSIT" || status === "OUT_FOR_DELIVERY") return "text-blue-600";
    if (status === "ON_HOLD" || status === "DAMAGED") return "text-red-600";
    if (status === "RETURNED") return "text-gray-600";
    return "text-amber-600";
  };

  // Calculate progress for display
  const statusProgress: Record<string, number> = {
    SHIPMENT_CREATED: 0,
    PICKED_UP: 10,
    EXPORT_CUSTOMS: 20,
    IN_TRANSIT: 50,
    ARRIVED: 70,
    IMPORT_CUSTOMS: 80,
    OUT_FOR_DELIVERY: 90,
    DELIVERED: 100,
    ON_HOLD: 50,
    RETURNED: 0,
    DAMAGED: 50,
  };
  const progressPercent = statusProgress[shipment.status] ?? 30;

  return (
    <div className={cn("relative rounded-xl overflow-hidden border border-gray-200", className)} style={{ height: 350 }}>
      {/* Map container */}
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      
      {/* Route label overlay */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs max-w-[280px]">
        <div className="font-semibold text-gray-700 mb-2">Route</div>
        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">O</div>
            <span className="text-gray-600 leading-tight">
              {[shipment.originLocation?.state, shipment.originLocation?.country]
                .filter(Boolean).join(", ") || shipment.origin}
            </span>
          </div>
          <div className="flex items-center justify-center text-gray-400 pl-2">
            ↓
          </div>
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">D</div>
            <span className="text-gray-600 leading-tight">
              {[shipment.destinationLocation?.state, shipment.destinationLocation?.country]
                .filter(Boolean).join(", ") || shipment.destination}
            </span>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium text-gray-500">Progress</div>
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-xs font-semibold text-gray-700">{progressPercent}%</div>
        </div>
        <div className={cn("text-xs font-semibold mt-1", getStatusColor(shipment.status))}>
          {shipment.status.replace(/_/g, " ")}
        </div>
      </div>
    </div>
  );
}
