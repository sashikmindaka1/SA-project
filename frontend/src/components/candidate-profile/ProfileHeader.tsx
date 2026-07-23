import React from "react";
import { Pencil } from "lucide-react";
import { COLORS } from "../../constants/theme";

interface ProfileHeaderProps {
  initials: string;
  photoUrl?: string | null;
  onChangePhoto?: () => void;
}

export default function ProfileHeader({ initials, photoUrl, onChangePhoto }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-1">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt="Profile photo"
          className="w-16 h-16 rounded-full object-cover"
          style={{ border: `1px solid ${COLORS.border}` }}
        />
      ) : (
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-semibold"
          style={{ backgroundColor: COLORS.blue, color: "white" }}
        >
          {initials}
        </div>
      )}
      <button
        type="button"
        onClick={onChangePhoto}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
        style={{
          border: `1px solid ${COLORS.border}`,
          color: COLORS.textSecondary,
          backgroundColor: COLORS.panelAlt,
        }}
      >
        <Pencil size={12} /> {photoUrl ? "Change photo" : "Add photo"}
      </button>
    </div>
  );
}