/**
 * Centralized configuration for shipment-related labels and display values.
 * Use these constants throughout the application for consistency.
 */

import {
  ShipmentStatus,
  ServiceType,
  ShipmentType,
  ShipmentMode,
  ConsignmentType,
  PaymentMethod,
  PaymentStatus,
  Currency,
} from "@/types";

// ============================================================================
// Status Labels
// ============================================================================

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  [ShipmentStatus.SHIPMENT_CREATED]: "Shipment Created",
  [ShipmentStatus.PICKED_UP]: "Picked Up",
  [ShipmentStatus.EXPORT_CUSTOMS]: "Export Customs",
  [ShipmentStatus.IN_TRANSIT]: "In Transit",
  [ShipmentStatus.ARRIVED]: "Arrived",
  [ShipmentStatus.IMPORT_CUSTOMS]: "Import Customs",
  [ShipmentStatus.OUT_FOR_DELIVERY]: "Out for Delivery",
  [ShipmentStatus.DELIVERED]: "Delivered",
  [ShipmentStatus.ON_HOLD]: "On Hold",
  [ShipmentStatus.RETURNED]: "Returned",
  [ShipmentStatus.DAMAGED]: "Damaged",
};

export const STATUS_DESCRIPTIONS: Record<ShipmentStatus, string> = {
  [ShipmentStatus.SHIPMENT_CREATED]: "Shipment has been created and is being processed",
  [ShipmentStatus.PICKED_UP]: "Package has been picked up from sender",
  [ShipmentStatus.EXPORT_CUSTOMS]: "Package is at export customs",
  [ShipmentStatus.IN_TRANSIT]: "Package is in transit to destination",
  [ShipmentStatus.ARRIVED]: "Package has arrived at destination",
  [ShipmentStatus.IMPORT_CUSTOMS]: "Package is at import customs",
  [ShipmentStatus.OUT_FOR_DELIVERY]: "Package is out for final delivery",
  [ShipmentStatus.DELIVERED]: "Package has been delivered successfully",
  [ShipmentStatus.ON_HOLD]: "Shipment is on hold due to an issue",
  [ShipmentStatus.RETURNED]: "Package has been returned",
  [ShipmentStatus.DAMAGED]: "Package was damaged during transit",
};

// ============================================================================
// Service Type Labels
// ============================================================================

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  [ServiceType.ECONOMY]: "Economy",
  [ServiceType.STANDARD]: "Standard",
  [ServiceType.EXPRESS]: "Express",
  [ServiceType.PRIORITY]: "Priority",
  [ServiceType.SAME_DAY]: "Same Day",
  [ServiceType.NEXT_DAY]: "Next Day",
  [ServiceType.OVERNIGHT]: "Overnight",
};

// ============================================================================
// Shipment Type Labels (Scope)
// ============================================================================

export const SHIPMENT_TYPE_LABELS: Record<ShipmentType, string> = {
  [ShipmentType.DOMESTIC]: "Domestic",
  [ShipmentType.INTERNATIONAL]: "International",
  [ShipmentType.LOCAL]: "Local",
  [ShipmentType.IMPORT]: "Import",
  [ShipmentType.EXPORT]: "Export",
};

// ============================================================================
// Shipment Mode Labels (Transport Method)
// ============================================================================

export const SHIPMENT_MODE_LABELS: Record<ShipmentMode, string> = {
  [ShipmentMode.AIR]: "Air",
  [ShipmentMode.SEA]: "Sea",
  [ShipmentMode.ROAD]: "Road",
  [ShipmentMode.RAIL]: "Rail",
  [ShipmentMode.COURIER]: "Courier",
  [ShipmentMode.MULTIMODAL]: "Multimodal",
};

// ============================================================================
// Consignment Type Labels (Business Classification)
// ============================================================================

export const CONSIGNMENT_TYPE_LABELS: Record<ConsignmentType, string> = {
  [ConsignmentType.SHIPMENT]: "Shipment",
  [ConsignmentType.CONSIGNMENT]: "Consignment",
};

// ============================================================================
// Payment Labels
// ============================================================================

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: "Cash",
  [PaymentMethod.BANK_TRANSFER]: "Bank Transfer",
  [PaymentMethod.CREDIT_CARD]: "Credit Card",
  [PaymentMethod.DEBIT_CARD]: "Debit Card",
  [PaymentMethod.PAYPAL]: "PayPal",
  [PaymentMethod.STRIPE]: "Stripe",
  [PaymentMethod.CRYPTO]: "Cryptocurrency",
  [PaymentMethod.INVOICE]: "Invoice",
  [PaymentMethod.COD]: "Cash on Delivery",
  [PaymentMethod.POD]: "Payment on Delivery",
  [PaymentMethod.PREPAID]: "Prepaid",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "Pending",
  [PaymentStatus.UNPAID]: "Unpaid",
  [PaymentStatus.PAID]: "Paid",
  [PaymentStatus.PARTIAL]: "Partial",
  [PaymentStatus.REFUNDED]: "Refunded",
  [PaymentStatus.FAILED]: "Failed",
};

// ============================================================================
// Currency Labels & Symbols
// ============================================================================

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.USD]: "$",
  [Currency.EUR]: "€",
  [Currency.GBP]: "£",
  [Currency.CAD]: "C$",
  [Currency.AUD]: "A$",
  [Currency.JPY]: "¥",
  [Currency.CNY]: "¥",
  [Currency.INR]: "₹",
  [Currency.NGN]: "₦",
  [Currency.ZAR]: "R",
  [Currency.AED]: "د.إ",
  [Currency.SGD]: "S$",
  [Currency.CHF]: "CHF",
  [Currency.BRL]: "R$",
  [Currency.MXN]: "MX$",
};

export const CURRENCY_NAMES: Record<Currency, string> = {
  [Currency.USD]: "US Dollar",
  [Currency.EUR]: "Euro",
  [Currency.GBP]: "British Pound",
  [Currency.CAD]: "Canadian Dollar",
  [Currency.AUD]: "Australian Dollar",
  [Currency.JPY]: "Japanese Yen",
  [Currency.CNY]: "Chinese Yuan",
  [Currency.INR]: "Indian Rupee",
  [Currency.NGN]: "Nigerian Naira",
  [Currency.ZAR]: "South African Rand",
  [Currency.AED]: "UAE Dirham",
  [Currency.SGD]: "Singapore Dollar",
  [Currency.CHF]: "Swiss Franc",
  [Currency.BRL]: "Brazilian Real",
  [Currency.MXN]: "Mexican Peso",
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format currency amount with symbol
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  return `${symbol}${amount.toFixed(2)}`;
}

/**
 * Get status color class for styling
 */
export function getStatusColorClass(status: ShipmentStatus): string {
  const colorMap: Record<ShipmentStatus, string> = {
    [ShipmentStatus.SHIPMENT_CREATED]: "bg-gray-100 text-gray-800",
    [ShipmentStatus.PICKED_UP]: "bg-blue-100 text-blue-800",
    [ShipmentStatus.EXPORT_CUSTOMS]: "bg-purple-100 text-purple-800",
    [ShipmentStatus.IN_TRANSIT]: "bg-yellow-100 text-yellow-800",
    [ShipmentStatus.ARRIVED]: "bg-teal-100 text-teal-800",
    [ShipmentStatus.IMPORT_CUSTOMS]: "bg-purple-100 text-purple-800",
    [ShipmentStatus.OUT_FOR_DELIVERY]: "bg-orange-100 text-orange-800",
    [ShipmentStatus.DELIVERED]: "bg-green-100 text-green-800",
    [ShipmentStatus.ON_HOLD]: "bg-amber-100 text-amber-800",
    [ShipmentStatus.RETURNED]: "bg-gray-100 text-gray-800",
    [ShipmentStatus.DAMAGED]: "bg-red-100 text-red-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
}

/**
 * Get payment status color class
 */
export function getPaymentStatusColorClass(status: PaymentStatus): string {
  const colorMap: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: "text-yellow-600",
    [PaymentStatus.UNPAID]: "text-red-600",
    [PaymentStatus.PAID]: "text-green-600",
    [PaymentStatus.PARTIAL]: "text-orange-600",
    [PaymentStatus.REFUNDED]: "text-blue-600",
    [PaymentStatus.FAILED]: "text-red-600",
  };
  return colorMap[status] || "text-gray-600";
}
