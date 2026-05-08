import { NextRequest, NextResponse } from "next/server";
import { withRateLimit } from "@/middleware/rateLimit";
import { ApiResponse } from "@/types";

/**
 * GET /api/mapbox/region?state=California&country=United+States&countryCode=US
 *
 * Geocodes a state/province name to its centroid coordinates.
 * Uses Mapbox `types=region` + country filter to ensure the correct
 * administrative region is returned, not a city or address result.
 *
 * Results are cached for 30 days — state boundaries never change.
 */

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
const MAPBOX_GEOCODING_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";

interface RegionResult {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

async function handleGet(request: NextRequest): Promise<NextResponse> {
  if (!MAPBOX_ACCESS_TOKEN) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Map service not configured" },
      { status: 503 }
    );
  }

  const { searchParams } = request.nextUrl;
  const state = searchParams.get("state")?.trim();
  const countryCode = searchParams.get("countryCode")?.trim();

  if (!state || !countryCode) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "state and countryCode are required" },
      { status: 400 }
    );
  }

  try {
    const mapboxUrl = new URL(
      `${MAPBOX_GEOCODING_URL}/${encodeURIComponent(state)}.json`
    );
    mapboxUrl.searchParams.set("access_token", MAPBOX_ACCESS_TOKEN);
    mapboxUrl.searchParams.set("types", "region");
    mapboxUrl.searchParams.set("country", countryCode.toLowerCase());
    mapboxUrl.searchParams.set("limit", "1");
    mapboxUrl.searchParams.set("language", "en");

    const res = await fetch(mapboxUrl.toString());

    if (!res.ok) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Geocoding failed" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const feature = data.features?.[0];

    if (!feature) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Region not found" },
        { status: 404 }
      );
    }

    const result: RegionResult = {
      name: feature.text ?? state,
      coordinates: {
        lng: feature.center[0],
        lat: feature.center[1],
      },
    };

    return NextResponse.json<ApiResponse<RegionResult>>(
      { success: true, data: result },
      { headers: { "Cache-Control": "public, max-age=2592000" } } // 30 days
    );
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Geocoding failed" },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(handleGet, "mapbox");
