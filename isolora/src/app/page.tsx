import Link from "next/link";
import Header from "./components/header";
export default function Home() {
  return (
    <div>
      <Header/>
      <h1 className="text-lg text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
        Isolora, we are coming soon.
      </h1>
      <div className="mt-4 flex justify-center sm:justify-start">
        <Link 
          href="pages/signup"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Signup
        </Link>
      </div>
    </div>
  );
}

