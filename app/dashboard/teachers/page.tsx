"use client";

import { useState } from "react";
import {
    Table,
    Drawer,
    Avatar,
    Spin,
    Typography,
    Tag,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Button,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    useGetTeachersQuery,
    useGetTeacherByIdQuery,
    useCreateTeacherMutation,
} from "@/lib/apis/teachers.api";
import type { Teacher, CreateTeacherDto } from "./types/teacher.types";
import { DashboardHeader } from "@/components/dashboard-header/dashboard-header";
import { PrimaryButton } from "@/components/buttons/primary-button";
import { UploadImage } from "@/components/upload-image/upload-image";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import { genderLabels } from "../settings/profile-details/constants/profile.constant";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";

const { Text } = Typography;

const GENDER_OPTIONS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
];

const SUBJECT_OPTIONS = [
    { value: "Mathematics", label: "Mathematics" },
    { value: "Science", label: "Science" },
    { value: "English", label: "English" },
    { value: "History", label: "History" },
    { value: "Geography", label: "Geography" },
    { value: "Physics", label: "Physics" },
    { value: "Chemistry", label: "Chemistry" },
    { value: "Biology", label: "Biology" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "Art", label: "Art" },
    { value: "Music", label: "Music" },
    { value: "Physical Education", label: "Physical Education" },
];

export default function TeachersPage() {
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
        null
    );
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [form] = Form.useForm();
    const { data: teachersData, isLoading: isLoadingList } =
        useGetTeachersQuery();
    const { data: teacherData, isLoading: isLoadingTeacher } =
        useGetTeacherByIdQuery(selectedTeacherId ?? "", {
            skip: !selectedTeacherId,
        });
    const [createTeacher, { isLoading: isCreating }] =
        useCreateTeacherMutation();

    const teachers = teachersData?.data ?? [];
    const selectedTeacher = teacherData?.data ?? null;

    const openAddModal = () => {
        form.resetFields();
        setAddModalOpen(true);
    };

    const closeAddModal = () => {
        setAddModalOpen(false);
        form.resetFields();
    };

    const handleAddTeacher = async (values: Record<string, unknown>) => {
        try {
            const dob = values.dob as dayjs.Dayjs | string;
            const teacher: CreateTeacherDto = {
                name: values.name as string,
                phone_number: (values.phone_number as string) || undefined,
                gender: (values.gender as string) || undefined,
                avatar_url: (values.avatar_url as string) || undefined,
                dob: dayjs.isDayjs(dob) ? dayjs(dob).format("YYYY-MM-DD") : (dob as string),
                address: values.address as string,
                subjects: (values.subjects as string[]) ?? [],
            };
            await createTeacher({ teacher }).unwrap();
            toast.success("Teacher added successfully");
            closeAddModal();
        } catch (err: unknown) {
            const message =
                (err as { data?: { message?: string } })?.data?.message ??
                "Failed to add teacher";
            toast.error(message);
        }
    };

    const columns: ColumnsType<Teacher> = [
        {
            title: "Avatar",
            dataIndex: ["user_id", "avatar_url"],
            key: "avatar",
            width: 80,
            render: (_, record) => (
                <Avatar
                    src={record.user_id?.avatar_url}
                    icon={!record.user_id?.avatar_url ? <UserOutlined /> : undefined}
                    alt={record.user_id?.name}
                    className="bg-[var(--primary-color)]"
                />
            ),
        },
        {
            title: "Name",
            dataIndex: ["user_id", "name"],
            key: "name",
            sorter: (a, b) =>
                (a.user_id?.name ?? "").localeCompare(b.user_id?.name ?? ""),
            render: (_, record) => (
                <span className="font-medium">{record.user_id?.name}</span>
            ),
        },
        {
            title: "Phone",
            dataIndex: ["user_id", "phone_number"],
            key: "phone",
            width: 140,
            render: (_, record) => record.user_id?.phone_number ?? "—",
        },
        {
            title: "Gender",
            dataIndex: ["user_id", "gender"],
            key: "gender",
            width: 100,
            render: (_, record) =>
                record.user_id?.gender
                    ? genderLabels[record.user_id.gender]
                    : "—",
        },
        {
            title: "DOB",
            dataIndex: "dob",
            key: "dob",
            width: 110,
            render: (_, record) =>
                record.dob ? dayjs(record.dob).format("DD/MM/YYYY") : "—",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            ellipsis: true,
        },
        {
            title: "Subjects",
            dataIndex: "subjects",
            key: "subjects",
            width: 180,
            render: (subjects: string[]) =>
                subjects?.length ? (
                    <span className="text-sm">{subjects.join(", ")}</span>
                ) : (
                    "—"
                ),
        },
    ];

    if (isLoadingList) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col md:px-8 pt-4 md:pt-6">
            <DashboardHeader
                title="Teachers"
                description="Manage and view teacher details"
                showBackButton={false}
                bottomBorder={true}
                buttons={[
                    <PrimaryButton
                        key="add-teacher"
                        title="Add teacher"
                        icon={<PlusOutlined />}
                        onClick={openAddModal}
                    />,
                ]}
            />
            <div className="flex-1 overflow-auto pt-4 pb-6">
                <Table<Teacher>
                    rowKey="_id"
                    columns={columns}
                    dataSource={teachers}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} teachers`,
                    }}
                    onRow={(record) => ({
                        onClick: () => setSelectedTeacherId(record._id),
                        style: { cursor: "pointer" },
                    })}
                    className="shadow-sm rounded-lg overflow-hidden"
                />
            </div>

            <Drawer
                title={
                    selectedTeacher ? (
                        <span className="font-semibold">
                            {selectedTeacher.user_id?.name}
                        </span>
                    ) : (
                        "Teacher Details"
                    )
                }
                placement="right"
                size={480}
                open={!!selectedTeacherId}
                onClose={() => setSelectedTeacherId(null)}
                extra={
                    selectedTeacher && (
                        <Text type="secondary">ID: {selectedTeacher._id}</Text>
                    )
                }
            >
                {isLoadingTeacher && selectedTeacherId ? (
                    <div className="flex justify-center py-8">
                        <Spin size="large" />
                    </div>
                ) : selectedTeacher ? (
                    <div className="flex flex-col gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar
                                    src={selectedTeacher.user_id?.avatar_url}
                                    icon={
                                        !selectedTeacher.user_id?.avatar_url ? (
                                            <UserOutlined />
                                        ) : (
                                            undefined
                                        )
                                    }
                                    size={64}
                                    className="bg-[var(--primary-color)]"
                                />
                                <div>
                                    <Text strong className="text-base">
                                        {selectedTeacher.user_id?.name}
                                    </Text>
                                    {selectedTeacher.subjects?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {selectedTeacher.subjects.map(
                                                (sub) => (
                                                    <Tag key={sub}>{sub}</Tag>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <Text strong className="block mb-2 text-gray-700">
                                Basic Details
                            </Text>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <Text type="secondary">Name</Text>
                                <Text>{selectedTeacher.user_id?.name}</Text>
                                <Text type="secondary">Phone</Text>
                                <Text>
                                    {selectedTeacher.user_id?.phone_number ?? "—"}
                                </Text>
                                {selectedTeacher.user_id?.email && (
                                    <>
                                        <Text type="secondary">Email</Text>
                                        <Text>
                                            {selectedTeacher.user_id.email}
                                        </Text>
                                    </>
                                )}
                                {selectedTeacher.user_id?.gender && (
                                    <>
                                        <Text type="secondary">Gender</Text>
                                        <Text>
                                            {genderLabels[
                                                selectedTeacher.user_id.gender
                                            ]}
                                        </Text>
                                    </>
                                )}
                                <Text type="secondary">DOB</Text>
                                <Text>
                                    {selectedTeacher.dob
                                        ? dayjs(selectedTeacher.dob).format(
                                            "DD/MM/YYYY"
                                        )
                                        : "—"}
                                </Text>
                                <Text type="secondary">Address</Text>
                                <Text className="col-span-2">
                                    {selectedTeacher.address}
                                </Text>
                            </div>
                        </div>

                        {selectedTeacher.education?.length > 0 && (
                            <div>
                                <Text strong className="block mb-2 text-gray-700">
                                    Education
                                </Text>
                                <ul className="list-none p-0 m-0 space-y-2">
                                    {selectedTeacher.education.map(
                                        (entry, index) => (
                                            <li
                                                key={index}
                                                className="text-sm text-gray-600"
                                            >
                                                <Text strong>
                                                    {entry.yearFrom} -{" "}
                                                    {entry.yearTo}:
                                                </Text>{" "}
                                                {entry.description ?? ""}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        No teacher selected
                    </div>
                )}
            </Drawer>

            <Modal
                title="Add teacher"
                open={addModalOpen}
                onCancel={closeAddModal}
                footer={null}
                width={640}
                destroyOnHidden
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddTeacher}
                    className="pt-2"
                >
                    <div className="grid grid-cols-1 sm:flex gap-x-4 gap-y-0">
                        <Form.Item name="avatar_url">
                            <UploadImage listType="picture-circle" />
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="Full name"
                            rules={[{ required: true, message: "Name is required" }]}
                            className="flex-1"
                        >
                            <Input placeholder="e.g. Jane Smith" />
                        </Form.Item>
                        <Form.Item
                            name="phone_number"
                            label="Phone number"
                            rules={[
                                {
                                    pattern:
                                        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
                                    message: "Enter a valid phone number",
                                },
                                { required: true, message: "Phone number is required" },
                            ]}
                            className="flex-1"
                        >
                            <Input placeholder="1234567890" />
                        </Form.Item>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <Form.Item
                            name="gender"
                            label="Gender"
                            rules={[{ required: true, message: "Gender is required" }]}
                        >
                            <Select
                                placeholder="Select gender"
                                allowClear
                                options={GENDER_OPTIONS}
                            />
                        </Form.Item>
                        <Form.Item
                            name="dob"
                            label="Date of birth"
                            rules={[{ required: true, message: "DOB is required" }]}
                        >
                            <DatePicker className="w-full" format="YYYY-MM-DD" />
                        </Form.Item>
                    </div>
                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[{ required: true, message: "Address is required" }]}
                    >
                        <Input placeholder="Street, city, state, country" />
                    </Form.Item>
                    <Form.Item name="subjects" label="Subjects">
                        <Select
                            mode="multiple"
                            placeholder="Select subjects"
                            allowClear
                            options={SUBJECT_OPTIONS}
                            maxTagCount="responsive"
                        />
                    </Form.Item>

                    <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                        <Button onClick={closeAddModal}>Cancel</Button>
                        <PrimaryButton
                            title="Add teacher"
                            type="primary"
                            htmlType="submit"
                            loading={isCreating}
                        />
                    </div>
                </Form>
            </Modal>
        </div>
    );
}
