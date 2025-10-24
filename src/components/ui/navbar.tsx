import Link from "next/link";
import { Button } from "./button";

export function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-50 bg-card py-3 px-4 md:px-8 flex items-center justify-between border-b">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-bold">
          WebBuilder
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          href="/marketplace"
          className="text-sm font-medium hover:underline"
        >
          Marketplace
        </Link>
        <Link href="/dashboard" className="text-sm font-medium hover:underline">
          Dashboard
        </Link>
        <Button variant="outline" size="sm">
          Sign In
        </Button>
      </div>
    </nav>
  );
}
