'use client';
import { useState } from "react";
import { XIcon, LoaderIcon } from "lucide-react";
import CustomInput from "../ui/CustomInput";
import { api } from "@/lib/api";

export default function ItemFormModal({ mode, section, item, onClose, onSuccess }) {
  const isEdit = mode === "edit";
  const isCategory = section === "categories";
  const endpoint = isCategory ? "/categories/" : "/tags/";
  const label = isCategory ? "Category" : "Tag";

  const [form, setForm] = useState(() => ({
    color: item?.color || "#3b82f6",
    type: item?.type || "expense",
    title: isEdit ? item?.title || "" : "",
    description: isEdit ? item?.description || "" : "",
    name: isEdit ? item?.name || "" : "",
    icon: isEdit ? item?.icon || "" : "",
  }));

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Detectar si el form cambió respecto al item original (solo en edit)
  const hasChanges = isEdit
    ? isCategory
      ? form.title !== (item?.title || "") ||
        form.description !== (item?.description || "") ||
        form.color !== item?.color ||
        form.type !== item?.type ||
        form.icon !== (item?.icon || "")
      : form.name !== (item?.name || "") ||
        form.color !== item?.color 
    : true;

  const validate = () => {
    const errors = {};
    if (isCategory) {
      if (!form.title.trim()) errors.title = "Title is required";
      if (!form.icon.trim()) errors.icon = "Icon is required";
    } else {
      if (!form.name.trim()) errors.name = "Name is required";
    }
    return errors;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const payload = isCategory
        ? { color: form.color, type: form.type, title: form.title, description: form.description, icon: form.icon[0] }
        : { color: form.color, name: form.name};

      if (isEdit) {
        await api.put(`${endpoint}${item.id}/`, payload);
      } else {
        await api.post(endpoint, payload);
      }

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.name?.[0]     
        || err.response?.data?.detail
        || err.message
        || "Something went wrong, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Cerrar con Escape
  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };

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
            {isEdit ? `Edit ${label}: ${item?.title || item?.name}` : `New ${label}`}
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

          {/* Title (category) / Name (tag) */}
          <div className="flex flex-col gap-1">
            <label className="ms-1 text-sm">
              {isCategory ? "Title" : "Name"}: <span className="text-red-400">*</span>
            </label>
            <CustomInput
              type="text"
              placeholder={isCategory ? "e.g. Food" : "e.g. family"}
              value={isCategory ? form.title : form.name}
              onChange={e => handleChange(isCategory ? "title" : "name", e.target.value)}
              disabled={loading}
            />
            {(fieldErrors.title || fieldErrors.name) && (
              <p className="text-red-500 text-xs ms-1">
                {fieldErrors.title || fieldErrors.name}
              </p>
            )}
          </div>

          {/* Type — solo categories */}
          {isCategory && (
            <>
              <div className="flex flex-col gap-1">
                <label className="ms-1 text-sm">Type:</label>
                <select
                  value={form.type}
                  onChange={e => handleChange("type", e.target.value)}
                  disabled={loading}
                  className="px-3 py-1 bg-neutral-secondary-medium border border-gray-200 rounded-full text-sm focus:ring-brand focus:border-brand shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="ms-1 text-sm">
                  Icon: <span className="text-red-400">*</span>
                </label>
                <CustomInput
                  type="text"
                  placeholder="e.g. 🏠"
                  value={form.icon}
                  onChange={e => handleChange("icon", e.target.value)}
                  disabled={loading}
                />
                {fieldErrors.icon && (
                  <p className="text-red-500 text-xs ms-1">{fieldErrors.icon}</p>
                )}
              </div>
            </>
          )}

          {/* Description — solo categories, opcional */}
          {isCategory && (
            <div className="flex flex-col gap-1">
              <label className="ms-1 text-sm">
                Description: <span className="text-neutral-400 text-xs">(optional)</span>
              </label>
              <CustomInput
                type="text"
                placeholder="Short description for this category"
                value={form.description}
                onChange={e => handleChange("description", e.target.value)}
                disabled={loading}
              />
            </div>
          )}
        </div>

        {/* Error general */}
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
              : isEdit ? "Save Changes" : `Create ${label}`
            }
          </button>
        </div>
      </div>
    </div>
  );
}