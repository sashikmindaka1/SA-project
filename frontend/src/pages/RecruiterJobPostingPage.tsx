import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
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
} from "lucide-react";
import type {
  Job,
  JobFormValues,
  EmploymentType,
  ExperienceLevel,
  WorkMode,
  JobStatus,
} from "../types/job";
import { fetchRecruiterJobs, createJob, updateJob, deleteJob } from "../api/jobsApi";

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

const STATUS_STYLES: Record<JobStatus, string> = {
  Open: "bg-[#2CBFBF]/15 text-[#2CBFBF]",
  Draft: "bg-[#D9B855]/15 text-[#D9B855]",
  Closed: "bg-white/10 text-[#8A9199]",
  Archived: "bg-white/5 text-[#5C636B]",
};

export default function RecruiterJobPostingPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<JobFormValues>(EMPTY_FORM);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRecruiterJobs()
      .then(setJobs)
      .finally(() => setLoading(false));
  }, []);

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
    setForm((f) => ({ ...f, skills: [...f.skills, value] }));
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));
  }

  async function handleSubmit(status: JobStatus) {
    setSaving(true);
    const payload: JobFormValues = { ...form, status };
    try {
      if (editingId) {
        const updated = await updateJob(editingId, payload);
        setJobs((prev) => prev.map((j) => (j.id === editingId ? updated : j)));
      } else {
        const created = await createJob(payload);
        setJobs((prev) => [created, ...prev]);
      }
      setPanelOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    await deleteJob(id);
  }

  return (
    <div className="min-h-screen bg-[#1A2126] text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Job Postings</h1>
            <p className="mt-1 text-sm text-[#8A9199]">
              Create and manage the roles you're hiring for.
            </p>
          </div>
          <button
            onClick={openCreatePanel}
            className="flex items-center gap-2 rounded-lg bg-[#0CF2F2] px-4 py-2.5 text-sm font-semibold text-[#0B1416] transition-opacity hover:opacity-90"
          >
            <Plus size={16} /> Post a job
          </button>
        </header>

        <div className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-24 text-[#8A9199]">
              <Loader2 className="animate-spin" size={18} /> Loading your postings…
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState onCreate={openCreatePanel} />
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#20272D] text-[#8A9199]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Applicants</th>
                    <th className="px-4 py-3 font-medium">Closing</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-t border-white/5">
                      <td className="px-4 py-3.5">
                        <div className="font-medium">{job.title}</div>
                        <div className="text-xs text-[#8A9199]">
                          {job.department} · {job.location}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[job.status]}`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="flex items-center gap-1.5 text-[#8A9199]">
                          <Users size={14} /> {job.applicantCount}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[#8A9199]">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          {job.closingDate
                            ? new Date(job.closingDate).toLocaleDateString()
                            : "No deadline"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => openEditPanel(job)}
                            className="rounded-md p-2 text-[#8A9199] hover:bg-white/5 hover:text-white"
                            aria-label="Edit job"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="rounded-md p-2 text-[#8A9199] hover:bg-red-500/10 hover:text-red-400"
                            aria-label="Delete job"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-20 text-center">
      <div className="rounded-full bg-white/5 p-3 text-[#8A9199]">
        <Briefcase size={22} />
      </div>
      <h3 className="mt-4 text-base font-semibold">No roles posted yet</h3>
      <p className="mt-1 max-w-xs text-sm text-[#8A9199]">
        Post your first job to start receiving applications from candidates.
      </p>
      <button
        onClick={onCreate}
        className="mt-5 flex items-center gap-2 rounded-lg bg-[#0CF2F2] px-4 py-2.5 text-sm font-semibold text-[#0B1416] hover:opacity-90"
      >
        <Plus size={16} /> Post a job
      </button>
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
  const canPublish = form.title.trim() && form.department.trim() && form.location.trim();

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <div className="flex h-full w-full max-w-lg flex-col bg-[#1A2126] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold">
            {isEditing ? "Edit job posting" : "Post a new job"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-[#8A9199] hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <Field label="Job title">
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Senior AI Developer"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Department">
              <input
                className="input"
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                placeholder="Engineering"
              />
            </Field>
            <Field label="Location">
              <input
                className="input"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Colombo, LK"
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Work mode">
              <select
                className="input"
                value={form.workMode}
                onChange={(e) => setForm((f) => ({ ...f, workMode: e.target.value as WorkMode }))}
              >
                {WORK_MODES.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </Field>
            <Field label="Employment">
              <select
                className="input"
                value={form.employmentType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, employmentType: e.target.value as EmploymentType }))
                }
              >
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Experience">
              <select
                className="input"
                value={form.experienceLevel}
                onChange={(e) =>
                  setForm((f) => ({ ...f, experienceLevel: e.target.value as ExperienceLevel }))
                }
              >
                {EXPERIENCE_LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Min salary (USD/mo)">
              <input
                type="number"
                className="input"
                value={form.salary.min || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, salary: { ...f.salary, min: Number(e.target.value) } }))
                }
              />
            </Field>
            <Field label="Max salary (USD/mo)">
              <input
                type="number"
                className="input"
                value={form.salary.max || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, salary: { ...f.salary, max: Number(e.target.value) } }))
                }
              />
            </Field>
          </div>

          <Field label="Required skills">
            <div className="flex gap-2">
              <input
                className="input"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Type a skill, press Enter"
              />
              <button
                type="button"
                onClick={addSkill}
                className="shrink-0 rounded-lg bg-white/5 px-3 text-sm text-[#8A9199] hover:bg-white/10"
              >
                Add
              </button>
            </div>
            {form.skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {form.skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1 rounded-md bg-[#27668C]/25 px-2 py-1 text-xs text-[#6FB4DD]"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          <Field label="Description">
            <textarea
              className="input min-h-[90px] resize-none"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What will this person work on?"
            />
          </Field>

          <Field label="Requirements">
            <textarea
              className="input min-h-[90px] resize-none"
              value={form.requirements}
              onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))}
              placeholder="Must-have qualifications and experience"
            />
          </Field>

          <Field label="Application closes">
            <input
              type="date"
              className="input"
              value={form.closingDate ? form.closingDate.slice(0, 10) : ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  closingDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                }))
              }
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            onClick={() => onSubmit("Draft")}
            disabled={saving}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-[#8A9199] hover:bg-white/5 disabled:opacity-50"
          >
            Save as draft
          </button>
          <button
            onClick={() => onSubmit("Open")}
            disabled={saving || !canPublish}
            className="flex items-center gap-2 rounded-lg bg-[#0CF2F2] px-4 py-2.5 text-sm font-semibold text-[#0B1416] hover:opacity-90 disabled:opacity-50"
          >
            {saving && <Loader2 className="animate-spin" size={15} />}
            {isEditing ? "Save & publish" : "Publish job"}
          </button>
        </div>
      </div>

      {/* Shared input styling — move into your global stylesheet if you have one */}
      <style>{`
        .input {
          width: 100%;
          background: #20272D;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.5rem;
          padding: 0.6rem 0.75rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
        }
        .input:focus {
          border-color: #0CF2F2;
        }
        .input::placeholder {
          color: #5C636B;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[#8A9199]">{label}</span>
      {children}
    </label>
  );
}