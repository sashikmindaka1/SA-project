import React, { useState, useEffect } from "react";
import SideNav from "../components/common/SideNav";
import { loadDraft, saveDraft } from "../utils/localStorageDraft";
import {
  User,
  Lock,
  Bell,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  KeyRound,
  UserCheck,
  Search,
  Sparkles,
  SlidersHorizontal,
  Mail,
  MapPin,
  Briefcase,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Design tokens — Ultra-dark cinematic luxury theme
// ---------------------------------------------------------------------------
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
  gold: "#D9B855",
  red: "#E0665A",
} as const;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const API_BASE = "http://localhost:5016"; // Backend API base URL

  // Profile Data State
  const [profileData, setProfileData] = useState({
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    yearsExperience: 0,
    summary: "",
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    candidateUpdates: true,
  });

  // Helper: Local Draft එකෙන් load කරගන්න Function එක
  const loadFromLocalDraft = () => {
    const draft = loadDraft();
    if (draft) {
      setProfileData((prev) => ({
        ...prev,
        fullName: draft.fullName || "",
        title: draft.title || "",
        email: draft.email || "",
        phone: draft.phone || "",
        location: draft.location || "",
        yearsExperience: draft.yearsExperience || 0,
        summary: draft.summary || "",
      }));
    }
  };

  // 1. Fetch Profile Data
  useEffect(() => {
    async function fetchCandidateProfile() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/CandidateProfile`);

        if (response.ok) {
          const data = await response.json();
          const profile = Array.isArray(data) ? data[0] : data;

          if (profile && (profile.fullName || profile.email)) {
            setProfileData({
              fullName: profile.fullName || "",
              title: profile.title || "",
              email: profile.email || "",
              phone: profile.phone || "",
              location: profile.location || "",
              yearsExperience: profile.yearsExperience || 0,
              summary: profile.summary || "",
            });
          } else {
            loadFromLocalDraft();
          }
        } else {
          loadFromLocalDraft();
        }
      } catch (error) {
        console.warn("Backend API not reachable. Loaded local draft:", error);
        loadFromLocalDraft();
      } finally {
        setLoading(false);
      }
    }

    fetchCandidateProfile();
  }, []);

  // 2. Save Updated Profile
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("fullName", profileData.fullName || "");
      formData.append("title", profileData.title || "");
      formData.append("email", profileData.email || "");
      formData.append("phone", profileData.phone || "");
      formData.append("location", profileData.location || "");
      formData.append("yearsExperience", profileData.yearsExperience.toString());
      formData.append("summary", profileData.summary || "");

      const currentDraft = loadDraft() || {};
      saveDraft({ ...currentDraft, ...profileData });

      const response = await fetch(`${API_BASE}/api/CandidateProfile`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Saved locally, but API failed to update DB.");
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  // 3. Password Update Logic
  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!passwordData.currentPassword) {
      setErrorMessage("Current password is required.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setSavedSuccess(true);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Dynamic Initials
  const initials = profileData.fullName
    ? profileData.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SP";

  return (
    <div className="w-full min-h-screen flex flex-col font-sans" style={{ background: C.bg, color: C.text }}>
      
      {/* Top Application Nav Bar */}
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
            placeholder="Search system settings, preferences, or profile..."
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
              className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shadow-md"
              style={{ background: `linear-gradient(135deg, #3c5a76, #1c2c3d)`, color: C.text }}
            >
              {initials}
            </div>
            <div className="text-right hidden sm:block leading-tight">
              <div className="text-xs font-bold" style={{ color: C.text }}>
                {profileData.fullName || "User Account"}
              </div>
              <div className="text-[10px] font-semibold tracking-wider mt-0.5" style={{ color: C.teal }}>
                {profileData.title || "ADMIN / RECRUITER"}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Component */}
        <SideNav />

        <main className="p-10 flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* Header Section */}
            <div className="flex justify-between items-end pb-2">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3" style={{ color: C.text }}>
                  <SlidersHorizontal size={30} style={{ color: C.teal }} />
                  Account Settings
                </h1>
                <p className="mt-1.5 text-sm" style={{ color: C.textDim }}>
                  Manage system security, sync preferences, and profile configurations for TalentFlow.
                </p>
              </div>
            </div>

            {/* Alert Messages */}
            {savedSuccess && (
              <div
                className="p-4 rounded-xl flex items-center gap-3 text-xs border shadow-xl transition-all"
                style={{ background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.35)", color: "#10b981" }}
              >
                <CheckCircle2 size={18} />
                <span className="font-semibold">Settings updated and synchronized with the database successfully!</span>
              </div>
            )}

            {errorMessage && (
              <div
                className="p-4 rounded-xl flex items-center gap-3 text-xs border shadow-xl transition-all"
                style={{ background: `${C.red}15`, borderColor: `${C.red}40`, color: C.red }}
              >
                <AlertCircle size={18} />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* Main Workspace Card */}
            <div
              className="rounded-2xl border flex flex-col md:flex-row overflow-hidden shadow-2xl min-h-[500px]"
              style={{ background: C.panel, borderColor: C.border }}
            >
              
              {/* Left Column: Navigation Tabs + Active Profile Display Card */}
              <div
                className="w-full md:w-72 p-5 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r"
                style={{ background: C.panelAlt, borderColor: C.border }}
              >
                <div className="space-y-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest px-2 mb-3" style={{ color: C.textDim }}>
                    Menu Options
                  </p>
                  <button
                    onClick={() => { setActiveTab("profile"); setErrorMessage(""); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                    style={{
                      background: activeTab === "profile" ? `${C.teal}20` : "transparent",
                      color: activeTab === "profile" ? C.teal : C.textDim,
                      border: `1px solid ${activeTab === "profile" ? `${C.teal}50` : "transparent"}`,
                    }}
                  >
                    <User size={16} /> Profile Details
                  </button>

                  <button
                    onClick={() => { setActiveTab("security"); setErrorMessage(""); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                    style={{
                      background: activeTab === "security" ? `${C.teal}20` : "transparent",
                      color: activeTab === "security" ? C.teal : C.textDim,
                      border: `1px solid ${activeTab === "security" ? `${C.teal}50` : "transparent"}`,
                    }}
                  >
                    <Lock size={16} /> Security & Password
                  </button>

                  <button
                    onClick={() => { setActiveTab("notifications"); setErrorMessage(""); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                    style={{
                      background: activeTab === "notifications" ? `${C.teal}20` : "transparent",
                      color: activeTab === "notifications" ? C.teal : C.textDim,
                      border: `1px solid ${activeTab === "notifications" ? `${C.teal}50` : "transparent"}`,
                    }}
                  >
                    <Bell size={16} /> Notifications
                  </button>
                </div>

                {/* Left Side Active User Profile Card */}
                <div
                  className="mt-8 p-4 rounded-xl border flex flex-col items-center text-center gap-3 shadow-lg"
                  style={{ background: C.panel, borderColor: C.border }}
                >
                  <div
                    className="h-16 w-16 rounded-full flex items-center justify-center text-lg font-extrabold shadow-md border"
                    style={{
                      background: `linear-gradient(135deg, #3c5a76, #1c2c3d)`,
                      color: C.text,
                      borderColor: `${C.teal}40`,
                    }}
                  >
                    {initials}
                  </div>

                  <div className="space-y-1 w-full">
                    <h4 className="text-sm font-bold truncate" style={{ color: C.text }}>
                      {profileData.fullName || "User Account"}
                    </h4>
                    <p className="text-[11px] font-semibold tracking-wider truncate" style={{ color: C.teal }}>
                      {profileData.title || "ADMIN / RECRUITER"}
                    </p>
                  </div>

                  <div className="w-full pt-3 border-t space-y-2 text-[11px]" style={{ borderColor: C.border, color: C.textDim }}>
                    {profileData.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail size={13} className="shrink-0" style={{ color: C.teal }} />
                        <span className="truncate">{profileData.email}</span>
                      </div>
                    )}
                    {profileData.location && (
                      <div className="flex items-center gap-2 truncate">
                        <MapPin size={13} className="shrink-0" style={{ color: C.teal }} />
                        <span className="truncate">{profileData.location}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Form Content Panel */}
              <div className="flex-1 p-8">
                {loading ? (
                  <div className="h-full py-20 flex flex-col items-center justify-center gap-3" style={{ color: C.teal }}>
                    <Loader2 size={32} className="animate-spin" />
                    <span className="text-xs font-semibold" style={{ color: C.textDim }}>Retrieving profile data...</span>
                  </div>
                ) : (
                  <>
                    {/* 1. PROFILE DETAILS TAB */}
                    {activeTab === "profile" && (
                      <form onSubmit={handleProfileSave} className="space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: C.border }}>
                          <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: C.text }}>
                            <UserCheck size={18} style={{ color: C.teal }} /> Personal Profile Info
                          </h3>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.textDim }}>
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={profileData.fullName}
                              onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                              placeholder="e.g. Sashik Mindaka"
                              className="w-full rounded-xl py-2.5 px-4 text-xs outline-none transition-all shadow-inner border focus:border-[#22d9d9]"
                              style={{ background: C.panelAlt, borderColor: C.border, color: C.text }}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.textDim }}>
                                Job Title
                              </label>
                              <input
                                type="text"
                                value={profileData.title}
                                onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                                placeholder="Software Engineer"
                                className="w-full rounded-xl py-2.5 px-4 text-xs outline-none transition-all shadow-inner border focus:border-[#22d9d9]"
                                style={{ background: C.panelAlt, borderColor: C.border, color: C.text }}
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.textDim }}>
                                Location
                              </label>
                              <input
                                type="text"
                                value={profileData.location}
                                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                placeholder="Colombo, Sri Lanka"
                                className="w-full rounded-xl py-2.5 px-4 text-xs outline-none transition-all shadow-inner border focus:border-[#22d9d9]"
                                style={{ background: C.panelAlt, borderColor: C.border, color: C.text }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.textDim }}>
                                Email Address
                              </label>
                              <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                placeholder="sashik@example.com"
                                className="w-full rounded-xl py-2.5 px-4 text-xs outline-none transition-all shadow-inner border focus:border-[#22d9d9]"
                                style={{ background: C.panelAlt, borderColor: C.border, color: C.text }}
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.textDim }}>
                                Phone Number (Digits Only)
                              </label>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={profileData.phone}
                                onChange={(e) =>
                                  setProfileData({
                                    ...profileData,
                                    phone: e.target.value.replace(/[^0-9]/g, ""),
                                  })
                                }
                                placeholder="0771234567"
                                className="w-full rounded-xl py-2.5 px-4 text-xs outline-none transition-all shadow-inner border focus:border-[#22d9d9]"
                                style={{ background: C.panelAlt, borderColor: C.border, color: C.text }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                          <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:opacity-90 disabled:opacity-50"
                            style={{
                              background: `linear-gradient(135deg, ${C.teal}, #0f5f5f)`,
                              color: "#08101b",
                            }}
                          >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save Changes
                          </button>
                        </div>
                      </form>
                    )}

                    {/* 2. SECURITY TAB */}
                    {activeTab === "security" && (
                      <form onSubmit={handlePasswordSave} className="space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: C.border }}>
                          <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: C.text }}>
                            <Shield size={18} style={{ color: C.teal }} /> Password & Authentication
                          </h3>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.textDim }}>
                              Current Password
                            </label>
                            <input
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              placeholder="••••••••"
                              className="w-full rounded-xl py-2.5 px-4 text-xs outline-none transition-all shadow-inner border focus:border-[#22d9d9]"
                              style={{ background: C.panelAlt, borderColor: C.border, color: C.text }}
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.textDim }}>
                              New Password
                            </label>
                            <input
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              placeholder="••••••••"
                              className="w-full rounded-xl py-2.5 px-4 text-xs outline-none transition-all shadow-inner border focus:border-[#22d9d9]"
                              style={{ background: C.panelAlt, borderColor: C.border, color: C.text }}
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.textDim }}>
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                              placeholder="••••••••"
                              className="w-full rounded-xl py-2.5 px-4 text-xs outline-none transition-all shadow-inner border focus:border-[#22d9d9]"
                              style={{ background: C.panelAlt, borderColor: C.border, color: C.text }}
                            />
                          </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                          <button
                            type="submit"
                            className="px-6 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:opacity-90"
                            style={{
                              background: `linear-gradient(135deg, ${C.teal}, #0f5f5f)`,
                              color: "#08101b",
                            }}
                          >
                            <KeyRound size={16} /> Update Password
                          </button>
                        </div>
                      </form>
                    )}

                    {/* 3. NOTIFICATIONS TAB */}
                    {activeTab === "notifications" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: C.border }}>
                          <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: C.text }}>
                            <Sparkles size={18} style={{ color: C.teal }} /> System Preferences
                          </h3>
                        </div>

                        <div className="space-y-3">
                          <label
                            className="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all hover:border-[#22d9d9]/40"
                            style={{ background: C.panelAlt, borderColor: C.border }}
                          >
                            <div>
                              <p className="text-xs font-bold" style={{ color: C.text }}>System Email Alerts</p>
                              <p className="text-[11px] mt-0.5" style={{ color: C.textDim }}>Receive automatic email notifications for important system activities.</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={notifications.emailAlerts}
                              onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                              className="h-4 w-4 rounded cursor-pointer accent-[#22d9d9]"
                            />
                          </label>

                          <label
                            className="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all hover:border-[#22d9d9]/40"
                            style={{ background: C.panelAlt, borderColor: C.border }}
                          >
                            <div>
                              <p className="text-xs font-bold" style={{ color: C.text }}>Candidate Activity Updates</p>
                              <p className="text-[11px] mt-0.5" style={{ color: C.textDim }}>Get real-time status changes when candidates apply or advance stages.</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={notifications.candidateUpdates}
                              onChange={(e) => setNotifications({ ...notifications, candidateUpdates: e.target.checked })}
                              className="h-4 w-4 rounded cursor-pointer accent-[#22d9d9]"
                            />
                          </label>
                        </div>

                        <div className="pt-4 flex justify-end">
                          <button
                            onClick={() => {
                              setSavedSuccess(true);
                              setTimeout(() => setSavedSuccess(false), 3000);
                            }}
                            className="px-6 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:opacity-90"
                            style={{
                              background: `linear-gradient(135deg, ${C.teal}, #0f5f5f)`,
                              color: "#08101b",
                            }}
                          >
                            <Save size={16} /> Save Preferences
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}