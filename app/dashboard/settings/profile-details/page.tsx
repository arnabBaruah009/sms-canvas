"use client";

import { useGetProfileDetailsQuery } from "@/lib/apis/profile.api";
import { ProfileDetails, UserRole, Gender } from "./types/profile.types";
import { Card, Spin, Tag, Avatar } from "antd";
import { User, Mail, Phone, Building2, Shield, Calendar } from "lucide-react";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const roleColors: Record<UserRole, string> = {
  admin: "red",
  teacher: "blue",
  staff: "green",
  student: "orange",
};

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  teacher: "Teacher",
  staff: "Staff",
  student: "Student",
};

const genderLabels: Record<Gender, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
  prefer_not_to_say: "Prefer not to say",
};

export default function ProfileDetailsPage() {
  const { data, isLoading } = useGetProfileDetailsQuery();
  const profile = data?.data;

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center shadow-sm border border-gray-200">
          <p className="text-lg font-semibold text-gray-700">
            No profile details found
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="shadow-sm border border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Profile Details</h2>
          <p className="text-sm text-gray-500">View your profile information</p>
        </div>

        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-gray-200">
            <Avatar
              src={profile.avatar_url}
              size={120}
              icon={<User className="w-16 h-16" />}
              className="bg-gray-100"
            />
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-2">{profile.name}</h3>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Tag color={roleColors[profile.role]}>
                  {roleLabels[profile.role]}
                </Tag>
                {profile.isEmailVerified && (
                  <Tag color="green">Email Verified</Tag>
                )}
                {!profile.isEmailVerified && (
                  <Tag color="orange">Email Not Verified</Tag>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <p className="text-base text-gray-900">{profile.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <p className="text-base text-gray-900">
                  {profile.phone_number}
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block">
                  Gender
                </label>
                <p className="text-base text-gray-900">
                  {profile.gender
                    ? genderLabels[profile.gender]
                    : "Not specified"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Role
                </label>
                <p className="text-base text-gray-900">
                  {roleLabels[profile.role]}
                </p>
              </div>
            </div>
          </div>

          {/* School Information */}
          {profile.school_id && (
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                School Information
              </h4>
              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block">
                  School ID
                </label>
                <p className="text-base text-gray-900">{profile.school_id}</p>
              </div>
            </div>
          )}

          {/* Account Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Account Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block">
                  Account ID
                </label>
                <p className="text-base text-gray-900 font-mono text-sm">
                  {profile.id}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block">
                  Email Verification Status
                </label>
                <p className="text-base text-gray-900">
                  {profile.isEmailVerified ? "Verified" : "Not Verified"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block">
                  Created At
                </label>
                <p className="text-base text-gray-900">
                  {formatDate(profile.created_at)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block">
                  Last Updated
                </label>
                <p className="text-base text-gray-900">
                  {formatDate(profile.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
