"use client";
import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  value?: string;
  onChange: (url: string, publicId?: string) => void;
  folder?: string;
  label?: string;
  aspectHint?: string;
  currentPublicId?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "cks-website",
  label = "Image",
  aspectHint,
  currentPublicId,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);
      if (currentPublicId) form.append("deletePublicId", currentPublicId);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      const data = await res.json();
      onChange(data.url, data.publicId);
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("File too large — max 5MB"); return; }
    upload(file);
  };

  const remove = () => { onChange(""); if (inputRef.current) inputRef.current.value = ""; };

  return (
    <div>
      <label className="form-label">{label}</label>
      {aspectHint && <p className="form-hint" style={{ marginTop: -2, marginBottom: 8 }}>{aspectHint}</p>}

      {value ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img src={value} alt="Uploaded" style={{ maxHeight: 160, maxWidth: "100%", borderRadius: 12, border: "1px solid var(--border)", display: "block" }} />
          <button onClick={remove} style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "var(--blue)" : "var(--border)"}`,
            borderRadius: 12, padding: "28px 20px", textAlign: "center", cursor: "pointer",
            background: dragOver ? "var(--blue-bg)" : "var(--bg-subtle)",
            transition: "all 0.15s",
          }}
        >
          {uploading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <Loader2 size={24} color="var(--blue)" style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: 13, color: "var(--ink-3)" }}>Uploading…</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--blue-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {dragOver ? <Upload size={20} color="var(--blue)" /> : <ImageIcon size={20} color="var(--blue)" />}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-1)", margin: "0 0 2px" }}>
                  {dragOver ? "Drop to upload" : "Click or drag & drop"}
                </p>
                <p style={{ fontSize: 12, color: "var(--ink-4)", margin: 0 }}>JPEG, PNG, WebP · Max 5MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={e => handleFile(e.target.files?.[0])}
      />

      {/* Also allow pasting a URL directly */}
      <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
        <input
          className="input"
          placeholder="Or paste an image URL…"
          value={value || ""}
          onChange={e => onChange(e.target.value)}
          style={{ fontSize: 13 }}
        />
      </div>
    </div>
  );
}
