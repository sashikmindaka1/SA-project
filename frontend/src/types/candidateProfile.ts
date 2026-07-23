export interface PersonalInfoData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  yearsExperience: number;
  /** Profile picture selected in Step 1. Not persisted to draft storage (see DraftableProfile). */
  photo: File | null;
}

export interface SkillsData {
  summary: string;
  skills: string[];
}

export interface ResumeData {
  file: File | null;
}

/** Full shape of the candidate profile, assembled across all steps. */
export interface CandidateProfileFormData
  extends PersonalInfoData,
    SkillsData,
    ResumeData {}

export const EMPTY_PROFILE: CandidateProfileFormData = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  yearsExperience: 0,
  summary: "",
  skills: [],
  file: null,
  photo: null,
};

export type StepId = "personal" | "skills" | "resume" | "review";

export interface StepDefinition {
  id: StepId;
  label: string;
}

export const STEPS: StepDefinition[] = [
  { id: "personal", label: "Personal info" },
  { id: "skills", label: "Summary & skills" },
  { id: "resume", label: "Resume" },
  { id: "review", label: "Review" },
];

/** Subset of the profile that's safe to persist — File objects can't be JSON-serialized. */
export type DraftableProfile = Omit<CandidateProfileFormData, "file" | "photo">;