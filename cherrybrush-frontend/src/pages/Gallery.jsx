import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext";
import { FaPlus, FaTrash, FaTimes, FaMagic } from "react-icons/fa";
import SortableUploader from "../components/SortableUploader";
import api from "../api/axiosinstance";

export function Gallery() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [files, setFiles] = useState([]);
  const [addImageOverlay, setAddImageOverlay] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateTitle = (id, newTitle) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, title: newTitle } : f))
    );
  };

  const handleAutoName = (index) => {
    const baseTitle = files[index].title;
    if (!baseTitle) return;

    setFiles((prev) =>
      prev.map((f, i) => {
        if (i === index) return f;
        return { ...f, title: `${baseTitle}-${i}` };
      })
    );
  };

  const handleAddImage = async () => {
    // Validate titles before sending
    if (files.some((f) => !f.title || f.title.trim() === "")) {
      alert("All images must have a title before publishing!");
      return;
    }

    const formData = new FormData();
    files.forEach((f) => {
      formData.append("image", f.file);
      formData.append("titles", f.title);
    });

    try {
      const response = await api.post("/api/auth/gallery/add", formData);
      console.log(response.data);
      // Refresh gallery after add
      fetchGallery();
      alert(
        `Successfully added ${files.length} images with their respective titles!`
      );
      setAddImageOverlay(false);
      setFiles([]); // Clear after add
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to upload images. Please check your connection.");
    }
  };

  const handleDeleteImage = async (asset_id) => {
    console.log(asset_id);
    try {
      const res = await api.delete(`/api/auth/gallery/delete/${asset_id}`);
      console.log(res.data);
      fetchGallery();
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  };

  const fetchGallery = async (cursor = null) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/api/auth/gallery?cursor=${cursor || ""}`);
      const data = res.data;
      console.log(data);
      const newResources = data.resources || data;

      if (cursor) {
        setGallery((prev) => [...prev, ...newResources]);
      } else {
        setGallery(newResources);
      }

      setNextCursor(data.next_cursor || null);
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  return (
    <div className="bg-white min-h-screen py-10 px-6 md:px-10 font-sans">
      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]"
            onClick={() => setSelectedImage(null)}
          >
            <FaTimes size={32} />
          </button>

          <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
            <img
              src={selectedImage.secure_url || selectedImage.url}
              alt={selectedImage.display_name}
              className="max-w-full max-h-[85vh] object-contain shadow-2xl animate-in zoom-in-95 duration-500"
            />
            <div className="mt-8 text-center">
              <h3 className="text-white text-xl font-bold tracking-widest uppercase">
                {selectedImage.context?.custom?.caption ||
                  selectedImage.display_name}
              </h3>
              <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mt-2">
                Showcase Collection Item
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Image Overlay */}
      {addImageOverlay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tighter uppercase">
                Add To Gallery
              </h2>
              <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">
                Upload and name your showcase items
              </p>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 space-y-6">
              <SortableUploader files={files} setFiles={setFiles} />
              {files.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  {files.map((f, index) => (
                    <div key={f.id} className="flex gap-4 items-center">
                      <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={URL.createObjectURL(f.file)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex gap-2 items-center bg-gray-50 px-4 py-2.5 rounded-lg border border-transparent focus-within:border-black transition-all">
                        <input
                          type="text"
                          placeholder="Give this image a name..."
                          value={f.title || ""}
                          onChange={(e) =>
                            handleUpdateTitle(f.id, e.target.value)
                          }
                          className="flex-1 bg-transparent border-none text-sm outline-none italic placeholder:text-gray-300"
                        />
                        {f.title && (
                          <button
                            onClick={() => handleAutoName(index)}
                            title="Auto-name all based on this"
                            className="bg-black text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-gray-800 transition-colors"
                          >
                            <FaMagic size={10} />
                            <span className="text-[10px] font-bold uppercase">
                              Auto
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => {
                  setAddImageOverlay(false);
                  setFiles([]);
                }}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddImage}
                disabled={
                  files.length === 0 ||
                  files.some((f) => !f.title || f.title.trim() === "")
                }
                className={`px-8 py-2.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
                  files.length === 0 ||
                  files.some((f) => !f.title || f.title.trim() === "")
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Publish Items
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">
            Product Showcase
          </p>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-6">
            Gallery
          </h1>
          <div className="h-1 w-20 bg-black mx-auto"></div>

          {isAdmin && (
            <button
              onClick={() => setAddImageOverlay(true)}
              className="mt-8 flex items-center gap-2 mx-auto bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all rounded-md shadow-lg"
            >
              <FaPlus size={12} /> Add New Image
            </button>
          )}
        </div>

        {/* Gallery Content */}
        {isLoading && !gallery.length ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="relative bg-gray-100 rounded-sm overflow-hidden animate-pulse break-inside-avoid"
                style={{ height: `${[300, 400, 250, 450][i % 4]}px` }}
              >
                <div className="absolute inset-x-6 bottom-6 space-y-2">
                  <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                  <div className="h-2 w-1/3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 transition-all duration-1000">
            {gallery.map((img, i) => (
              <div
                key={img.public_id || i}
                onClick={() => setSelectedImage(img)}
                className="relative group overflow-hidden bg-gray-100 break-inside-avoid rounded-sm cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <img
                  src={img.secure_url || img.url}
                  alt={img.display_name}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(img.asset_id);
                    }}
                    className="absolute top-4 right-4 z-20 bg-red-600/80 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                  >
                    <FaTrash size={12} />
                  </button>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 z-10">
                  <span className="text-white text-sm font-medium uppercase tracking-widest mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {img.context?.custom?.caption ||
                      img.display_name ||
                      "Untitled Art"}
                  </span>
                  <span className="text-gray-400 text-[10px] uppercase tracking-[0.2em] translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    Click To Expand
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!gallery.length && !isLoading && (
          <div className="py-20 text-center text-gray-400 italic">
            No items in the gallery yet.
          </div>
        )}

        {nextCursor && (
          <div className="mt-20 text-center">
            <button
              onClick={() => fetchGallery(nextCursor)}
              disabled={isLoading}
              className="border-2 border-black px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Load More Inspiration"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
