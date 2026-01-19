"use client";

import { useState } from "react";
import {
  useGetSchoolQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
} from "@/lib/apis/school.api";
import { SchoolDetails, SchoolLevel, SchoolBoard, SchoolType } from "./types/school.types";
import { PrimaryButton } from "@/components/buttons/primary-button";
import { Input, Select, Form, Card, Spin, Empty } from "antd";
import { Building2, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { isValidEmail } from "@/lib/utils/validation.utils";
import { UploadImage } from "@/components/upload-image/upload-image";

const { Option } = Select;
const { TextArea } = Input;

const schoolLevels: SchoolLevel[] = [
  "Primary",
  "Secondary",
  "Higher Secondary",
  "Composite",
];
const schoolBoards: SchoolBoard[] = [
  "CBSE",
  "HSLC",
  "ICSE",
  "State Board",
  "Other",
];
const schoolTypes: SchoolType[] = ["Government", "Private"];

export default function SchoolDetailsPage() {
  const [form] = Form.useForm();
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading, refetch } = useGetSchoolQuery();
  const [createSchool, { isLoading: isCreating }] = useCreateSchoolMutation();
  const [updateSchool, { isLoading: isUpdating }] = useUpdateSchoolMutation();

  const school = data?.data;
  const isSubmitting = isCreating || isUpdating;

  const handleAddSchool = async (values: SchoolDetails) => {
    try {
      let response;
      if (isEditing && school?._id) {
        response = await updateSchool({
          id: school._id,
          school: values,
        }).unwrap();
      } else {
        response = await createSchool({ school: values }).unwrap();
      }

      if (response.data) {
        toast.success(
          isEditing
            ? "School details updated successfully!"
            : "School details added successfully!"
        );
        setIsAddingSchool(false);
        setIsEditing(false);
        form.resetFields();
      }
    } catch (error: any) {
      const message = error?.data?.message ?? "Failed to save school details";
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

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!school && !isAddingSchool) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center shadow-sm border border-gray-200">
          <Empty
            image={<Building2 className="w-16 h-16 mx-auto text-gray-400" />}
            description={
              <div className="mt-4">
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  No School Found
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Get started by adding your school details
                </p>
                <PrimaryButton
                  title="Add School"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => setIsAddingSchool(true)}
                  type="primary"
                />
              </div>
            }
          />
        </Card>
      </div>
    );
  }

  if (isAddingSchool || !school) {
    return (
      <div className="w-full">
        <div className="">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              {isEditing ? "Edit School Details" : "Add School Details"}
            </h2>
            <p className="text-sm text-gray-500">
              {isEditing
                ? "Update your school information below"
                : "Fill in the information below to add your school"}
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddSchool}
            className="space-y-2"
          >
            <div className="flex flex-row w-full items-center gap-4">
              <Form.Item
                name="logo_url"
                valuePropName="value"
              >
                <UploadImage
                  onChange={(url) => {
                    form.setFieldValue("logo_url", url);
                  }}
                  listType="picture-circle"
                />
              </Form.Item>

              <Form.Item
                name="name"
                label="School Name"
                rules={[{ required: true, message: "School name is required" }]}
                className="flex-1"
              >
                <Input placeholder="Enter school name" size="large" />
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
                className="flex-1"
              >
                <Input placeholder="Enter phone number" size="large" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[{ validator: validateEmail }]}
                className="flex-1"
              >
                <Input
                  type="email"
                  placeholder="Enter email address"
                  size="large"
                />
              </Form.Item>
            </div>

            <Form.Item
              name="address_line"
              label="Address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <Input placeholder="Enter address" size="large" />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Form.Item
                name="pincode"
                label="Pincode"
                rules={[
                  { required: true, message: "Pincode is required" },
                  {
                    pattern: /^[0-9]{6}$/,
                    message: "Please enter a valid 6-digit pincode",
                  },
                ]}
              >
                <Input placeholder="Enter pincode" size="large" />
              </Form.Item>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: "City is required" }]}
              >
                <Input placeholder="Enter city" size="large" />
              </Form.Item>

              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: "State is required" }]}
              >
                <Input placeholder="Enter state" size="large" />
              </Form.Item>

              <Form.Item
                name="country"
                label="Country"
                rules={[{ required: true, message: "Country is required" }]}
              >
                <Input placeholder="Enter country" size="large" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                name="level"
                label="School Level"
                rules={[{ required: true, message: "School level is required" }]}
              >
                <Select placeholder="Select school level" size="large">
                  {schoolLevels.map((level) => (
                    <Option key={level} value={level}>
                      {level}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="board"
                label="Board"
                rules={[{ required: true, message: "Board is required" }]}
              >
                <Select placeholder="Select board" size="large">
                  {schoolBoards.map((board) => (
                    <Option key={board} value={board}>
                      {board}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="type"
                label="School Type"
                rules={[{ required: true, message: "School type is required" }]}
              >
                <Select placeholder="Select school type" size="large">
                  {schoolTypes.map((type) => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="primary_contact_name"
                label="Primary Contact Person Name"
              >
                <Input placeholder="Enter primary contact name" size="large" />
              </Form.Item>

              <Form.Item
                name="primary_contact_number"
                label="Primary Contact Number"
                rules={[
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit phone number",
                  },
                ]}
              >
                <Input placeholder="Enter primary contact number" size="large" />
              </Form.Item>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <PrimaryButton
                title="Cancel"
                onClick={() => {
                  setIsAddingSchool(false);
                  setIsEditing(false);
                  form.resetFields();
                }}
                disabled={isSubmitting}
              />
              <PrimaryButton
                title={isEditing ? "Update School" : "Add School"}
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
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
        <div className="flex justify-end items-start mb-6">
          <PrimaryButton
            title="Edit"
            onClick={() => {
              form.setFieldsValue(school);
              setIsAddingSchool(true);
              setIsEditing(true);
            }}
          />
        </div>

        <div className="space-y-6">
          {school.logo_url && (
            <div className="flex justify-center">
              <img
                src={school.logo_url}
                alt="School Logo"
                className="w-32 h-32 object-contain rounded-lg"
              />
            </div>
          )}

          <div className="flex flex-row w-full gap-8">
            {/* Left Column */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="text-base font-bold text-gray-500 mb-1 block">
                  School Name
                </label>
                <p className="text-sm font-medium text-gray-500">{school.name}</p>
              </div>

              <div>
                <label className="text-base font-bold text-gray-500 mb-1 block">
                  Phone Number
                </label>
                <p className="text-sm font-medium text-gray-500">{school.phone_number}</p>
              </div>

              <div>
                <label className="text-base font-bold text-gray-500 mb-1 block">
                  Email
                </label>
                <p className="text-sm font-medium text-gray-500">{school.email}</p>
              </div>

              <div>
                <label className="text-base font-bold text-gray-500 mb-1 block">
                  School Level
                </label>
                <p className="text-sm font-medium text-gray-500">{school.level}</p>
              </div>

              <div>
                <label className="text-base font-bold text-gray-500 mb-1 block">
                  Board
                </label>
                <p className="text-sm font-medium text-gray-500">{school.board}</p>
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
                <p className="text-sm font-medium text-gray-500">{school.address_line}</p>
              </div>

              <div>
                <label className="text-base font-bold text-gray-500 mb-1 block">
                  City
                </label>
                <p className="text-sm font-medium text-gray-500">{school.city}</p>
              </div>

              <div>
                <label className="text-base font-bold text-gray-500 mb-1 block">
                  State
                </label>
                <p className="text-sm font-medium text-gray-500">{school.state}</p>
              </div>

              <div>
                <label className="text-base font-bold text-gray-500 mb-1 block">
                  Country
                </label>
                <p className="text-sm font-medium text-gray-500">{school.country}</p>
              </div>

              <div>
                <label className="text-base font-bold text-gray-500 mb-1 block">
                  Pincode
                </label>
                <p className="text-sm font-medium text-gray-500">{school.pincode}</p>
              </div>

              <div>
                <label className="text-base font-bold text-gray-500 mb-1 block">
                  Primary Contact Person Name
                </label>
                <p className="text-sm font-medium text-gray-500">{school.primary_contact_name || "N/A"}</p>
              </div>

              <div>
                <label className="text-base font-bold text-gray-500 mb-1 block">
                  Primary Contact Number
                </label>
                <p className="text-sm font-medium text-gray-500">{school.primary_contact_number || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
