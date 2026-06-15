'use client';
import { useState } from "react";
import { XIcon, LoaderIcon } from "lucide-react";
import CustomInput from "../ui/CustomInput";
import { api } from "@/lib/api";

export default function AccountFormModal({ mode, account, onClose, onSuccess }) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState(() => ({
    name: account?.name || "",
    type: account?.type || "bank",
    nature: account?.nature || "asset",
    color: account?.color || "#3b82f6",
    balance: isEdit ? account?.balance || 0.00 : "",
  }));

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasChanges = isEdit
    ? 
    form.name !== (account?.name || "") ||
    form.type !== account?.type || 
    form.nature !== account?.nature ||
    form.color !== account?.color
    :
    true;

  const validate = () => {
    const errors = {};
    if(!form.name.trim()) errors.name = "Account name is required";
    return errors;
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if(fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if(error) setError(null);
  }

  const handleSubmit = async () => {
    const errors = validate();
    if(Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});
    
    try {
      const payload = {
        name: form.name,
        type: form.type, 
        nature: form.nature,
        color: form.color,
        balance: form.balance,
      }

      if(isEdit) {
        await api.put(`/accounts/${account.id}/`, payload);
      } else {
        await api.post('/accounts/', payload);
      }

      onSuccess();
    } catch(err) {  
      setError(err.response?.data?.name?.[0]
        || err.response?.data?.detail
        || err.message
        || "Something went wrong, please try again later."
      )
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e) => {
    if(e.key === "Escape") onClose();
  }

  const submitDisabled = loading || !hasChanges;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div 
        className="bg-white rounded-xl border border-neutral-200 p-4 w-full max-w-md shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">
            {isEdit ? `Edit account \'${account?.name}\'` : "New account"}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-neutral-400 cursor-pointer hover:bg-neutral-100 rounded-md p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XIcon size={22} />
          </button>
        </div>

        {/* Fields */}
        <div className="grid gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="mx-1 text-sm">Account name:</label>
            <CustomInput
              type="text"
              placeholder="My new account"
              value={form.name}
              onChange={e => handleChange("name", e.target.value)}
              disabled={loading}
            />
            {fieldErrors.name && (
              <p className="text-red-500 text-xs ms-1">
                {fieldErrors.name}
              </p>
            )}
          </div>
          {/* Type */}
          <div className="flex flex-col gap-1">
            <label className="ms-1 text-sm">Type:</label>
            <select
              value={form.type}
              onChange={e => handleChange("type", e.target.value)}
              disabled={loading}
              className="px-3 py-1 bg-neutral-secondary-medium border border-gray-200 rounded-full text-sm focus:ring-brand focus:border-brand shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="credit">Credit</option>
              <option value="loan">Loan</option>
              <option value="savings">Savings</option>
            </select>
          </div>
          {/* Nature */}
          <div className="flex flex-col gap-1">
            <label className="ms-1 text-sm">Nature:</label>
            <select
              value={form.nature}
              onChange={e => handleChange("nature", e.target.value)}
              disabled={loading}
              className="px-3 py-1 bg-neutral-secondary-medium border border-gray-200 rounded-full text-sm focus:ring-brand focus:border-brand shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="asset">Asset</option>
              <option value="liability">Liability</option>
            </select>
          </div>
          {/* Color */}
          <div className="flex gap-3 items-center">
            <label className="ms-1 text-sm">Color:</label>
            <input
              type="color"
              value={form.color}
              onChange={e => handleChange("color", e.target.value)}
              disabled={loading}
              className="rounded-xl cursor-pointer w-12 h-6 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-sm text-neutral-400">{form.color}</span>
          </div>
          {/* Balance */}
          {!isEdit && (
            <div className="flex flex-col gap-1">
              <label className="mx-1 text-sm">Initial balance:</label>
              <CustomInput
                type="number"
                placeholder="1000.00"
                value={form.balance}
                onChange={e => handleChange("balance", e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          {error && (
            <p className="text-red-600 text-sm mt-3">{error}</p>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-2 mt-5">
            <button 
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-neutral-200 text-sm text-neutral-600 font-medium hover:bg-neutral-300 px-4 py-1.5 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitDisabled}
              className="flex items-center justify-center px-4 py-1.5 cursor-pointer rounded-lg text-sm font-medium text-white bg-gradient-to-r from-cyan-400 to-cyan-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading
                ? <LoaderIcon size={18} className="animate-spin" />
                : isEdit ? "Save Changes" : "Create account"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}