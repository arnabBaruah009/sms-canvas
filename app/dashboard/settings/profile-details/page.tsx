"use client";

import { useState } from "react";
import {
  useGetProfileDetailsQuery,
  useUpdateProfileMutation,
} from "@/lib/apis/profile.api";
import { ProfileDetails, UserRole, Gender } from "./types/profile.types";
import { PrimaryButton } from "@/components/buttons/primary-button";
import { Input, Select, Form, Card, Spin, Tag, Avatar } from "antd";
import {
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  Calendar,
  Edit,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { isValidEmail } from "@/lib/utils/validation.utils";
import dayjs from "dayjs";

const { Option } = Select;

const userRoles: UserRole[] = ["admin", "teacher", "staff", "student"];
const genders: Gender[] = ["male", "female", "other"];

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
};

// Dummy data for testing
const dummyProfile: ProfileDetails = {
  id: "usr_123456789",
  name: "John Doe",
  phone_number: "9876543210",
  email: "john.doe@example.com",
  avatar_url:
    "https://t4.ftcdn.net/jpg/14/20/90/45/360_F_1420904592_2VrDzoD1u2hcofrG9e9AriDYmApoOdFe.jpg",
  gender: "male",
  role: "admin",
  isEmailVerified: true,
  school_id: "school_123",
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2024-12-20T14:45:00Z",
  deleted_at: null,
};

export default function ProfileDetailsPage() {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading, refetch } = useGetProfileDetailsQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Use dummy data if API returns no data
  const profile = data?.data || dummyProfile;

  const handleUpdateProfile = async (values: Partial<ProfileDetails>) => {
    try {
      const response = await updateProfile({ profile: values }).unwrap();
      if (response.data) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        form.resetFields();
        refetch();
      }
    } catch (error: any) {
      const message = error?.data?.message ?? "Failed to update profile";
      toast.error(message);
    }
  };

  const validateEmail = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error("Email is required"));
    }
    if (!isValidEmail(value)) {
      return Promise.reject(new Error("Invalid email address"));
    }
    return Promise.resolve();
  };

  const formatDate = (dateString: string): string => {
    return dayjs(dateString).format("MMMM DD, YYYY [at] hh:mm A");
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Card className="shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Edit Profile</h2>
            <p className="text-sm text-gray-500">
              Update your profile information below
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateProfile}
            initialValues={{
              name: profile.name,
              email: profile.email,
              phone_number: profile.phone_number,
              gender: profile.gender,
              role: profile.role,
              avatar_url: profile.avatar_url,
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: "Name is required" }]}
              >
                <Input placeholder="Enter your full name" size="large" />
              </Form.Item>

              <Form.Item
                name="phone_number"
                label="Phone Number"
                rules={[
                  { required: true, message: "Phone number is required" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit phone number",
                  },
                ]}
              >
                <Input placeholder="Enter phone number" size="large" />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ validator: validateEmail }]}
            >
              <Input
                type="email"
                placeholder="Enter email address"
                size="large"
              />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item name="gender" label="Gender">
                <Select placeholder="Select gender" size="large">
                  {genders.map((gender) => (
                    <Option key={gender} value={gender}>
                      {genderLabels[gender]}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Role is required" }]}
              >
                <Select placeholder="Select role" size="large" disabled>
                  {userRoles.map((role) => (
                    <Option key={role} value={role}>
                      {roleLabels[role]}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <PrimaryButton
                title="Cancel"
                onClick={() => {
                  setIsEditing(false);
                  form.resetFields();
                }}
                disabled={isUpdating}
              />
              <PrimaryButton
                title="Update Profile"
                type="primary"
                htmlType="submit"
                loading={isUpdating}
              />
            </div>
          </Form>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="shadow-sm border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Profile Details</h2>
            <p className="text-sm text-gray-500">
              View and manage your profile information
            </p>
          </div>
          <PrimaryButton
            title="Edit"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => {
              form.setFieldsValue({
                name: profile.name,
                email: profile.email,
                phone_number: profile.phone_number,
                gender: profile.gender,
                role: profile.role,
                avatar_url: profile.avatar_url,
              });
              setIsEditing(true);
            }}
          />
        </div>

        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-gray-200">
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
