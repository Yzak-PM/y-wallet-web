"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createTransaction } from "@/services/transactions";
import { api } from "@/lib/api";
import TagInput from "@/components/ui/TagInput";
import CustomSelect from "../ui/CustomSelect";

const TYPES = ["Expense", "Income", "Movement"];

const INITIAL_STATE = {
  amount: "",
  type: "expense",
  date: new Date().toISOString().split("T")[0],
  category: "",
  description: "",
  account: "",
};

function validate(fields) {
  const errors = {};
  if (!fields.description) errors.description = "description is required";
  if (
    !fields.amount ||
    isNaN(Number(fields.amount)) ||
    Number(fields.amount) <= 0
  )
    errors.amount = "Add a valid amount greater than 0";
  if (!fields.date) errors.date = "Date is required";
  if (!fields.category) errors.category = "Category is required";
  if (!fields.account) errors.account = "Account is required";
  return errors;
}

export default function TransactionForm() {
  const router = useRouter();
  const [fields, setFields] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    api
      .get("/accounts/")
      .then((data) => {
        setAccounts(data);
        setFields((prev) => ({ ...prev, account: data[0]?.id ?? "" }));
      })
      .catch((err) => setErrors(err.message))
      .finally(() => setLoadingAccounts(false));
  }, []);

  useEffect(() => {
    api
      .get("/categories/")
      .then((data) => {
        setCategories(data);
        setFields((prev) => ({ ...prev, category: data[0]?.id ?? "" })); // 👈
      })
      .catch((err) => setErrors(err.message))
      .finally(() => setLoadingCategories(false));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // limpiar error del campo al editar
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");

    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        amount: Math.abs(Number(fields.amount)),
        date: fields.date,
        category: fields.category,
        description: fields.description.trim() || null,
        account: fields.account,
        type: fields.type.toLowerCase(), //to lower para que funcione con el backend
				destination_account: fields.destination_account,
      };

      await createTransaction(payload);
      router.push("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Error, please try again.";
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  const isValid = Object.keys(validate(fields)).length === 0;
  const isMovement = fields.type === "Movement";

  return (
    <form onSubmit={handleSubmit} noValidate className="h-screen">
      <div
        className={`grid gap-3 content-end grid-cols-2 sm:grid-cols-3`}
      >
        <div className="flex flex-col">
          {isMovement && (
            <label htmlFor="" className="text-white text-xs">
              -
            </label>
          )}
          <CustomSelect
            name="type"
            value={fields.type}
            onChange={handleChange}
            disabled={isLoading}
            className={isMovement ? "max-h-7" : ""}
            options={TYPES.map((t) => ({ id: t, label: t }))}
          />
        </div>

				{!isMovement && 
					<div className="flex flex-col">
						<CustomSelect
							name="category"
							value={fields.category}
							onChange={handleChange}
							disabled={isLoading || loadingCategories}
							className={isMovement ? "max-h-7" : ""}
							options={categories.map((cat) => ({
								id: cat.id,
								label: `${cat.icon} ${cat.title}`,
							}))}
						/>
					</div>
				}

        <div className="flex flex-col">
          {isMovement && (
            <label htmlFor="" className="text-neutral-500 text-xs">
              Origin account:
            </label>
          )}
          <CustomSelect
            name="account"
            value={fields.account}
            onChange={handleChange}
            disabled={isLoading || loadingAccounts}
            options={accounts
              .filter((acc) => !isMovement || acc.nature === "asset")
              .map((acc) => ({
                id: acc.id,
                label: acc.name + ` ($${acc.balance})`,
              }))}
          />
        </div>

        {isMovement && (
          <div className="flex flex-col">
            <label htmlFor="" className="text-neutral-500 text-xs">
              Destination account:
            </label>
            <CustomSelect
              name="destination_account"
              value={fields.destination_account}
              onChange={handleChange}
              disabled={isLoading || loadingAccounts}
              options={accounts.map((acc) => ({
                id: acc.id,
                label: acc.name + ` ($${acc.balance})`,
              }))}
            />
          </div>
        )}
      </div>

      <hr className="h-px mb-8 mt-8 bg-neutral-300 border-0" />

      <div className="relative z-0">
        <input
          type="text"
          id="description"
          name="description"
          value={fields.description}
          onChange={handleChange}
          className="block py-2.5 px-0 w-full text-4xl text-heading bg-transparent border-0 appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
          placeholder=" "
        />
        <label className="absolute text-4xl text-gray-500 duration-300 transform -translate-y-9 scale-40 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-40 peer-focus:-translate-y-9 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
          Description
        </label>
        <p className="text-red-500 text-sm">{errors.description}</p>
      </div>

      <div className="relative z-0 mt-4">
        <input
          type="number"
          id="amount"
          name="amount"
          value={fields.amount}
          onChange={handleChange}
          className="block py-2.5 px-0 w-full text-4xl text-heading bg-transparent border-0 appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
          placeholder=" "
        />
        <label
          htmlFor="amount"
          className="absolute text-4xl text-gray-500 duration-300 transform -translate-y-9 scale-40 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-40 peer-focus:-translate-y-9 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
        >
          Amount
        </label>
        <p className="text-red-500 text-sm">{errors.amount}</p>
      </div>

      <hr className="h-px my-8 bg-neutral-300 border-0" />

      <input
        type="date"
        name="date"
        onChange={handleChange}
        value={fields.date ?? new Date().toISOString().split("T")[0]}
        className="w-full rounded-full border border-neutral-300 px-3 py-1"
      />

      <div className="mt-4">
        <TagInput
          value={fields.tags}
          onChange={(tags) => setFields((prev) => ({ ...prev, tags }))}
        />
      </div>
      {serverError && (
        <p className="text-red-600 text-center mt-4">{serverError}</p>
      )}

      <div className="fixed bottom-3 right-3">
        <button
          type="submit"
          className={`text-white bg-gradient-to-r from-teal-400 to-blue-600 cursor-pointer hover:bg-gradient-to-br disabled:bg-gradient-to-r disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:${isLoading ? "cursor-progress" : "cursor-not-allowed"} rounded-full text-md font-bold px-6 py-2 text-center`}
          disabled={isLoading || !isValid}
        >
          {isLoading ? "Submitting..." : "Create Transaction"}
        </button>
      </div>
    </form>
  );
}
