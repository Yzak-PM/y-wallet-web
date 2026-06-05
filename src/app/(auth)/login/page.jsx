"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import { LoaderIcon } from "lucide-react";
import CustomInput from "@/components/ui/CustomInput";
import { Manufacturing_Consent } from "next/font/google";

const medieval = Manufacturing_Consent({ weight: "400", subsets: ["latin"] });

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const router = useRouter();

  const validate = () => {
    const errors = {};
    if (!username.trim()) errors.username = "User is required.";
    if (!password.trim()) errors.password = "Password is required.";
    return errors;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setError("");
    setLoading(true);
    setFieldErrors({});

    try {
      await api.login(username, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid place-content-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl shadow-2xl p-6 flex flex-col gap-5 w-[calc(100dvw-60px)] md:w-120"
      >
        <h2 className={`${medieval.className} text-5xl text-center`}>
          Yzak Wallet
        </h2>
        <div className="flex flex-col gap-1">
          <label className="font-medium">User:</label>
          <CustomInput
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {fieldErrors.username && (
            <p className="text-red-500 text-xs ms-1">{fieldErrors.username}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium">Password:</label>
          <CustomInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {fieldErrors.password && (
            <p className="text-red-500 text-xs ms-1">{fieldErrors.password}</p>
          )}
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex justify-center cursor-pointer text-semibold bg-gradient-to-br from-blue-800 to-blue-500 text-white hover:bg-gradient-to-tl font-medium rounded-lg py-2"
        >
          {loading ? <LoaderIcon className="animate-spin" /> : "Login"}
        </button>
      </form>
    </div>
  );
}
