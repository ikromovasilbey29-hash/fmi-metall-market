"use client";

import { useState, useRef } from "react";
import { Upload, Link as LinkIcon, X, AlertCircle, Package, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useT } from "@/hooks/useT";

interface ImageUploaderProps {
  value: string;          // current imageUrl (URL or base64)
  onChange: (val: string) => void;
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const t = useT();
  const [tab, setTab]         = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState(value.startsWith("http") ? value : "");
  const [dragging, setDragging] = useState(false);
  const [imgErr, setImgErr]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── file → base64 ── */
  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error(t.imageUploader.toastOnlyImages);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t.imageUploader.toastMaxSize);
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      onChange(result);
      setImgErr(false);
    };
    reader.readAsDataURL(file);
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  /* ── drag & drop ── */
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  /* ── URL tab ── */
  const applyUrl = () => {
    const url = urlInput.trim();
    if (!url) { onChange(""); return; }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      toast.error(t.imageUploader.toastUrlHttps);
      return;
    }
    onChange(url);
    setImgErr(false);
  };

  const clearImage = () => {
    onChange("");
    setUrlInput("");
    setImgErr(false);
  };

  const hasImage = !!value;

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-1 mb-3 p-1 bg-bg-panel rounded-xl w-fit">
        <button type="button" onClick={() => setTab("file")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            tab === "file"
              ? "bg-bg-card text-text-primary shadow-sm"
              : "text-text-muted hover:text-text-secondary"
          }`}>
          <Upload size={13} /> {t.imageUploader.uploadFile}
        </button>
        <button type="button" onClick={() => setTab("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            tab === "url"
              ? "bg-bg-card text-text-primary shadow-sm"
              : "text-text-muted hover:text-text-secondary"
          }`}>
          <LinkIcon size={13} /> {t.imageUploader.enterUrl}
        </button>
      </div>

      {/* ── FILE TAB ── */}
      {tab === "file" && (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragging
              ? "border-accent-gold bg-accent-gold/5"
              : "border-border hover:border-accent-gold/50 hover:bg-bg-panel/60"
          }`}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileInput}
          />
          <Upload size={28} className={`mx-auto mb-2 ${dragging ? "text-accent-gold" : "text-text-muted opacity-50"}`} />
          <p className="text-text-secondary text-sm font-medium">
            {dragging ? t.imageUploader.dropHere : t.imageUploader.dragOrClick}
          </p>
          <p className="text-text-muted text-xs mt-1">{t.imageUploader.fileHint}</p>
        </div>
      )}

      {/* ── URL TAB ── */}
      {tab === "url" && (
        <div className="flex gap-2">
          <input
            type="text"
            className="input-field flex-1 text-sm"
            placeholder={t.imageUploader.urlPlaceholder}
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); applyUrl(); } }}
          />
          <button type="button" onClick={applyUrl}
            className="px-4 rounded-xl bg-accent-gold/15 hover:bg-accent-gold/25 border border-accent-gold/30 text-accent-gold text-sm font-medium transition-all whitespace-nowrap">
            {t.imageUploader.apply}
          </button>
        </div>
      )}

      {/* ── Preview ── */}
      {hasImage && (
        <div className="mt-4 relative inline-block">
          <div className="w-36 h-36 rounded-xl border border-border bg-bg-panel overflow-hidden flex items-center justify-center">
            {!imgErr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="preview"
                className="w-full h-full object-cover"
                onError={() => setImgErr(true)}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 p-3 text-center">
                <AlertCircle size={22} className="text-red-400" />
                <p className="text-red-400 text-xs leading-tight">{t.imageUploader.notLoaded}</p>
                <p className="text-text-muted text-xs leading-tight">{t.imageUploader.urlIncorrect}</p>
              </div>
            )}
          </div>
          {/* remove button */}
          <button type="button" onClick={clearImage}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-colors">
            <X size={12} className="text-white" />
          </button>
          {!imgErr && (
            <p className="text-text-muted text-xs mt-1.5 flex items-center gap-1">
              <ImageIcon size={10} />
              {value.startsWith("data:") ? t.imageUploader.fileUploaded : t.imageUploader.viaUrl}
            </p>
          )}
        </div>
      )}

      {!hasImage && (
        <div className="mt-4 w-36 h-36 rounded-xl border border-dashed border-border bg-bg-panel/30 flex flex-col items-center justify-center gap-2">
          <Package size={24} className="text-text-muted opacity-20" />
          <span className="text-text-muted text-xs">{t.imageUploader.preview}</span>
        </div>
      )}
    </div>
  );
}
