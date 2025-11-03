import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      <div className="flex justify-between items-center p-4 bg-white shadow-md flex-none">
        <div>VendorDemoApp</div>
        <div className="flex gap-2">
          <Link href="/auth/signin">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] cursor-pointer">
              Login
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button
              variant="outline"
              className="hover:shadow-lg transform hover:scale-[1.02] cursor-pointer"
            >
              Sign Up
            </Button>
          </Link> 
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center items-center bg-gray-50">
        <h1 className="text-2xl font-semibold mb-2">Welcome to the Home Page</h1>
        <p className="text-gray-600">
          This is the main landing page of the application.
        </p>
      </div>
    </div>
  );
}
