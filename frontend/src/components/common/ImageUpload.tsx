"use client";

import { useState, useRef } from "react";
import { api } from "@/services/api";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert("Chỉ chấp nhận file ảnh (JPG, PNG, WebP, GIF).");
      return;
    }

    // Kiểm tra dung lượng (vd: 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File quá lớn. Vui lòng chọn file dưới 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data && res.data.url) {
        onChange(res.data.url);
      }
    } catch (err: any) {
      console.error("Lỗi upload:", err);
      alert("Không thể tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    onChange("");
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-xs font-black text-stone-400 uppercase tracking-widest">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
        
        {value ? (
          <div className="relative group aspect-video rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
                title="Thay đổi ảnh"
              >
                <Upload className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={removeImage}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                title="Xóa ảnh"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full aspect-video border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-stone-400 hover:bg-stone-50 transition-all group"
          >
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-stone-400 animate-spin" />
                <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">Đang tối ưu ảnh...</span>
              </>
            ) : (
              <>
                <div className="p-4 bg-stone-100 rounded-full group-hover:bg-stone-200 transition-colors">
                  <ImageIcon className="w-8 h-8 text-stone-400" />
                </div>
                <div className="text-center">
                  <span className="block text-sm font-bold text-stone-600 uppercase tracking-widest">Tải ảnh lên</span>
                  <span className="text-[10px] text-stone-400 font-medium">JPG, PNG, WebP (Tối đa 5MB)</span>
                </div>
              </>
            )}
          </button>
        )}
      </div>
      
      {/* Hidden fallback input to sync with existing form logic if needed */}
      <input type="hidden" value={value} />
    </div>
  );
}
