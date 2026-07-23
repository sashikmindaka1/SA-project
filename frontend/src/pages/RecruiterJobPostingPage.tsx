import {
  useEffect,
  useState,
  useMemo,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import {
  Plus,
  X,
  Pencil,
  Trash2,
  Users,
  CalendarDays,
  Loader2,
  Briefcase,
  Bell,
  Search,
} from "lucide-react";
import SideNav from "../components/common/SideNav";
import type {
  Job,
  JobFormValues,
  EmploymentType,
  ExperienceLevel,
  WorkMode,
  JobStatus,
} from "../types/job";
import { fetchRecruiterJobs, createJob, updateJob, deleteJob } from "../api/jobsApi";

const C = {
  bg: "#080c10",
  panel: "#0d1318",
  panelAlt: "#121922",
  border: "rgba(255,255,255,0.06)",
  borderStrong: "rgba(255,255,255,0.14)",
  text: "#FFFFFF",
  textDim: "#5c7086",
  teal: "#22d9d9",
  blue: "#27668C",
} as const;

const EMPLOYMENT_TYPES: EmploymentType[] = ["Full-time", "Part-time", "Contract", "Internship"];
const EXPERIENCE_LEVELS: ExperienceLevel[] = ["Entry", "Junior", "Mid", "Senior", "Lead"];
const WORK_MODES: WorkMode[] = ["On-site", "Hybrid", "Remote"];

const EMPTY_FORM: JobFormValues = {
  title: "",
  department: "",
  location: "",
  workMode: "Hybrid",
  employmentType: "Full-time",
  experienceLevel: "Mid",
  salary: { min: 0, max: 0, currency: "USD" },
  skills: [],
  description: "",
  requirements: "",
  closingDate: null,
  status: "Draft",
};

const STATUS_STYLES: Record<JobStatus, { bg: string; color: string; border: string }> = {
  Open: { bg: "rgba(34, 217, 217, 0.1)", color: C.teal, border: "rgba(34, 217, 217, 0.3)" },
  Draft: { bg: "rgba(217, 184, 85, 0.1)", color: "#D9B855", border: "rgba(217, 184, 85, 0.3)" },
  Closed: { bg: "rgba(255, 255, 255, 0.05)", color: C.textDim, border: C.border },
  Archived: { bg: "rgba(255, 255, 255, 0.02)", color: "#4A5568", border: C.border },
};

export default function RecruiterJobPostingPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<JobFormValues>(EMPTY_FORM);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRecruiterJobs()
      .then(setJobs)
      .catch((err) => console.error("Failed to load jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  // Live Filtering Logic
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;
    const q = searchQuery.toLowerCase();
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
    );
  }, [jobs, searchQuery]);

  function openCreatePanel() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSkillInput("");
    setPanelOpen(true);
  }

  function openEditPanel(job: Job) {
    const { id, postedBy, postedAt, applicantCount, ...values } = job;
    setEditingId(id);
    setForm(values);
    setSkillInput("");
    setPanelOpen(true);
  }

  function addSkill() {
    const value = skillInput.trim();
    if (!value || form.skills.includes(value)) return;

    setForm((f) => ({
      ...f,
      skills: [...f.skills, value],
    }));
    setSkillInput("");
  }

  function removeSkill(skillToRemove: string) {
    setForm((f) => ({
      ...f,
      skills: f.skills.filter((s) => s !== skillToRemove),
    }));
  }

  async function handleSubmit(status: JobStatus) {
    setSaving(true);
    const payload: JobFormValues = { ...form, status };

    try {
      if (editingId !== null) {
        const updated = await updateJob(editingId, payload);
        setJobs((prev) => prev.map((j) => (j.id === editingId ? updated : j)));
      } else {
        const created = await createJob(payload);
        setJobs((prev) => [created, ...prev]);
      }
      setPanelOpen(false);
    } catch (err) {
      console.error("Failed to save job:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;

    const previousJobs = [...jobs];
    setJobs((prev) => prev.filter((j) => j.id !== id));

    try {
      await deleteJob(id);
    } catch (err) {
      console.error("Failed to delete job:", err);
      setJobs(previousJobs);
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col font-sans" style={{ background: C.bg, color: C.text }}>
      {/* Top Navigation Bar */}
      <nav
        className="w-full px-10 py-5 border-b sticky top-0 z-20 backdrop-blur-md shadow-lg flex justify-between items-center"
        style={{ borderColor: C.border, background: `${C.bg}EE` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-base shadow-lg"
            style={{ background: `linear-gradient(135deg, ${C.teal}, #0f5f5f)`, color: "#08101b" }}
          >
            TF
          </div>
          <span className="font-extrabold tracking-tight text-lg" style={{ color: C.text }}>
            Talent<span style={{ color: C.teal }}>Flow</span> AI
          </span>
        </div>

        <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search job postings, departments, or keywords..."
            className="w-full border rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none transition-all shadow-inner"
            style={{ background: C.panelAlt, borderColor: C.border, color: C.text }}
          />
          <div className="absolute left-3.5 top-3" style={{ color: C.textDim }}>
            <Search size={16} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="relative p-2.5 rounded-xl shadow-inner shrink-0 cursor-pointer"
            style={{ background: C.panel, border: `1px solid ${C.border}` }}
          >
            <Bell size={18} style={{ color: C.textDim }} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full" style={{ background: C.teal }}></span>
          </div>
          <div className="flex items-center gap-3 pl-3 border-l shrink-0" style={{ borderColor: C.border }}>
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shadow-md overflow-hidden"
              style={{ background: `linear-gradient(135deg, #3c5a76, #1c2c3d)`, color: C.text }}
            >
              HR
            </div>
            <div className="text-right hidden sm:block leading-tight">
              <div className="text-xs font-bold" style={{ color: C.text }}>
                Recruiter Admin
              </div>
              <div className="text-[10px] font-semibold tracking-wider mt-0.5" style={{ color: C.teal }}>
                TALENT ACQUISITION
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        <SideNav />

        <main className="p-8 md:p-10 flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <header className="flex items-center justify-between pb-2">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3" style={{ color: C.text }}>
                  <Briefcase size={30} style={{ color: C.teal }} />
                  Job Postings
                </h1>
                <p className="mt-1.5 text-sm" style={{ color: C.textDim }}>
                  Create and manage the hiring roles across your organization.
                </p>
              </div>
              <button
                onClick={openCreatePanel}
                className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${C.teal}, #0f5f5f)`,
                  color: "#08101b",
                }}
              >
                <Plus size={16} /> Post a Job
              </button>
            </header>

            <div
              className="rounded-2xl border p-6 shadow-2xl relative"
              style={{ background: C.panel, borderColor: C.border }}
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-24" style={{ color: C.teal }}>
                  <Loader2 size={32} className="animate-spin" />
                  <span className="text-xs font-semibold" style={{ color: C.textDim }}>
                    Fetching job postings...
                  </span>
                </div>
              ) : filteredJobs.length === 0 ? (
                <EmptyState onCreate={openCreatePanel} isSearching={Boolean(searchQuery)} />
              ) : (
                <div className="overflow-hidden rounded-xl border" style={{ borderColor: C.border }}>
                  <table className="w-full text-left text-sm">
                    <thead style={{ background: C.panelAlt, color: C.textDim }}>
                      <tr>
                        <th className="px-5 py-4 font-semibold uppercase text-[11px] tracking-wider">Role</th>
                        <th className="px-5 py-4 font-semibold uppercase text-[11px] tracking-wider">Status</th>
                        <th className="px-5 py-4 font-semibold uppercase text-[11px] tracking-wider">Applicants</th>
                        <th className="px-5 py-4 font-semibold uppercase text-[11px] tracking-wider">Closing</th>
                        <th className="px-5 py-4 font-semibold uppercase text-[11px] tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: C.border }}>
                      {filteredJobs.map((job) => {
                        const style = STATUS_STYLES[job.status] || STATUS_STYLES.Draft;
                        return (
                          <tr key={job.id} className="transition-colors hover:bg-white/[0.02]">
                            <td className="px-5 py-4">
                              <div className="font-bold text-sm" style={{ color: C.text }}>
                                {job.title}
                              </div>
                              <div className="text-xs mt-0.5" style={{ color: C.textDim }}>
                                {job.department} · {job.location}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className="rounded-lg px-2.5 py-1 text-[11px] font-bold border inline-block"
                                style={{
                                  background: style.bg,
                                  color: style.color,
                                  borderColor: style.border,
                                }}
                              >
                                {job.status}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: C.textDim }}>
                                <Users size={14} style={{ color: C.teal }} /> {job.applicantCount ?? 0}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-xs font-medium" style={{ color: C.textDim }}>
                              <span className="flex items-center gap-1.5">
                                <CalendarDays size={14} style={{ color: C.teal }} />
                                {job.closingDate
                                  ? new Date(job.closingDate).toLocaleDateString()
                                  : "No deadline"}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openEditPanel(job)}
                                  className="rounded-lg p-2 transition-all hover:bg-white/5"
                                  style={{ color: C.textDim }}
                                  aria-label="Edit job"
                                >
                                  <Pencil size={15} />
                                </button>
                                <button
                                  onClick={() => handleDelete(job.id)}
                                  className="rounded-lg p-2 transition-all hover:bg-red-500/10 hover:text-red-400"
                                  style={{ color: C.textDim }}
                                  aria-label="Delete job"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {panelOpen && (
        <JobFormPanel
          form={form}
          setForm={setForm}
          skillInput={skillInput}
          setSkillInput={setSkillInput}
          addSkill={addSkill}
          removeSkill={removeSkill}
          saving={saving}
          isEditing={!!editingId}
          onClose={() => setPanelOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function EmptyState({ onCreate, isSearching }: { onCreate: () => void; isSearching: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
      style={{ borderColor: C.border }}
    >
      <div className="rounded-2xl p-4 shadow-inner" style={{ background: C.panelAlt, border: `1px solid ${C.border}` }}>
        <Briefcase size={28} style={{ color: C.teal }} />
      </div>
      <h3 className="mt-4 text-base font-bold" style={{ color: C.text }}>
        {isSearching ? "No matching roles found" : "No roles posted yet"}
      </h3>
      <p className="mt-1 max-w-xs text-xs" style={{ color: C.textDim }}>
        {isSearching
          ? "Try adjusting your search criteria or keywords."
          : "Post your first job role to initiate AI resume matching and receive candidates."}
      </p>
      {!isSearching && (
        <button
          onClick={onCreate}
          className="mt-6 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 shadow-md"
          style={{
            background: `linear-gradient(135deg, ${C.teal}, #0f5f5f)`,
            color: "#08101b",
          }}
        >
          <Plus size={16} /> Post a job
        </button>
      )}
    </div>
  );
}

interface JobFormPanelProps {
  form: JobFormValues;
  setForm: Dispatch<SetStateAction<JobFormValues>>;
  skillInput: string;
  setSkillInput: (v: string) => void;
  addSkill: () => void;
  removeSkill: (skill: string) => void;
  saving: boolean;
  isEditing: boolean;
  onClose: () => void;
  onSubmit: (status: JobStatus) => void;
}

function JobFormPanel({
  form,
  setForm,
  skillInput,
  setSkillInput,
  addSkill,
  removeSkill,
  saving,
  isEditing,
  onClose,
  onSubmit,
}: JobFormPanelProps) {
  const canPublish = Boolean(
    form.title.trim() && form.department.trim() && form.location.trim()
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div
        className="flex h-full w-full max-w-lg flex-col border-l shadow-2xl"
        style={{ background: C.panel, borderColor: C.border }}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: C.border }}>
          <h2 className="text-base font-bold tracking-wide" style={{ color: C.text }}>
            {isEditing ? "Edit Job Posting" : "Post a New Job"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors hover:bg-white/5"
            style={{ color: C.textDim }}
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Panel Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <Field label="Job Title">
            <input
              className="tf-input"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Senior AI Developer"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Department">
              <input
                className="tf-input"
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                placeholder="Engineering"
              />
            </Field>
            <Field label="Location">
              <input
                className="tf-input"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Colombo, LK"
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Work Mode">
              <select
                className="tf-input"
                value={form.workMode}
                onChange={(e) => setForm((f) => ({ ...f, workMode: e.target.value as WorkMode }))}
              >
                {WORK_MODES.map((m) => (
                  <option key={m} value={m} style={{ background: C.panelAlt }}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Employment">
              <select
                className="tf-input"
                value={form.employmentType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, employmentType: e.target.value as EmploymentType }))
                }
              >
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t} style={{ background: C.panelAlt }}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Experience">
              <select
                className="tf-input"
                value={form.experienceLevel}
                onChange={(e) =>
                  setForm((f) => ({ ...f, experienceLevel: e.target.value as ExperienceLevel }))
                }
              >
                {EXPERIENCE_LEVELS.map((l) => (
                  <option key={l} value={l} style={{ background: C.panelAlt }}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Min Salary (USD/mo)">
              <input
                type="number"
                className="tf-input"
                value={form.salary?.min ?? 0}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    salary: { ...f.salary, min: Number(e.target.value) || 0 },
                  }))
                }
              />
            </Field>
            <Field label="Max Salary (USD/mo)">
              <input
                type="number"
                className="tf-input"
                value={form.salary?.max ?? 0}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    salary: { ...f.salary, max: Number(e.target.value) || 0 },
                  }))
                }
              />
            </Field>
          </div>

          <Field label="Required Skills">
            <div className="flex gap-2">
              <input
                className="tf-input"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type skill & press Enter"
              />
              <button
                type="button"
                onClick={addSkill}
                className="shrink-0 rounded-xl px-4 text-xs font-semibold transition-colors border"
                style={{ background: C.panelAlt, borderColor: C.border, color: C.text }}
              >
                Add
              </button>
            </div>
            {form.skills.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {form.skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border"
                    style={{ background: `${C.teal}15`, borderColor: `${C.teal}30`, color: C.teal }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      className="hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          <Field label="Description">
            <textarea
              className="tf-input min-h-[90px] resize-none"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What will this person work on?"
            />
          </Field>

          <Field label="Requirements">
            <textarea
              className="tf-input min-h-[90px] resize-none"
              value={form.requirements}
              onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))}
              placeholder="Must-have qualifications and experience"
            />
          </Field>

          <Field label="Application Closes">
            <input
              type="date"
              className="tf-input"
              value={form.closingDate ? form.closingDate.slice(0, 10) : ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  closingDate: e.target.value ? `${e.target.value}T00:00:00.000Z` : null,
                }))
              }
            />
          </Field>
        </div>

        {/* Panel Footer */}
        <div className="flex items-center justify-end gap-3 border-t px-6 py-4" style={{ borderColor: C.border }}>
          <button
            type="button"
            onClick={() => onSubmit("Draft")}
            disabled={saving}
            className="rounded-xl px-4 py-2.5 text-xs font-semibold border transition-all disabled:opacity-50"
            style={{ background: C.panelAlt, borderColor: C.border, color: C.textDim }}
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => onSubmit("Open")}
            disabled={saving || !canPublish}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${C.teal}, #0f5f5f)`,
              color: "#08101b",
            }}
          >
            {saving && <Loader2 className="animate-spin" size={15} />}
            {isEditing ? "Save & Publish" : "Publish Job"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold tracking-wider uppercase" style={{ color: C.textDim }}>
        {label}
      </span>
      {children}
    </label>
  );
}