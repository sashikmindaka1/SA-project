import { useEffect, useRef, useState } from "react";
import TopBar from "../components/common/TopBar";
import SideNav from "../components/common/SideNav";
import StepIndicator from "../components/common/StepIndicator";
import PersonalInfoStep from "../components/candidate-profile/PersonalInfoStep";
import SkillsStep from "../components/candidate-profile/SkillsStep";
import ResumeUploadStep from "../components/candidate-profile/ResumeUploadStep";
import ReviewStep from "../components/candidate-profile/ReviewStep";
import { COLORS } from "../constants/theme";
import { loadDraft, saveDraft, clearDraft } from "../utils/localStorageDraft";
import {
  EMPTY_PROFILE,
  type CandidateProfileFormData,
  type PersonalInfoData,
  type SkillsData,
  type StepId,
} from "../types/candidateProfile";

async function saveProfile(data: CandidateProfileFormData): Promise<void> {
  const formData = new FormData();

  formData.append("fullName", data.fullName || "");
  formData.append("title", data.title || "");
  formData.append("email", data.email || "");
  formData.append("phone", data.phone || "");
  formData.append("location", data.location || "");
  formData.append("yearsExperience", data.yearsExperience.toString());
  formData.append("summary", data.summary || "");

  formData.append("skills",
    JSON.stringify(data.skills || [])
  );

  if (data.photo) {
    formData.append("photo", data.photo);
  }

  if (data.file) {
    formData.append("resume", data.file);
  }

  const API_BASE = "http://localhost:5016"; // Update if your backend port is different

  console.log("Calling API:", `${API_BASE}/api/CandidateProfile`);
  const response = await fetch(`${API_BASE}/api/CandidateProfile`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to save: ${response.status} ${errorText}`);
  }

  const result = await response.json();

  console.log("✅ Profile saved successfully!");
  console.log(result);
}

export default function CandidateProfilePage() {
  const [step, setStep] = useState<StepId>("personal");
  const [profile, setProfile] = useState<CandidateProfileFormData>(EMPTY_PROFILE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const hasLoadedDraft = useRef(false);

  useEffect(() => {
    const draft = loadDraft();
    setProfile((prev) => ({ ...prev, ...draft }));
    hasLoadedDraft.current = true;
  }, []);

  useEffect(() => {
    if (!hasLoadedDraft.current || isSubmitted) return;
    const { file, photo, ...draftable } = profile;
    saveDraft(draftable);
  }, [profile, isSubmitted]);

  const handlePersonalInfoNext = (data: PersonalInfoData) => {
    setProfile((prev) => ({ ...prev, ...data }));
    setStep("skills");
  };

  const handleSkillsNext = (data: SkillsData) => {
    setProfile((prev) => ({ ...prev, ...data }));
    setStep("resume");
  };

  const handleResumeNext = (file: File | null) => {
    setProfile((prev) => ({ ...prev, file }));
    setStep("review");
  };

  const handleFinalSubmit = async () => {
    console.log("PROFILE:", profile);

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await saveProfile(profile);

      console.log("SUCCESS");

      setIsSubmitted(true);
      clearDraft();
    } catch (error) {
      console.error("SUBMIT ERROR:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving your profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartNewProfile = () => {
    setIsSubmitted(false);
    setStep("personal");
  };

  const initials = profile.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SP";

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <TopBar userName={profile.fullName || "Sarah Perera"} userInitials={initials} />
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 p-6">
          <div className="max-w-xl mx-auto">
            {!isSubmitted && <StepIndicator currentStep={step} />}

            {step === "personal" && (
              <PersonalInfoStep
                defaultValues={{
                  fullName: profile.fullName,
                  title: profile.title,
                  email: profile.email,
                  phone: profile.phone,
                  location: profile.location,
                  yearsExperience: profile.yearsExperience,
                  photo: profile.photo,
                }}
                onNext={handlePersonalInfoNext}
              />
            )}

            {step === "skills" && (
              <SkillsStep
                defaultValues={{ summary: profile.summary, skills: profile.skills }}
                onNext={handleSkillsNext}
                onBack={() => setStep("personal")}
              />
            )}

            {step === "resume" && (
              <ResumeUploadStep
                defaultFile={profile.file}
                onBack={() => setStep("skills")}
                onNext={handleResumeNext}
              />
            )}

            {step === "review" && (
              <ReviewStep
                profile={profile}
                onEditStep={(target) => setStep(target)}
                onBack={() => setStep("resume")}
                onSubmit={handleFinalSubmit}
                isSubmitting={isSubmitting}
                isSubmitted={isSubmitted}
                onStartNewProfile={handleStartNewProfile}
                submitError={submitError}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}