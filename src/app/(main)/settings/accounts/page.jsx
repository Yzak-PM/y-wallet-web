'use client';
import AccountCard from "@/components/accounts/accountCard";
import AccountFormModal from "@/components/accounts/accountFormModal";
import MessageContainer from "@/components/ui/MessageContainer";
import SimpleSkeleton from "@/components/ui/SimpleSkeleton";
import { useToast } from "@/context/ToastContext"
import { api } from "@/lib/api";
import { BookmarkPlusIcon } from "lucide-react";
import { LoaderIcon } from "lucide-react";
import { TriangleAlertIcon } from "lucide-react";
import { CircleXIcon } from "lucide-react";
import { CheckCircleIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function Accounts() {
  const { showToast } = useToast();

  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [errorAccounts, setErrorAccounts] = useState(null);

  const [selectedAccount, setSelectedAccount] = useState(null);

  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await api.get("/accounts/");
        setAccounts(data);
      } catch(err) {
        setErrorAccounts(err.message);
      } finally {
        setLoadingAccounts(false);
      }
    }
    fetch();
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/accounts/${selectedAccount.id}`);

      setModalDeleteOpen(false);
      setSelectedAccount(null);
      showToast({
        msg: `${selectedAccount.name} deleted successfully.`,
        color: "green",
        icon: <CheckCircleIcon />
      });
    } catch(err) {
      showToast({
        msg: err.response?.data?.name?.[0]
          || err.response?.data?.detail
          || err.message
          || "Something went wrong, please try again later.",
        color: "red",
        icon: <CircleXIcon />
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="">
        <h1 className="text-center text-xl font-semibold">My accounts</h1>
        <div className="flex justify-end my-3">
          <button
            type="button"
            onClick={() => {
              setFormMode("add");
              setSelectedAccount(null);
              setModalFormOpen(true);
            }}
            className="flex cursor-pointer text-sm bg-gradient-to-br from-blue-800 to-blue-500 text-white hover:bg-gradient-to-tl font-medium rounded-lg py-2 ps-2 pe-3 text-center"
          >
            <BookmarkPlusIcon /> New account
          </button>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[calc(100vh-330px)] overflow-auto">
          {loadingAccounts //Loading
            ? Array.from({ length: 7 }).map((_, i) => (
              <SimpleSkeleton key={i} className="mb-2 h-10" />
            ))
            : errorAccounts // Error
              ? <MessageContainer title="Error loading accounts" msg={errorAccounts} type={error} />
              : accounts.length === 0 // Empty
                ? <div className="col-span-full"><MessageContainer title="No accounts found" msg="Add your first account to get started" type="empty" /></div>
                : accounts.map(account => ( // Map
                  <AccountCard 
                    key={account.id} 
                    account={account} 
                    onEdit={() => {
                      setModalFormOpen(true);
                      setSelectedAccount(account);
                      setFormMode("edit");
                    }} 
                    onDelete={() => {
                      setModalDeleteOpen(true);
                      setSelectedAccount(account);
                    }} 
                  />
                ))
          }
        </div>
      </div>

      {modalFormOpen && (
        <AccountFormModal 
          account={selectedAccount}
          mode={formMode}
          onClose={() => setModalFormOpen(false)}
          onSuccess={() => {
            setModalFormOpen(false);
            showToast({
              msg: `Account saved successfully.`,
              color: "green",
              icon: <CheckCircleIcon />
            })
          }}
        />
      )}

      {modalDeleteOpen && (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3"
            onClick={() => setModalDeleteOpen(false)} 
          >
            <div
              className="bg-white rounded-xl border border-neutral-200 p-4 w-full max-w-md shadow-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col gap-5 justify-center text-center">
                <div className="flex flex-col items-center text-center gap-1">
                  <div className="bg-red-100 p-2 rounded-full">
                    <TriangleAlertIcon className="text-red-700" size={30} />
                  </div>
                  <h2 className="font-semibold text-xl">Delete &quot;{selectedAccount.name}&quot; </h2>
                </div>
                <p>Are you sure you want to delete this account?</p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setModalDeleteOpen(false)}
                    className="bg-neutral-200 text-sm text-neutral-600 font-medium hover:bg-neutral-400 hover:text-white px-4 py-1 rounded-lg cursor-pointer ">
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete} 
                    disabled={deleting}
                    className="border-2 text-sm border-red-600 text-red-600 font-medium hover:text-white hover:bg-red-600 px-4 py-1 rounded-lg cursor-pointer transition-colors"
                  >
                    {deleting
                    ? <LoaderIcon className="animate-spin"/>
                    : "Delete"
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
      )}
    </>
  )
}