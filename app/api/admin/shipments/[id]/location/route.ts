import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import Shipment from "@/models/Shipment";
import TrackingEvent from "@/models/TrackingEvent";
import { withAuth, type AuthenticatedHandler } from "@/middleware/withAuth";
import { ApiResponse, IShipment } from "@/types";

/** Admin-only update for a manually published shipment location. */
const handlePost: AuthenticatedHandler = async (request: NextRequest, context) => {
  try {
    const { id } = await context.params;
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid shipment ID" }, { status: 400 });
    }

    const body = await request.json();
    const latitude = Number(body.latitude);
    const longitude = Number(body.longitude);
    const location = typeof body.location === "string" ? body.location.trim() : "";

    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
        !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      return NextResponse.json({ success: false, error: "Enter valid latitude and longitude." }, { status: 400 });
    }
    if (!location || location.length > 160) {
      return NextResponse.json({ success: false, error: "Enter a location description (maximum 160 characters)." }, { status: 400 });
    }

    await connectDB();
    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return NextResponse.json({ success: false, error: "Shipment not found." }, { status: 404 });
    }

    const recordedAt = new Date();
    shipment.currentLocation = location;
    shipment.currentLocationCoordinates = { latitude, longitude, recordedAt };
    await shipment.save();

    await TrackingEvent.create({
      shipmentId: shipment._id,
      status: shipment.status,
      location,
      description: "Location updated by ShipX operations. Admin-updated location; not verified live GPS.",
      createdAt: recordedAt,
      updatedAt: recordedAt,
    });

    const response: ApiResponse<IShipment> = {
      success: true,
      data: shipment.toObject(),
      message: "Shipment location published.",
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Publish shipment location error:", error);
    return NextResponse.json({ success: false, error: "Failed to publish shipment location." }, { status: 500 });
  }
};

export const POST = withAuth(handlePost);
