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
