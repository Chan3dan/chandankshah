"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface AdminModalProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
  width?: number;
}

export default function AdminModal({
  title,
  subtitle,
  children,
  onClose,
  width = 860,
}: AdminModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="responsive-modal-shell" onClick={onClose} role="presentation">
      <div
        className="responsive-modal-panel admin-modal-panel"
        style={{ width: `min(100%, ${width}px)` }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="admin-modal-card">
          <div className="admin-modal-header">
            <div style={{ minWidth: 0 }}>
              <h2 className="admin-modal-title">{title}</h2>
              {subtitle ? <p className="admin-modal-subtitle">{subtitle}</p> : null}
            </div>
            <button type="button" onClick={onClose} className="admin-modal-close" aria-label="Close dialog">
              <X size={18} />
            </button>
          </div>
          <div className="admin-modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
