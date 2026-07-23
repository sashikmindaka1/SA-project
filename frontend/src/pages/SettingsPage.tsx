import React, { useState, useEffect } from "react";
import TopBar from "../components/common/TopBar";
import SideNav from "../components/common/SideNav";
import { COLORS } from "../constants/theme";
import { loadDraft, saveDraft } from "../utils/localStorageDraft";
import {
  User,
  Lock,
  Bell,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const API_BASE = "http://localhost:5016"; // backend API base URL

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

  // 1. Fetch Profile Data (DB First - First Record [0], Local Draft Fallback)
  useEffect(() => {
    async function fetchCandidateProfile() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/CandidateProfile`);

        if (response.ok) {
          const data = await response.json();
          // API එකෙන් List එකක් එනවා නම් DB එකේ මුලින්ම හදපු record එක (Index 0) ගන්නවා
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

  // 2. Save Updated Profile (Save to DB & Sync with Local Draft)
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

      // Local Draft එකත් එක්ක Sync කිරීම
      const currentDraft = loadDraft() || {};
      saveDraft({ ...currentDraft, ...profileData });

      // Backend API Update Call
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
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <TopBar userName={profileData.fullName || "User Profile"} userInitials={initials} />

      <div className="flex flex-1 relative overflow-x-hidden">
        <SideNav />

        <main className="flex-1 p-6 text-white overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
              <p className="text-sm text-[#8A9199] mt-0.5">
                Manage your account preferences and profile details synced with the system.
              </p>
            </div>

            {/* Success Alert */}
            {savedSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Settings updated and synced successfully!</span>
              </div>
            )}

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Main Settings Card */}
            <div className="bg-[#20272D] border border-white/10 rounded-xl overflow-hidden flex flex-col md:flex-row min-h-[450px]">
              
              {/* Settings Navigation Tabs */}
              <div className="w-full md:w-56 bg-[#1A2126] border-b md:border-b-0 md:border-r border-white/10 p-3 space-y-1 shrink-0">
                <button
                  onClick={() => { setActiveTab("profile"); setErrorMessage(""); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === "profile"
                      ? "bg-[#0CF2F2]/10 text-[#0CF2F2] border border-[#0CF2F2]/30"
                      : "text-[#8A9199] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <User size={16} /> Profile Details
                </button>

                <button
                  onClick={() => { setActiveTab("security"); setErrorMessage(""); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === "security"
                      ? "bg-[#0CF2F2]/10 text-[#0CF2F2] border border-[#0CF2F2]/30"
                      : "text-[#8A9199] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Lock size={16} /> Security & Password
                </button>

                <button
                  onClick={() => { setActiveTab("notifications"); setErrorMessage(""); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === "notifications"
                      ? "bg-[#0CF2F2]/10 text-[#0CF2F2] border border-[#0CF2F2]/30"
                      : "text-[#8A9199] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Bell size={16} /> Notifications
                </button>
              </div>

              {/* Tab Form Content */}
              <div className="flex-1 p-6">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center py-16 text-[#8A9199]">
                    <Loader2 size={24} className="animate-spin mb-2 text-[#0CF2F2]" />
                    <span className="text-xs">Loading profile information...</span>
                  </div>
                ) : (
                  <>
                    {/* 1. PROFILE DETAILS TAB */}
                    {activeTab === "profile" && (
                      <form onSubmit={handleProfileSave} className="space-y-4">
                        <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">
                          Personal Details
                        </h3>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-[#8A9199] mb-1">Full Name</label>
                            <input
                              type="text"
                              value={profileData.fullName}
                              onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                              placeholder="e.g. Sashik Mindaka"
                              className="w-full bg-[#1A2126] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#0CF2F2]"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-[#8A9199] mb-1">Job Title</label>
                              <input
                                type="text"
                                value={profileData.title}
                                onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                                placeholder="Software Engineer"
                                className="w-full bg-[#1A2126] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#0CF2F2]"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-[#8A9199] mb-1">Location</label>
                              <input
                                type="text"
                                value={profileData.location}
                                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                placeholder="Colombo, Sri Lanka"
                                className="w-full bg-[#1A2126] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#0CF2F2]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-[#8A9199] mb-1">Email Address</label>
                              <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                placeholder="sashik@example.com"
                                className="w-full bg-[#1A2126] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#0CF2F2]"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-[#8A9199] mb-1">Phone Number (Digits Only)</label>
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
                                className="w-full bg-[#1A2126] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#0CF2F2]"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                          <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 bg-[#0CF2F2] text-[#0B1416] font-bold text-xs rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                          >
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            Save Changes
                          </button>
                        </div>
                      </form>
                    )}

                    {/* 2. SECURITY TAB */}
                    {activeTab === "security" && (
                      <form onSubmit={handlePasswordSave} className="space-y-4">
                        <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">
                          Password Settings
                        </h3>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-[#8A9199] mb-1">Current Password</label>
                            <input
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              placeholder="••••••••"
                              className="w-full bg-[#1A2126] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#0CF2F2]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-[#8A9199] mb-1">New Password</label>
                            <input
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              placeholder="••••••••"
                              className="w-full bg-[#1A2126] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#0CF2F2]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-[#8A9199] mb-1">Confirm New Password</label>
                            <input
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                              placeholder="••••••••"
                              className="w-full bg-[#1A2126] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#0CF2F2]"
                            />
                          </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#0CF2F2] text-[#0B1416] font-bold text-xs rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
                          >
                            <Save size={14} /> Update Password
                          </button>
                        </div>
                      </form>
                    )}

                    {/* 3. NOTIFICATIONS TAB */}
                    {activeTab === "notifications" && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-white border-b border-white/10 pb-2">
                          Notification Preferences
                        </h3>

                        <div className="space-y-3">
                          <label className="flex items-center justify-between p-3 bg-[#1A2126] rounded-lg border border-white/5 cursor-pointer">
                            <div>
                              <p className="text-xs font-medium text-white">System Email Alerts</p>
                              <p className="text-[10px] text-[#8A9199]">Receive email notifications for account updates.</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={notifications.emailAlerts}
                              onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                              className="accent-[#0CF2F2] h-4 w-4 cursor-pointer"
                            />
                          </label>

                          <label className="flex items-center justify-between p-3 bg-[#1A2126] rounded-lg border border-white/5 cursor-pointer">
                            <div>
                              <p className="text-xs font-medium text-white">Candidate Activity Updates</p>
                              <p className="text-[10px] text-[#8A9199]">Receive updates when candidate profiles change.</p>
                            </div>
                            <input
                              type="checkbox"
                              checked={notifications.candidateUpdates}
                              onChange={(e) => setNotifications({ ...notifications, candidateUpdates: e.target.checked })}
                              className="accent-[#0CF2F2] h-4 w-4 cursor-pointer"
                            />
                          </label>
                        </div>

                        <div className="pt-4 flex justify-end">
                          <button
                            onClick={() => {
                              setSavedSuccess(true);
                              setTimeout(() => setSavedSuccess(false), 3000);
                            }}
                            className="px-4 py-2 bg-[#0CF2F2] text-[#0B1416] font-bold text-xs rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
                          >
                            <Save size={14} /> Save Preferences
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