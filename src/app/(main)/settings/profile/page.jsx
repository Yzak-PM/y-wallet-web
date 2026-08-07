"use client";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { PencilIcon, SaveIcon, LoaderIcon } from "lucide-react";
import CustomInput from "@/components/ui/CustomInput";
import SimpleSkeleton from "@/components/ui/SimpleSkeleton";

export default function Account() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPost, setLoadingPost] = useState(false);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [nameInitials, setNameInitials] = useState("NA");

  const [fieldErrors, setFieldErrors] = useState({});

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  });

  function formatNameInitials(firstName, lastName) {
    return (
      (firstName[0] ?? "").toUpperCase() + (lastName[0] ?? "").toUpperCase()
    );
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.get("/api/users/me/");
        setUser(data);

        setForm({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          username: data.username || "",
          email: data.email || "",
        });

        setNameInitials(formatNameInitials(data.first_name, data.last_name));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  const hasChanges =
    form.firstName !== (user?.first_name || "") ||
    form.lastName !== (user?.last_name || "") ||
    form.username !== (user?.username || "") ||
    form.email !== (user?.email || "");

  const validate = () => {
    const errors = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.lastName.trim()) errors.lastName = "Last name is required";
    if (!form.username.trim()) errors.username = "Username is required";
    if (!form.email.trim()) errors.email = "Email is required";
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoadingPost(true);
    setError(null);
    setFieldErrors({});

    try {
      const payload = {
        first_name: form.firstName,
        last_name: form.lastName,
        username: form.username,
        email: form.email,
      };

      const data = await api.patch("/api/users/me/", payload);
      setUser(data);
      setForm({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        username: data.username || "",
        email: data.email || "",
      });
    } catch (err) {
      setError(
        err.response?.data?.name?.[0] ||
          err.response?.data?.detail ||
          err.message ||
          "Something went wrong, please try again later.",
      );
    } finally {
      setLoadingPost(false);
    }
  };

  const submitDisabled = loadingUser || !hasChanges || loadingPost;

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <div
          className={`relative inline-flex items-center justify-center w-30 h-30 overflow-hidden rounded-full cursor-pointer
            ${loadingUser ? "bg-neutral-300 animate-pulse" : "bg-indigo-400"}`}
        >
          <span className="font-medium text-white text-5xl">
            {!loadingUser && nameInitials}
          </span>
        </div>
      </div>
      <div className="text-center mt-4">
        {isEditing ? (
          <>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex flex-col gap-1">
                <label className="ms-2 text-sm text-start font-medium">
                  First name:
                </label>
                <CustomInput
                  type="text"
                  value={form.firstName}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, firstName: e.target.value }));
                    setNameInitials(
                      formatNameInitials(e.target.value, form.lastName),
                    );
                  }}
                />
                {fieldErrors.firstName && (
                  <p className="text-red-500 text-start text-xs ms-1">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="ms-2 text-sm text-start font-medium">
                  Last name:
                </label>
                <CustomInput
                  type="text"
                  value={form.lastName}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, lastName: e.target.value }));
                    setNameInitials(
                      formatNameInitials(form.firstName, e.target.value),
                    );
                  }}
                />
                {fieldErrors.lastName && (
                  <p className="text-red-500 text-start text-xs ms-1">
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="ms-2 text-sm text-start font-medium">
                  Username:
                </label>
                <CustomInput
                  type="text"
                  value={form.username}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, username: e.target.value }))
                  }
                />
                {fieldErrors.username && (
                  <p className="text-red-500 text-start text-xs ms-1">
                    {fieldErrors.username}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="ms-2 text-sm text-start font-medium">
                  Email:
                </label>
                <CustomInput
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-start text-xs ms-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-5 flex justify-center items-center gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNameInitials(
                    formatNameInitials(user?.first_name, user?.last_name),
                  );
                }}
                className="bg-neutral-200 text-sm text-neutral-600 font-medium hover:bg-neutral-400 hover:text-white py-2 ps-2 pe-3 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleSubmit();
                  setIsEditing(false);
                }}
                disabled={submitDisabled}
                className="cursor-pointer text-sm bg-gradient-to-br from-green-700 to-green-500 text-white hover:bg-gradient-to-tl font-medium rounded-lg py-2 ps-2 pe-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingPost ? (
                  <LoaderIcon size={18} className="animate-spin" />
                ) : (
                  <span className="flex items-center">
                    <SaveIcon className="me-2" /> Save Changes
                  </span>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            {loadingUser ? (
              <>
                <SimpleSkeleton
                  position="center"
                  width="30"
                  className="h-4 mb-2"
                />
                <SimpleSkeleton
                  position="center"
                  width="45"
                  className="h-4 mb-2"
                />
                <SimpleSkeleton
                  position="center"
                  width="20"
                  className="h-4 mb-2"
                />
              </>
            ) : (
              <>
                <h3 className="text-xl font-medium">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-neutral-500">{user?.email}</p>
                <p className="text-neutral-500">({user?.username})</p>
              </>
            )}

            {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
            <button
              onClick={() => setIsEditing(true)}
              disabled={loadingUser}
              className="cursor-pointer text-sm mt-5 bg-gradient-to-br from-blue-800 to-blue-500 text-white hover:bg-gradient-to-tl font-medium rounded-lg py-2 ps-2 pe-3 disabled:opacity-50 disabled:cursor-progress"
            >
              <span className="flex">
                <PencilIcon className="me-2" /> Edit account
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
