"use client";

import { useState } from "react";
import {
    Table,
    Drawer,
    Avatar,
    Spin,
    Typography,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    DatePicker,
    Button,
    Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    useGetStudentsQuery,
    useGetStudentByIdQuery,
    useCreateStudentMutation,
    useDeleteStudentMutation,
} from "@/lib/apis/students.api";
import type { Student, CreateStudentDto } from "./types/student.types";
import { DashboardHeader } from "@/components/dashboard-header/dashboard-header";
import { PrimaryButton } from "@/components/buttons/primary-button";
import { UploadImage } from "@/components/upload-image/upload-image";
import { UserOutlined, PlusOutlined, MinusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { genderLabels, roleLabels } from "../settings/profile-details/constants/profile.constant";

const { Text } = Typography;
const { TextArea } = Input;

const GENDER_OPTIONS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
];

export default function StudentsPage() {
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [form] = Form.useForm();
    const { data: studentsData, isLoading: isLoadingList } = useGetStudentsQuery();
    const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();
    const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
    const { data: studentData, isLoading: isLoadingStudent } =
        useGetStudentByIdQuery(selectedStudentId ?? "", {
            skip: !selectedStudentId,
        });

    const students = studentsData?.data ?? [];
    const selectedStudent = studentData?.data ?? null;

    const openAddModal = () => {
        form.resetFields();
        setAddModalOpen(true);
    };

    const closeAddModal = () => {
        setAddModalOpen(false);
        form.resetFields();
    };

    const handleAddStudent = async (values: Record<string, unknown>) => {
        try {
            const dob = values.dob as dayjs.Dayjs | string;
            const education = values.education as Array<{
                yearFrom?: number;
                yearTo?: number;
                description?: string;
            }> | undefined;
            const student: CreateStudentDto = {
                name: values.name as string,
                phone_number: (values.phone_number as string) || undefined,
                gender: (values.gender as string) || undefined,
                avatar_url: (values.avatar_url as string) || undefined,
                dob: dayjs.isDayjs(dob) ? dob.format("YYYY-MM-DD") : (dob as string),
                address: values.address as string,
                about: (values.about as string) || undefined,
                education: education?.filter(
                    (e) =>
                        typeof e?.yearFrom === "number" &&
                        typeof e?.yearTo === "number" &&
                        e?.description
                ) as CreateStudentDto["education"],
            };
            await createStudent({ student }).unwrap();
            toast.success("Student added successfully");
            closeAddModal();
        } catch (err: unknown) {
            const message =
                (err as { data?: { message?: string } })?.data?.message ??
                "Failed to add student";
            toast.error(message);
        }
    };

    const columns: ColumnsType<Student> = [
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
            sorter: (a, b) => (a.user_id?.name ?? "").localeCompare(b.user_id?.name ?? ""),
            render: (_, record) => (
                <span className="font-medium">{record.user_id?.name}</span>
            ),
        },
        // {
        //     title: "ID",
        //     dataIndex: "_id",
        //     key: "_id",
        //     width: 120,
        //     render: (id) => <Text type="secondary">ID: {id}</Text>,
        // },
        {
            title: "Mobile",
            dataIndex: ["user_id", "phone_number"],
            key: "mobile",
            width: 140,
            render: (_, record) => record.user_id?.phone_number,
        },
        {
            title: "Gender",
            dataIndex: ["user_id", "gender"],
            key: "gender",
            width: 100,
            render: (_, record) => record.user_id?.gender ? genderLabels[record.user_id?.gender] : "Not specified",
        },
        {
            title: "DOB",
            dataIndex: "dob",
            key: "dob",
            width: 110,
            render: (_, record) => dayjs(record.dob).format("DD/MM/YYYY"),
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            ellipsis: true,
        },
        {
            title: "Action",
            key: "action",
            width: 80,
            fixed: "right",
            render: (_, record) => (
                <Popconfirm
                    title="Delete student"
                    description="Are you sure you want to delete this student?"
                    onConfirm={(e) => {
                        e?.stopPropagation();
                        deleteStudent(record._id)
                            .unwrap()
                            .then(() => toast.success("Student deleted"))
                            .catch((err: { data?: { message?: string } }) =>
                                toast.error(err?.data?.message ?? "Failed to delete student")
                            );
                    }}
                    onCancel={(e) => e?.stopPropagation()}
                    okText="Delete"
                    okButtonProps={{ danger: true }}
                >
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        loading={isDeleting}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Delete student"
                    />
                </Popconfirm>
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
                title="Students"
                description="Manage and view student details"
                showBackButton={false}
                bottomBorder={true}
                buttons={[
                    <PrimaryButton
                        key="add-student"
                        title="Add student"
                        icon={<PlusOutlined />}
                        onClick={openAddModal}
                    />,
                ]}
            />
            <div className="flex-1 overflow-auto pt-4 pb-6">
                <Table<Student>
                    rowKey="_id"
                    columns={columns}
                    dataSource={students}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} students`,
                    }}
                    onRow={(record) => ({
                        onClick: () => setSelectedStudentId(record._id),
                        style: { cursor: "pointer" },
                    })}
                    className="shadow-sm rounded-lg overflow-hidden"
                />
            </div>

            <Drawer
                title={
                    selectedStudent ? (
                        <span className="font-semibold">{selectedStudent.user_id?.name}</span>
                    ) : (
                        "Student Details"
                    )
                }
                placement="right"
                size={480}
                open={!!selectedStudentId}
                onClose={() => setSelectedStudentId(null)}
                extra={
                    selectedStudent && (
                        <Text type="secondary">ID: {selectedStudent._id}</Text>
                    )
                }
            >
                {isLoadingStudent && selectedStudentId ? (
                    <div className="flex justify-center py-8">
                        <Spin size="large" />
                    </div>
                ) : selectedStudent ? (
                    <div className="flex flex-col gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar
                                    src={selectedStudent.user_id?.avatar_url}
                                    icon={!selectedStudent.user_id?.avatar_url ? <UserOutlined /> : undefined}
                                    size={64}
                                    className="bg-[var(--primary-color)]"
                                />
                                <div>
                                    <Text strong className="text-base">
                                        {selectedStudent.user_id?.name}
                                    </Text>
                                    {selectedStudent.user_id?.role && (
                                        <div className="text-sm text-gray-500">
                                            {roleLabels[selectedStudent.user_id.role]}
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
                                <Text>{selectedStudent.user_id?.name}</Text>
                                <Text type="secondary">Mobile</Text>
                                <Text>{selectedStudent.user_id?.phone_number}</Text>
                                {selectedStudent.user_id?.email && (
                                    <>
                                        <Text type="secondary">Email</Text>
                                        <Text>{selectedStudent.user_id.email}</Text>
                                    </>
                                )}
                                {selectedStudent.user_id?.gender && (
                                    <>
                                        <Text type="secondary">Gender</Text>
                                        <Text>{selectedStudent.user_id.gender ? genderLabels[selectedStudent.user_id.gender] : "Not specified"}</Text>
                                    </>
                                )}
                                <Text type="secondary">DOB</Text>
                                <Text>{selectedStudent.dob}</Text>
                                <Text type="secondary">Address</Text>
                                <Text className="col-span-2">{selectedStudent.address}</Text>
                            </div>
                        </div>

                        {selectedStudent.education && selectedStudent.education.length > 0 && (
                            <div>
                                <Text strong className="block mb-2 text-gray-700">
                                    Education
                                </Text>
                                <ul className="list-none p-0 m-0 space-y-2">
                                    {selectedStudent.education.map((entry, index) => (
                                        <li key={index} className="text-sm text-gray-600">
                                            <Text strong>
                                                {entry.yearFrom} - {entry.yearTo}:
                                            </Text>{" "}
                                            Class: {entry.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        No student selected
                    </div>
                )}
            </Drawer>

            <Modal
                title="Add student"
                open={addModalOpen}
                onCancel={closeAddModal}
                footer={null}
                width={640}
                destroyOnHidden
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddStudent}
                    className="pt-2"
                    initialValues={{
                        education: [{ yearFrom: undefined, yearTo: undefined, description: "" }],
                    }}
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
                            <Input placeholder="e.g. John Doe" />
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
                                {
                                    required: true,
                                    message: "Phone number is required",
                                }
                            ]}
                            className="flex-1"
                        >
                            <Input placeholder="1234567890" />
                        </Form.Item>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Gender is required" }]}>
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
                    <Form.Item name="about" label="About">
                        <TextArea rows={3} placeholder="Brief bio or notes" />
                    </Form.Item>

                    <Form.List name="education">
                        {(fields, { add, remove }) => (
                            <>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        Education
                                    </span>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<PlusOutlined />}
                                        className="mb-2"
                                        size="small"
                                    />
                                </div>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div
                                        key={key}
                                        className="flex gap-2 items-center p-3 mb-2 rounded border border-gray-200 bg-gray-50/50"
                                    >
                                        <Form.Item
                                            {...restField}
                                            name={[name, "yearFrom"]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Required",
                                                },
                                                {
                                                    type: "number",
                                                    min: 1900,
                                                    max: 2100,
                                                    message: "1900–2100",
                                                },
                                            ]}
                                            style={{ marginBottom: 0, flex: '0 0 100px' }}
                                        >
                                            <InputNumber
                                                style={{ width: "100%" }}
                                                placeholder="From"
                                                min={1900}
                                                max={2100}
                                            />
                                        </Form.Item>
                                        <span className="mx-1">-</span>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "yearTo"]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Required",
                                                },
                                                {
                                                    type: "number",
                                                    min: 1900,
                                                    max: 2100,
                                                    message: "1900–2100",
                                                },
                                            ]}
                                            style={{ marginBottom: 0, flex: '0 0 100px' }}
                                        >
                                            <InputNumber
                                                style={{ width: "100%" }}
                                                placeholder="To"
                                                min={1900}
                                                max={2100}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "description"]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Required",
                                                },
                                            ]}
                                            style={{ marginBottom: 0, flex: '1 1 200px' }}
                                        >
                                            <Input placeholder="Class" />
                                        </Form.Item>
                                        <Form.Item style={{ marginBottom: 0 }}>
                                            <Button
                                                type="text"
                                                danger
                                                icon={<MinusCircleOutlined />}
                                                onClick={() => remove(name)}
                                            />
                                        </Form.Item>
                                    </div>
                                ))}
                            </>
                        )}
                    </Form.List>

                    <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                        <Button onClick={closeAddModal}>Cancel</Button>
                        <PrimaryButton
                            title="Add student"
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
