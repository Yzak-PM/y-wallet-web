  'use client';
  import { useState } from "react"
  import { api } from "@/lib/api"
  import { useEffect } from "react";
  import { TriangleAlertIcon, BookmarkPlusIcon, CheckCircleIcon, CircleXIcon, LoaderIcon } from "lucide-react";
  import { useToast } from "@/context/ToastContext";
  import ItemCard from "@/components/categories/ItemCard";
  import SimpleSkeleton from "@/components/ui/SimpleSkeleton";
  import ItemFormModal from "@/components/categories/ItemFormModal";
  import MessageContainer from "@/components/ui/MessageContainer";
  
  export default function Categories() {
    const { showToast } = useToast();

    const [categories, setCategories] = useState([]);
    const [loadingCats, setLoadingCats] = useState(true);
    const [errorCats, setErrorCats] = useState(null);
    const [refreshCats, setRefreshCats] = useState(0);
    
    const [tags, setTags] = useState([]);
    const [loadingTags, setLoadingTags] = useState(true);
    const [errorTags, setErrorTags] = useState(null);
    const [refreshTags, setRefreshTags] = useState(0);
    
    const [selectedItem, setSelectedItem] = useState(null);
    const [formItemMode, setFormItemMode] = useState("add");
    
    const tabs = ["categories", "tags"];
    const [selectedSection, setSelectedSection] = useState("categories");
    const items = selectedSection === "categories" ? categories : tags;
    const selectedSectionSing = selectedSection === "categories" ? "Category" : "Tag";

    const [modalFormItemOpen, setModalFormItemOpen] = useState(false);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [deletingItem, setDeletingItem] = useState(false);

    useEffect(() => {
      const fetch = async () => {
        try {
          const data = await api.get("/api/categories/");
          setCategories(data);
        } catch(err) {
          setErrorCats(err.message);
        } finally {
          setLoadingCats(false);
        }
      }
      fetch();
    }, [refreshCats]);

    useEffect(() => {
      const fetch = async () => {
        try { 
          const data = await api.get("/api/tags/");
          setTags(data);
        } catch(err) {
          setErrorTags(err.message);
        } finally {
          setLoadingTags(false);
        }
      }
      fetch();
    }, [refreshTags]);

    const handleDelete = async () => {
      setDeletingItem(true);
      try {
        const endpoint = selectedSection === "categories"
          ? `/categories/${selectedItem.id}/`
          : `/tags/${selectedItem.id}/`;

        await api.delete(endpoint);

        setModalDeleteOpen(false);
        setSelectedItem(null);
        showToast({
          msg: `${selectedSectionSing} deleted successfully.`,
          color: "green",
          icon: <CheckCircleIcon />
        });
        
        selectedSection === "categories"
          ? setRefreshCats(prev => prev + 1)
          : setRefreshTags(prev => prev + 1); 
      } catch(err) {
        showToast({
          msg: err.message || "Failed to delete.",
          color: "red",
          icon: <CircleXIcon />
        })
      } finally {
        setDeletingItem(false);
      }
    }

    return (
      <>
        <div className="p-1 flex gap-1 rounded-xl bg-gradient-to-r from-blue-800 to-blue-400 backdrop-blur-md">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedSection(tab)}
              className={`
                flex-1 py-2 px-4 rounded-lg text-sm transition-all duration-200 capitalize cursor-pointer
                ${selectedSection === tab
                  ? "bg-white/25 border border-white/30 text-white font-medium backdrop-blur-xl"
                  : "text-white/70 hover:text-white hover:bg-white/10"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-3 px-2">
          <h1 className="text-center text-xl font-semibold">My {selectedSection}</h1>
          <div className="flex justify-end my-3">
            <button 
              type="button" 
              onClick={() => {
                setFormItemMode("add");
                setSelectedItem(null);
                setModalFormItemOpen(true);
              }}
              className="flex cursor-pointer text-sm bg-gradient-to-br from-blue-800 to-blue-500 text-white hover:bg-gradient-to-tl font-medium rounded-lg py-2 ps-2 pe-3 text-center">
              <BookmarkPlusIcon /> New {selectedSectionSing.toLocaleLowerCase()}
            </button>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[calc(100vh-330px)] overflow-auto">
            {(selectedSection === "categories" ? loadingCats : loadingTags)
            // Loading
            ? Array.from({ length: 9 }).map((_, i) => (
                <SimpleSkeleton key={i} className="mb-2 h-10"/>
              ))
              // Error
            : (selectedSection === "categories" ? errorCats : errorTags)
              ? <MessageContainer title={`Error loading ${selectedSection}`} msg={errorCats || errorTags} type="error"/>
              : items.length === 0
                // Empty
                ? <div className="col-span-full"><MessageContainer title={`No ${selectedSection} yet`} msg={`Add your first ${selectedSectionSing.toLocaleLowerCase()} to get started.`} type="empty"/></div>
                : items.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onEdit={() => {
                    setSelectedItem(item);
                    setModalFormItemOpen(true);
                    setFormItemMode("edit");
                  }}
                  onDelete={() => {
                    setSelectedItem(item);
                    setModalDeleteOpen(true);
                  }}
                />
              ))
            }     
            </div>
        </div>

        {modalFormItemOpen && (
          <ItemFormModal 
            mode={formItemMode} 
            section={selectedSection} 
            item={selectedItem} 
            onClose={() => setModalFormItemOpen(false)}
            onSuccess={() => {
              setModalFormItemOpen(false);
              showToast({
                msg: `${selectedSectionSing} saved successfully.`,
                color: "green",
                icon: <CheckCircleIcon />
              })
              selectedSection === "categories"
                ? setRefreshCats(prev => prev + 1)
                : setRefreshTags(prev => prev + 1)
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
                  <h2 className="font-semibold text-xl">Delete &quot;{selectedItem.name}{selectedItem.title}&quot; </h2>
                </div>
                <p>Are you sure you want to delete this item?</p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setModalDeleteOpen(false)}
                    className="bg-neutral-200 text-sm text-neutral-600 font-medium hover:bg-neutral-400 hover:text-white px-4 py-1 rounded-lg cursor-pointer ">
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete} 
                    disabled={deletingItem}
                    className="border-2 text-sm border-red-600 text-red-600 font-medium hover:text-white hover:bg-red-600 px-4 py-1 rounded-lg cursor-pointer transition-colors"
                  >
                    {deletingItem
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