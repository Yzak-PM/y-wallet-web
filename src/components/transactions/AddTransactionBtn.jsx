"use client";
import { useRouter } from "next/navigation";

export default function AddTransactionBtn() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/transactions/new");
  };

  return (
    <div className="fixed bottom-4 right-4" onClick={handleClick}>
      <button className="bg-gradient-to-br from-cyan-500 to-blue-500 hover:bg-gradient-to-bl text-white text-3xl font-bold py-2 px-4 rounded-full shadow-lg">
        +
      </button>
    </div>
  );
}
