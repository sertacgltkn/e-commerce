import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { User, MapPin, Briefcase, Save, Edit2 } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  bio: string;
  company: string;
  jobTitle: string;
}

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    bio: "",
    company: "",
    jobTitle: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserProfile, string>>
  >({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Load profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else if (user) {
      // Initialize with user data from AuthContext
      setProfile((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserProfile, string>> = {};

    if (!profile.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!profile.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = "Invalid email format";
    }

    if (profile.phone && !/^[\d\s\-\+\(\)]+$/.test(profile.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    if (
      profile.zipCode &&
      !/^\d{4,6}$/.test(profile.zipCode.replace(/\s/g, ""))
    ) {
      newErrors.zipCode = "Invalid ZIP code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Save to localStorage
    localStorage.setItem("userProfile", JSON.stringify(profile));

    setIsSaving(false);
    setSaveSuccess(true);
    setIsEditing(false);

    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border-4 border-white/30">
              <User size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">My Profile</h1>
              <p className="text-primary-100">
                Manage your personal information
              </p>
            </div>
          </div>
          {!isEditing ? (
            <Button
              variant="secondary"
              onClick={() => setIsEditing(true)}
              className="bg-white text-primary-600 hover:bg-primary-50"
            >
              <Edit2 size={18} className="mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  setErrors({});
                  // Reload from localStorage
                  const savedProfile = localStorage.getItem("userProfile");
                  if (savedProfile) {
                    setProfile(JSON.parse(savedProfile));
                  }
                }}
                className="bg-white/20 text-white hover:bg-white/30"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-white text-primary-600 hover:bg-primary-50"
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
            ✓
          </div>
          <div>
            <p className="font-semibold text-green-800 dark:text-green-300">
              Profile Updated Successfully
            </p>
            <p className="text-sm text-green-700 dark:text-green-400">
              Your changes have been saved.
            </p>
          </div>
        </div>
      )}

      {/* Profile Form */}
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <User
                size={20}
                className="text-primary-600 dark:text-primary-400"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Personal Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={profile.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={!isEditing}
              error={errors.name}
              placeholder="John Doe"
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={profile.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={!isEditing}
              error={errors.email}
              placeholder="john.doe@example.com"
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              value={profile.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled={!isEditing}
              error={errors.phone}
              placeholder="+1 (555) 123-4567"
            />
            <Input
              label="Date of Birth"
              type="date"
              value={profile.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              disabled={!isEditing}
              placeholder="MM/DD/YYYY"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              disabled={!isEditing}
              rows={4}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 dark:bg-dark-card dark:text-white resize-none disabled:bg-gray-50 dark:disabled:bg-dark-bg disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <MapPin size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Address Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Street Address"
              value={profile.address}
              onChange={(e) => handleChange("address", e.target.value)}
              disabled={!isEditing}
              placeholder="123 Main Street"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                value={profile.city}
                onChange={(e) => handleChange("city", e.target.value)}
                disabled={!isEditing}
                placeholder="New York"
              />
              <Input
                label="ZIP / Postal Code"
                value={profile.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
                disabled={!isEditing}
                error={errors.zipCode}
                placeholder="10001"
              />
              <Input
                label="Country"
                value={profile.country}
                onChange={(e) => handleChange("country", e.target.value)}
                disabled={!isEditing}
                placeholder="United States"
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Briefcase
                size={20}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Professional Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company"
              value={profile.company}
              onChange={(e) => handleChange("company", e.target.value)}
              disabled={!isEditing}
              placeholder="Acme Inc."
            />
            <Input
              label="Job Title"
              value={profile.jobTitle}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
              disabled={!isEditing}
              placeholder="Software Engineer"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                i
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                Privacy Note
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-400">
                Your information is securely stored in your browser's local
                storage. We never share your personal data with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
