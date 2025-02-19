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
  }).format(amount);
}
