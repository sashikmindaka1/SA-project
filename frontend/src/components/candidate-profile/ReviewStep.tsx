import React, { useEffect, useState } from "react";
import { Loader2, FileText, Pencil, CheckCircle2, AlertTriangle } from "lucide-react";
import SectionCard from "../common/SectionCard";
import { COLORS } from "../../constants/theme";
import { formatBytes } from "../../utils/formatBytes";
import type { CandidateProfileFormData, StepId } from "../../types/candidateProfile";

interface ReviewStepProps {
  profile: CandidateProfileFormData;
  onEditStep: (step: StepId) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
  onStartNewProfile: () => void;
  submitError?: string | null;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1.5">
      <span className="text-xs" style={{ color: COLORS.textSecondary }}>
        {label}
      </span>
      <span className="text-xs text-white text-right">{value || "—"}</span>
    </div>
  );
}

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-[11px] font-medium"
      style={{ color: COLORS.cyan }}
    >
      <Pencil size={11} /> Edit
    </button>
  );
}

export default function ReviewStep({
  profile,
  onEditStep,
  onBack,
  onSubmit,
  isSubmitting,
  isSubmitted,
  onStartNewProfile,
  submitError,
}: ReviewStepProps) {
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!profile.photo) {
      setPhotoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(profile.photo);
    setPhotoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [profile.photo]);

  if (isSubmitted) {
    return (
      <SectionCard title="Profile saved" subtitle="Your profile is live for recruiters to find">
        <div className="flex flex-col items-center text-center gap-3 py-6">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(44,191,191,0.12)" }}
          >
            <CheckCircle2 size={24} style={{ color: COLORS.teal }} />
          </div>
          <p className="text-sm text-white font-medium">
            {profile.fullName || "Your"} profile has been saved successfully.
          </p>
          <p className="text-xs max-w-xs" style={{ color: COLORS.textSecondary }}>
            Recruiters can now match this profile against open roles. You can come back and
            update it any time.
          </p>
          <button
            type="button"
            onClick={onStartNewProfile}
            className="mt-2 text-sm font-semibold px-5 py-2 rounded-lg"
            style={{ border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary }}
          >
            Edit profile
          </button>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Review your profile" subtitle="Check everything before you submit">
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-white">Personal info</span>
            <EditButton onClick={() => onEditStep("personal")} />
          </div>
          <div className="rounded-lg px-3 py-2" style={{ backgroundColor: COLORS.panelAlt, border: `1px solid ${COLORS.border}` }}>
            {photoPreviewUrl && (
              <div className="flex items-center gap-2.5 pb-2 mb-1" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <img
                  src={photoPreviewUrl}
                  alt="Profile photo"
                  className="w-9 h-9 rounded-full object-cover"
                  style={{ border: `1px solid ${COLORS.border}` }}
                />
                <span className="text-xs" style={{ color: COLORS.textSecondary }}>
                  Profile photo added
                </span>
              </div>
            )}
            <ReviewRow label="Full name" value={profile.fullName} />
            <ReviewRow label="Title" value={profile.title} />
            <ReviewRow label="Email" value={profile.email} />
            <ReviewRow label="Phone" value={profile.phone} />
            <ReviewRow label="Location" value={profile.location} />
            <ReviewRow label="Experience" value={`${profile.yearsExperience || 0} years`} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-white">Summary & skills</span>
            <EditButton onClick={() => onEditStep("skills")} />
          </div>
          <div className="rounded-lg px-3 py-2 flex flex-col gap-2" style={{ backgroundColor: COLORS.panelAlt, border: `1px solid ${COLORS.border}` }}>
            <p className="text-xs" style={{ color: COLORS.textSecondary }}>
              {profile.summary || "No summary added yet."}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.length === 0 && (
                <span className="text-xs" style={{ color: COLORS.textSecondary }}>
                  No skills added.
                </span>
              )}
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-[11px] px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "rgba(39,102,140,0.25)", color: "#8FCBEF" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-white">Resume</span>
            <EditButton onClick={() => onEditStep("resume")} />
          </div>
          <div
            className="rounded-lg px-3 py-2.5 flex items-center gap-2.5"
            style={{ backgroundColor: COLORS.panelAlt, border: `1px solid ${COLORS.border}` }}
          >
            {profile.file ? (
              <>
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(217,184,85,0.15)" }}
                >
                  <FileText size={15} style={{ color: COLORS.gold }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-white truncate">{profile.file.name}</p>
                  <p className="text-[11px]" style={{ color: COLORS.textSecondary }}>
                    {formatBytes(profile.file.size)}
                  </p>
                </div>
              </>
            ) : (
              <span className="text-xs" style={{ color: COLORS.textSecondary }}>
                Skipped — you can add a resume later from your profile.
              </span>
            )}
          </div>
        </div>

        {!profile.file && (
          <div
            className="flex items-start gap-2 rounded-lg px-3 py-2.5"
            style={{ backgroundColor: "rgba(217,184,85,0.1)", border: `1px solid rgba(217,184,85,0.35)` }}
          >
            <AlertTriangle size={14} style={{ color: COLORS.gold }} className="shrink-0 mt-0.5" />
            <p className="text-xs" style={{ color: COLORS.textPrimary }}>
              No resume attached. Recruiters mainly discover candidates through resume matching —
              you can still submit, but adding one later will improve your visibility.
            </p>
          </div>
        )}

        {submitError && (
          <div
            className="flex items-start gap-2 rounded-lg px-3 py-2.5"
            style={{ backgroundColor: "rgba(224,102,102,0.1)", border: `1px solid rgba(224,102,102,0.35)` }}
          >
            <AlertTriangle size={14} style={{ color: "#E06666" }} className="shrink-0 mt-0.5" />
            <p className="text-xs" style={{ color: COLORS.textPrimary }}>
              {submitError}
            </p>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-40"
            style={{ border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary }}
          >
            Back
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-70"
            style={{ backgroundColor: COLORS.cyan, color: COLORS.bg }}
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {isSubmitting ? "Saving profile..." : "Submit profile"}
          </button>
        </div>
      </div>
    </SectionCard>
  );
}