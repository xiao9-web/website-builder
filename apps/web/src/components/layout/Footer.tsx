import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-gray-600"
            >
              Documentation
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-gray-600"
            >
              Support
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-gray-600"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-gray-600"
            >
              Terms
            </Link>
          </div>
          <div className="mt-4 md:order-1 md:mt-0">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} WebBuilder. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
