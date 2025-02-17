import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid place-items-center">
      <div>
        <h2 className="text-3xl font-bold mb-4">404 Not Found</h2>
        <p className="text-gray-600 mb-1">Could not find requested resource</p>
        <Link href="/" className="text-blue-500 hover:underline">
          Return Home
        </Link>
      </div>
    </div>
  );
}
