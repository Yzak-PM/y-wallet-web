'use client';
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
}

function validate(fields){
    const errors = {};
    if (!fields.amount || isNaN(Number(fields.amunt)) || Number(fields.amount) <= 0)
        errors.amount = "Add a valid amount greater than 0";
    if(!fields.date)
        errors.date = "Date is required";
    if(!fields.category)
        errors.category = "Date is required";
    if(!fields.account)
        errors.account = "Date is required";
    return errors;
}

export default function TransactionForm() {
    const router = useRouter();
    const [fields,  setFields] = useState(INITIAL_STATE);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        api.get("/accounts/")
        .then(setAccounts)
        .catch((err) => setErrors(err.message))
        .finally(() => setLoadingAccounts(false));
    }, []);

    useEffect(() => {
        api.get("/categories/")
        .then(setCategories)
        .catch((err) => setErrors(err.message))
        .finally(() => setLoadingCategories(false));
    }, []);

    function handleChange(e){
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

        try{
            const payload = {
                amount: fields.type === "Expense"
                    ? -Math.abs(Number(fields.amount))      
                    :  Math.abs(Number(fields.amount)),
                date: fields.date,
                category: fields.category,
                description: fields.description.trim() || null,
                account: fields.account,
                type: fields.type,
            };

            await createTransaction(payload);
            router.push("/dashboard");
        } catch (err) {
            const msg = err?.response?.data?.message
                        || err?.message
                        || "Erro, please try again.";
            setServerError(msg);
        } finally {
            setIsLoading(false);
        }
    }

    const isValid = Object.keys(validate(fields)).length === 0;
    const isMovement = fields.type === "Movement";

    return (
        <form onSubmit={handleSubmit} noValidate>
            {serverError && (
                <p className="text-red-600">
                    {serverError}
                </p>
            )}

            <div className={`grid gap-3 content-end ${isMovement ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
                <div className="flex flex-col">
                    { isMovement && 
                        <label htmlFor="" className="text-white text-xs">-</label>
                    }
                    <CustomSelect
                        name="type"
                        value={fields.type}
                        onChange={handleChange}    
                        disabled={isLoading}
                        className={ isMovement ? "max-h-7" : ""}
                        options={ TYPES.map((t) => (
                            { id: t, label: t}
                        ))}
                    />
                </div>

                <div className="flex flex-col">
                    { isMovement && 
                        <label htmlFor="" className="text-white text-xs">-</label>
                    }
                    <CustomSelect 
                        name="category"
                        value={fields.category}
                        onChange={handleChange}
                        disabled={isLoading || loadingCategories}
                        className={ isMovement ? "max-h-7" : ""}
                        options={categories.map((cat) => (
                            { id: cat.id, label: `${cat.icon} ${cat.title}`}
                        ))}
                    />
                </div>
                
                <div className="flex flex-col">
                    { isMovement && 
                        <label htmlFor="" className="text-neutral-500 text-xs">Origin account:</label>
                    }
                    <CustomSelect 
                        name="account"
                        value={fields.account}
                        onChange={handleChange}
                        disabled={isLoading || loadingAccounts}
                        options={ accounts
                                        .filter((acc) => !isMovement || acc.nature === "asset")
                                        .map((acc) => (
                                            { id: acc.id, label: acc.name}
                                        ))
                                }
                    />
                </div>

                {isMovement && (
                    <div className="flex flex-col">
                        <label htmlFor="" className="text-neutral-500 text-xs">Destination account:</label>
                        <CustomSelect 
                            name="destination_account"
                            value={fields.destination_account}
                            onChange={handleChange}
                            disabled={isLoading || loadingAccounts}
                            options={ accounts.map((acc) => (
                                { id: acc.id, label: acc.name }
                            ))}
                        />
                    </div>
                )}
            </div>

            <div className="relative z-0">
                <input type="text" id="description" className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " />
                <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                    Description
                </label>
            </div>

            <div className="relative z-0">
                <input type="number" id="amount" className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " />
                <label htmlFor="amount" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-900 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                    Amount
                </label>
            </div>

            <TagInput 
                value={fields.tags}
                onChange={(tags) => setFields((prev) => ({ ...prev, tags}))}
            />
        </form>
    )
}