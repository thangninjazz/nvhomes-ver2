"use client";

import { useState, useRef } from "react";
import { api } from "@/services/api";
import { Upload, X, ImageIcon, Loader2, Plus } from "lucide-react";

interface MultiImageUploadProps {
  value: string[]; // Mảng các URL ảnh
  onChange: (urls: string[]) => void;
  label?: string;
}

export function MultiImageUpload({ value = [], onChange, label }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Chỉ lấy file đầu tiên hoặc có thể loop nếu backend hỗ trợ (hiện tại UploadController nhận 1 file)
    const file = files[0];

    // Kiểm tra định dạng
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert("Chỉ chấp nhận file ảnh (JPG, PNG, WebP, GIF).");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.url) {
        onChange([...value, res.data.url]);
      }
    } catch (err: any) {
      console.error("Lỗi upload gallery:", err);
      alert("Không thể tải ảnh lên bộ sưu tập.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-xs font-black text-stone-400 uppercase tracking-widest">
          {label}
        </label>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Render Existing Images */}
        {value.map((url, index) => (
          <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
            <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                type="button"
                onClick={() => removeImage(index)}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="aspect-square border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-stone-400 hover:bg-stone-50 transition-all group"
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-stone-400 animate-spin" />
          ) : (
            <>
              <div className="p-3 bg-stone-100 rounded-full group-hover:bg-stone-200 transition-colors">
                <Plus className="w-6 h-6 text-stone-400" />
              </div>
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Thêm ảnh</span>
            </>
          )}
        </button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
