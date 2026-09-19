import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  UploadCloud, 
  Trash2, 
  Copy, 
  Check, 
  UserCheck, 
  ExternalLink,
  AlertCircle,
  Clock,
  HardDrive
} from 'lucide-react';
import { MediaItem } from '../../types';
import { uploadMedia, deleteMedia, updateSettings } from '../../utils/api';

interface AdminMediaProps {
  media: MediaItem[];
  onRefresh: () => void;
  technicianPhoto?: string;
}

export function AdminMedia({ media, onRefresh, technicianPhoto }: AdminMediaProps) {
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg("Only image files (PNG, JPG, WebP, SVG) are permitted.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size exceeds 10MB limit.");
      return;
    }

    setUploading(true);
    setErrorMsg(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        try {
          await uploadMedia({
            name: file.name,
            dataUrl,
            usedIn: 'Media Library'
          });
          showSuccess(`Image "${file.name}" uploaded successfully!`);
          onRefresh();
        } catch (err: any) {
          setErrorMsg(err.message || "Failed to upload image");
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setErrorMsg("Error reading image file");
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteMedia(id);
      showSuccess(`Image "${name}" deleted`);
      setConfirmDeleteId(null);
      onRefresh();
    } catch (err) {
      setErrorMsg("Failed to delete image");
    }
  };

  const handleSetTechnicianPhoto = async (url: string) => {
    try {
      await updateSettings({ technicianPhoto: url });
      showSuccess("Technician profile photo updated!");
      onRefresh();
    } catch (err) {
      setErrorMsg("Failed to update technician photo");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-blue-400" />
            Media & Image Assets Library
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload custom technician portraits, diagnostic photos, hardware parts and marketing graphics.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
        >
          <UploadCloud className="h-4 w-4" />
          <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="p-8 border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-2xl bg-slate-900/40 text-center space-y-2 cursor-pointer transition-all"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-400 mx-auto">
          <UploadCloud className="h-6 w-6" />
        </div>
        <div className="text-xs font-bold text-white">Drag & drop computer photos here, or click to browse</div>
        <p className="text-[11px] text-slate-500">Supports JPG, PNG, WebP up to 10MB each</p>
      </div>

      {/* Grid of Media Assets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {media.map((item) => {
          const isCurrentTechPhoto = technicianPhoto === item.url || (item.dataUrl && technicianPhoto === item.dataUrl);
          const imgSrc = item.dataUrl || item.url;
          return (
            <div
              key={item.id}
              className="group rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              {/* Thumbnail Container with resilient rendering */}
              <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800">
                <img
                  src={imgSrc}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const img = e.currentTarget;
                    // Attempt fallback to dataUrl if we attempted URL
                    if (item.dataUrl && img.src !== item.dataUrl) {
                      img.src = item.dataUrl;
                      return;
                    }
                    // Attempt fallback to direct API endpoint
                    const apiEndpoint = `/api/media/image/${item.id}`;
                    if (!img.src.includes('/api/media/image/')) {
                      img.src = apiEndpoint;
                      return;
                    }
                    // Display friendly placeholder instead of black screen
                    img.style.display = 'none';
                    const parent = img.parentElement;
                    if (parent) {
                      const placeholder = parent.querySelector('.media-fallback-placeholder');
                      if (placeholder) {
                        (placeholder as HTMLElement).style.display = 'flex';
                      }
                    }
                  }}
                />
                
                {/* Visual fallback if file cannot be decoded */}
                <div className="media-fallback-placeholder hidden absolute inset-0 flex-col items-center justify-center text-slate-500 bg-slate-900/90 p-4 text-center">
                  <ImageIcon className="h-8 w-8 text-slate-500 mb-1" />
                  <span className="text-[11px] font-mono text-slate-300 font-medium">Image Loaded</span>
                  <span className="text-[10px] text-slate-500 truncate max-w-full">{item.name}</span>
                </div>

                {isCurrentTechPhoto && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white shadow-md flex items-center gap-1 z-10">
                    <UserCheck className="h-3 w-3" />
                    Technician Photo
                  </span>
                )}
              </div>

              {/* Info & Actions */}
              <div className="p-3.5 space-y-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{item.size || 'Web Asset'}</span>
                    <span>{item.usedIn || 'Assets'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1 text-xs">
                  <button
                    onClick={() => handleCopy(item.url, item.id)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                  >
                    {copiedId === item.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {!isCurrentTechPhoto && (
                      <button
                        onClick={() => handleSetTechnicianPhoto(item.url)}
                        className="p-1.5 rounded bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-[11px] font-medium transition-colors"
                        title="Set as technician portrait"
                      >
                        Set Profile
                      </button>
                    )}
                    {confirmDeleteId === item.id ? (
                      <div className="flex items-center gap-1 bg-red-950/80 border border-red-500/50 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.name)}
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="p-1.5 rounded text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Image"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
