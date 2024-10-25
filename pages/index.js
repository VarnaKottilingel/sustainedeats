import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Food Waste Identifier</h1>
      <Link href="/add-item" legacyBehavior>
        <a className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Add Items to Inventory
        </a>
      </Link>
    </div>
  );
}
