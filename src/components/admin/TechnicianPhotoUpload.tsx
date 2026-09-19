import React, { useState, useRef } from 'react';
import { Camera, Upload, Check, AlertCircle, RefreshCw, UserCheck, Trash2 } from 'lucide-react';
import { uploadProfilePicture } from '../../utils/api';

interface TechnicianPhotoUploadProps {
  currentPhoto?: string;
  technicianName?: string;
  onPhotoUpdated: (newPhotoUrl: string) => void;
}

export function TechnicianPhotoUpload({
  currentPhoto,
  technicianName = 'Technician Safiullah',
  onPhotoUpdated
}: TechnicianPhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress & convert image to standard Web-ready Base64 using HTML5 Canvas
  const processAndUploadFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const reader = new FileReader();
    reader.onerror = () => {
      setErrorMsg("Failed to read image file.");
      setIsUploading(false);
    };

    reader.onload = () => {
      const img = new Image();
      img.onerror = () => {
        setErrorMsg("Failed to parse image data.");
        setIsUploading(false);
      };

      img.onload = async () => {
        try {
          // Normalize max dimension to 800px to ensure fast load and guaranteed upload success
          const maxDim = 800;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error("Could not initialize canvas context");

          ctx.drawImage(img, 0, 0, width, height);

          // Get optimized high-quality JPEG
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);

          // Send to dedicated profile-photo endpoint
          const res = await uploadProfilePicture(optimizedDataUrl, file.name);

          if (res.success && res.photoUrl) {
            setSuccessMsg("Profile picture uploaded and updated successfully!");
            onPhotoUpdated(res.photoUrl);
            setTimeout(() => setSuccessMsg(null), 4000);
          } else {
            throw new Error("Server did not return a valid photo URL");
          }
        } catch (err: any) {
          console.error("Profile picture upload failed:", err);
          setErrorMsg(err.message || "Failed to upload profile picture. Please try again.");
        } finally {
          setIsUploading(false);
        }
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAndUploadFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndUploadFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="rounded-2xl skeuo-panel border border-slate-800 p-5 space-y-4 bg-slate-900/90">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Camera className="h-4 w-4 text-blue-400" />
            <span>Technician Profile Photo</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Visible on the homepage trust badge, technician bio, and quote cards.
          </p>
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-mono">
          <Check className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Upload & Preview Interface */}
      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* Avatar Display Frame */}
        <div className="relative shrink-0">
          <div className="h-24 w-24 rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-xl bg-slate-950 flex items-center justify-center relative">
            {currentPhoto ? (
              <img
                src={currentPhoto}
                alt={technicianName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
            ) : (
              <div className="text-center p-2 text-slate-500">
                <UserCheck className="h-8 w-8 mx-auto text-slate-600 mb-1" />
                <span className="text-[10px] font-mono">No Photo</span>
              </div>
            )}

            {isUploading && (
              <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-cyan-400">
                <RefreshCw className="h-6 w-6 animate-spin mb-1" />
                <span className="text-[9px] font-mono">Saving...</span>
              </div>
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="skeuo-led-emerald"></span>
          </span>
        </div>

        {/* Drag and Drop / Button Click Area */}
        <div className="flex-1 w-full space-y-3">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-700 hover:border-slate-500 bg-slate-950/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Upload className="h-6 w-6 mx-auto text-blue-400 mb-1" />
            <p className="text-xs font-semibold text-slate-200 font-mono">
              {isUploading ? 'Uploading photo...' : 'Click to Browse or Drag & Drop Photo Here'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              Supports JPG, PNG, WebP • Auto-optimized for mobile & desktop
            </p>
          </div>

          {currentPhoto && currentPhoto.trim() !== '' && (
            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => {
                  onPhotoUpdated("");
                  setSuccessMsg("Profile picture removed successfully!");
                  setTimeout(() => setSuccessMsg(null), 3000);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove Photo from Database</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
