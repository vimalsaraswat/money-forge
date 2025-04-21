import { NoSidebarRoutes } from "@/config/data";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomColor() {
  const getRandomColorComponent = () => {
    return Math.floor(Math.random() * 150) + 50;
  };

  const r = getRandomColorComponent();
  const g = getRandomColorComponent();
  const b = getRandomColorComponent();

  return `rgb(${r},${g},${b})`;
}

export function capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
  const dateObj = new Date(date);
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });

  return formatter.format(dateObj);
}

export function noSidebar(pathname: string) {
  return (
    NoSidebarRoutes?.some((route) => {
      if (route?.endsWith("*")) {
        const baseRoute = route?.slice(0, -1);
        return pathname?.startsWith(baseRoute);
      }
      return pathname === route;
    }) ?? false
  );
}

function escapeCsvField(field: string | number | Date | null): string {
  if (field === null || typeof field === "undefined") {
    return "";
  }

  const stringField = String(field);

  if (
    stringField.includes(",") ||
    stringField.includes('"') ||
    stringField.includes("\n")
  ) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }

  return stringField;
}

// Helper to convert data to CSV
export function generateCsv(
  data: Record<string, string | number | Date | null>[],
  headers: string[],
): string {
  if (!data || data.length === 0) return "";

  const headerRow = ["Id", ...headers].map(escapeCsvField).join(",");

  const dataRows = data.map((row, index) => {
    const values = headers.map((header) => {
      const value = row[header];
      return escapeCsvField(value);
    });
    return [String(index + 1), ...values].join(",");
  });

  return [headerRow, ...dataRows].join("\n");
}
