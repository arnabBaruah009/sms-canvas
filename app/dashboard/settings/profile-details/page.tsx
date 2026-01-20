"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetProfileDetailsQuery,
  useUpdateProfileMutation,
} from "@/lib/apis/profile.api";
import { ProfileDetails, UserRole, Gender } from "./types/profile.types";
import { PrimaryButton } from "@/components/buttons/primary-button";
import { Input, Select, Form, Spin, Avatar, Tag } from "antd";
import {
  User,
  Building2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { isValidEmail } from "@/lib/utils/validation.utils";
import dayjs from "dayjs";
import { UploadImage } from "@/components/upload-image/upload-image";
import { setIsEditingProfile } from "@/lib/redux/slice/settings.slice";
import type { RootState } from "@/lib/redux/store";

const { Option } = Select;

const userRoles: UserRole[] = ["admin", "teacher", "staff", "student"];
const genders: Gender[] = ["male", "female", "other"];

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


export default function ProfileDetailsPage() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isEditing = useSelector(
    (state: RootState) => state.settingsSlice.isEditingProfile
  );
  const { data, isLoading, refetch } = useGetProfileDetailsQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const profile = data?.data;

  useEffect(() => {
    if (isEditing && profile) {
      form.setFieldsValue({
        name: profile.name,
        email: profile.email,
        phone_number: profile.phone_number,
        gender: profile.gender,
        role: profile.role,
        avatar_url: profile.avatar_url,
      });
    }
  }, [isEditing, profile, form]);

  const handleUpdateProfile = async (values: Partial<ProfileDetails>) => {
    try {
      const response = await updateProfile({ profile: values }).unwrap();
      if (response.data) {
        toast.success("Profile updated successfully!");
        dispatch(setIsEditingProfile(false));
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

  if (!profile) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="w-full">
        <div className="">
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
            <Form.Item
              name="avatar_url"
              label="Profile Picture"
              valuePropName="value"
            >
              <UploadImage
                onChange={(url) => {
                  form.setFieldValue("avatar_url", url);
                }}
              />
            </Form.Item>

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
                <Input
                  placeholder="Enter phone number"
                  size="large"
                  disabled={!!profile?.phone_number}
                />
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
                disabled={!!profile?.email}
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
                  dispatch(setIsEditingProfile(false));
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
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="">
        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-row gap-6 items-start">
            <Avatar
              src={profile.avatar_url}
              size={120}
              icon={<User className="w-16 h-16" />}
              className="bg-gray-100"
            />
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-semibold text-gray-900">
                {profile.name}
              </h3>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-600">{profile.email}</p>
                <p className="text-sm text-gray-600">{profile.phone_number}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.isEmailVerified ? (
                  <Tag color="green">Email Verified</Tag>
                ) : (
                  <Tag color="orange">Email Not Verified</Tag>
                )}
                <Tag color="blue">{roleLabels[profile.role]}</Tag>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="flex flex-row w-full gap-8">
            {/* Left Column */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="text-base font-bold text-gray-500 mb-1 block">
                  Gender
                </label>
                <p className="text-sm font-medium text-gray-500">
                  {profile.gender
                    ? genderLabels[profile.gender]
                    : "Not specified"}
                </p>
              </div>

              <div>
                <label className="text-base font-bold text-gray-500 mb-1 block">
                  Account ID
                </label>
                <p className="text-sm font-medium text-gray-500 font-mono text-xs">
                  {profile._id}
                </p>
              </div>
            </div>

            {/* Vertical Separator */}
            <div className="w-px bg-gray-300"></div>

            {/* Right Column */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="text-base font-bold text-gray-500 mb-1 block">
                  Created At
                </label>
                <p className="text-sm font-medium text-gray-500">
                  {formatDate(profile.createdAt)}
                </p>
              </div>

              <div>
                <label className="text-base font-bold text-gray-500 mb-1 block">
                  Last Updated
                </label>
                <p className="text-sm font-medium text-gray-500">
                  {formatDate(profile.updatedAt)}
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
              <div className="flex flex-row w-full gap-8">
                {/* Left Column */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-base font-bold text-gray-500 mb-1 block">
                      School Name
                    </label>
                    <p className="text-sm font-medium text-gray-500">
                      {profile.school_id.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-base font-bold text-gray-500 mb-1 block">
                      Phone Number
                    </label>
                    <p className="text-sm font-medium text-gray-500">
                      {profile.school_id.phone_number}
                    </p>
                  </div>

                  <div>
                    <label className="text-base font-bold text-gray-500 mb-1 block">
                      Email
                    </label>
                    <p className="text-sm font-medium text-gray-500">
                      {profile.school_id.email}
                    </p>
                  </div>

                  <div>
                    <label className="text-base font-bold text-gray-500 mb-1 block">
                      School Level
                    </label>
                    <p className="text-sm font-medium text-gray-500">
                      {profile.school_id.level}
                    </p>
                  </div>

                  <div>
                    <label className="text-base font-bold text-gray-500 mb-1 block">
                      Board
                    </label>
                    <p className="text-sm font-medium text-gray-500">
                      {profile.school_id.board}
                    </p>
                  </div>
                </div>

                {/* Vertical Separator */}
                <div className="w-px bg-gray-300"></div>

                {/* Right Column */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-base font-bold text-gray-500 mb-1 block">
                      Address
                    </label>
                    <p className="text-sm font-medium text-gray-500">
                      {profile.school_id.address_line}
                    </p>
                  </div>

                  <div>
                    <label className="text-base font-bold text-gray-500 mb-1 block">
                      City
                    </label>
                    <p className="text-sm font-medium text-gray-500">
                      {profile.school_id.city}
                    </p>
                  </div>

                  <div>
                    <label className="text-base font-bold text-gray-500 mb-1 block">
                      State
                    </label>
                    <p className="text-sm font-medium text-gray-500">
                      {profile.school_id.state}
                    </p>
                  </div>

                  <div>
                    <label className="text-base font-bold text-gray-500 mb-1 block">
                      Country
                    </label>
                    <p className="text-sm font-medium text-gray-500">
                      {profile.school_id.country}
                    </p>
                  </div>

                  <div>
                    <label className="text-base font-bold text-gray-500 mb-1 block">
                      Pincode
                    </label>
                    <p className="text-sm font-medium text-gray-500">
                      {profile.school_id.pincode}
                    </p>
                  </div>

                  {(profile.school_id.primary_contact_name ||
                    profile.school_id.primary_contact_number) && (
                      <div>
                        <label className="text-base font-bold text-gray-500 mb-1 block">
                          Contact Person
                        </label>
                        <p className="text-sm font-medium text-gray-500">
                          {profile.school_id.primary_contact_name || "-"},{" "}
                          {profile.school_id.primary_contact_number || "-"}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
