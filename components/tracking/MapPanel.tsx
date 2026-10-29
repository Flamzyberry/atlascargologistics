"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import type { TrackingData } from "./types";

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapPanelProps {
  data: TrackingData;
}

export function MapPanel({ data }: MapPanelProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Use pre-stored coordinates from shipment data (geocoded at creation/update time)
  const originCoords: Coordinates | null = data.originLocation?.coordinates || null;
  const destCoords: Coordinates | null = data.destinationLocation?.coordinates || null;
  const currentCoords: Coordinates | null = data.currentLocationCoords ? { lat: data.currentLocationCoords.lat, lng: data.currentLocationCoords.lng } : null;

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    setMapError(null);
    setMapLoaded(false);

    if (!originCoords && !destCoords && !currentCoords) {
      setMapError("No coordinates available for this shipment");
      return;
    }

    const initMap = async () => {
      try {
        // Check WebGL support before loading Mapbox
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) {
          setMapError("Map not supported on this device");
          return;
        }

        const mapboxgl = (await import("mapbox-gl")).default;

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

        // Calculate center
        const center: [number, number] = currentCoords
          ? [currentCoords.lng, currentCoords.lat]
          : originCoords && destCoords
            ? [(originCoords.lng + destCoords.lng) / 2, (originCoords.lat + destCoords.lat) / 2]
            : originCoords
              ? [originCoords.lng, originCoords.lat]
              : destCoords
                ? [destCoords.lng, destCoords.lat]
                : [0, 0];

        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: mapStyle,
          center,
          zoom: 3,
          attributionControl: false,
        });

        map.current.addControl(
          new mapboxgl.NavigationControl({ showCompass: false }),
          "top-right"
        );

        map.current.on("load", () => {
          if (!map.current) return;

          const allCoords: [number, number][] = [];

          // Add origin marker
          if (originCoords) {
            const el = document.createElement("div");
            el.innerHTML = `<div style="
              width: 28px; height: 28px;
              background: #3b82f6; border-radius: 50%;
              border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4);
              display: flex; align-items: center; justify-content: center;
              color: white; font-weight: bold; font-size: 12px;
            ">O</div>`;

            new mapboxgl.Marker({ element: el.firstElementChild as HTMLElement })
              .setLngLat([originCoords.lng, originCoords.lat])
              .setPopup(
                new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
                  <div style="padding: 8px 12px;">
                    <div style="font-weight: 600; color: #1d4ed8; margin-bottom: 4px;">📍 Origin</div>
                    <div style="font-size: 13px; color: #374151;">${data.origin}</div>
                  </div>
                `)
              )
              .addTo(map.current!);
            allCoords.push([originCoords.lng, originCoords.lat]);
          }

          // Add destination marker
          if (destCoords) {
            const el = document.createElement("div");
            el.innerHTML = `<div style="
              width: 28px; height: 28px;
              background: #22c55e; border-radius: 50%;
              border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4);
              display: flex; align-items: center; justify-content: center;
              color: white; font-weight: bold; font-size: 12px;
            ">D</div>`;

            new mapboxgl.Marker({ element: el.firstElementChild as HTMLElement })
              .setLngLat([destCoords.lng, destCoords.lat])
              .setPopup(
                new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
                  <div style="padding: 8px 12px;">
                    <div style="font-weight: 600; color: #15803d; margin-bottom: 4px;">🏁 Destination</div>
                    <div style="font-size: 13px; color: #374151;">${data.destination}</div>
                  </div>
                `)
              )
              .addTo(map.current!);
            allCoords.push([destCoords.lng, destCoords.lat]);
          }


          // Add the latest admin/driver-reported GPS position. This is a real
          // stored coordinate, not a simulated point along the route.
          if (currentCoords) {
            new mapboxgl.Marker({ color: "#f97316" })
              .setLngLat([currentCoords.lng, currentCoords.lat])
              .setPopup(new mapboxgl.Popup({ offset: 24 }).setText(
                `Latest reported location: ${data.currentLocation || "Shipment"}${data.currentLocationCoords?.recordedAt ? " · " + new Date(data.currentLocationCoords.recordedAt).toLocaleString() : ""}`
              ))
              .addTo(map.current!);
            allCoords.push([currentCoords.lng, currentCoords.lat]);
          }

          // Draw route arc line with progress
          if (originCoords && destCoords) {
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
            const progress = statusProgress[data.status] ?? 0.3;

            // Generate curved arc points
            const arcPoints: [number, number][] = [];
            const numPoints = 50;
            for (let i = 0; i <= numPoints; i++) {
              const t = i / numPoints;
              const lng = originCoords.lng + (destCoords.lng - originCoords.lng) * t;
              const lat = originCoords.lat + (destCoords.lat - originCoords.lat) * t;
              const distance = Math.abs(destCoords.lng - originCoords.lng);
              const curveHeight = Math.min(distance * 0.15, 15);
              const curve = Math.sin(t * Math.PI) * curveHeight;
              arcPoints.push([lng, lat + curve]);
            }

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

          // Fit bounds to show origin and destination
          if (allCoords.length >= 2) {
            const bounds = new mapboxgl.LngLatBounds();
            allCoords.forEach((coord) => bounds.extend(coord));
            map.current.fitBounds(bounds, {
              padding: { top: 80, bottom: 80, left: 80, right: 80 },
              maxZoom: 10,
            });
          } else if (allCoords.length === 1) {
            map.current.setCenter(allCoords[0]);
            map.current.setZoom(8);
          }

          setMapLoaded(true);
        });
      } catch (error) {
        console.error("Map initialization error:", error);
        setMapError("Failed to initialize map");
      }
    };

    initMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [originCoords?.lat, originCoords?.lng, destCoords?.lat, destCoords?.lng, currentCoords?.lat, currentCoords?.lng, data.currentLocation, data.currentLocationCoords?.recordedAt, data.origin, data.destination, data.status]);

  // Error or no coordinates fallback
  if (mapError || (!originCoords && !destCoords && !currentCoords)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">Shipment Route</h3>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Navigation className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">Route Visualization</p>
            <p className="text-sm text-gray-500 mt-2">
              {data.origin} → {data.destination}
            </p>
            {mapError && (
              <p className="text-xs text-red-500 mt-2">{mapError}</p>
            )}
          </div>
        </div>
      </motion.div>
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
  const progressPercent = statusProgress[data.status] ?? 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
    >
      <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">Shipment Route</h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{currentCoords ? `Latest reported GPS position${data.currentLocationCoords?.recordedAt ? ` · ${new Date(data.currentLocationCoords.recordedAt).toLocaleString()}` : ""}` : "Route overview — no current GPS position has been reported yet"}</p>
      </div>

      <div className="relative">
        {/* Loading overlay */}
        {!mapLoaded && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        )}

        <div ref={mapContainer} className="h-[300px] lg:h-[400px]" />

        {/* Route label overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs max-w-[280px]">
          <div className="font-semibold text-gray-700 mb-2">Route</div>
          <div className="space-y-1.5">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">O</div>
              <span className="text-gray-600 leading-tight">{data.origin}</span>
            </div>
            <div className="flex items-center justify-center text-gray-400 pl-2">
              ↓
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">D</div>
              <span className="text-gray-600 leading-tight">{data.destination}</span>
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
          <div className={`text-xs font-semibold mt-1 ${getStatusColor(data.status)}`}>
            {data.status.replace(/_/g, " ")}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
