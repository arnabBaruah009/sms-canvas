"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { UserOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { genderLabels, roleLabels } from "../settings/profile-details/constants/profile.constant";
import type { RootState } from "@/lib/redux/store";
import {
    deleteStudentsFilterKey,
    setStudentsFilters,
} from "@/lib/redux/slice/students.slice";

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
    const dispatch = useDispatch();
    const studentsFilters = useSelector(
        (state: RootState) => state.studentsSlice.studentsFilters
    );
    const [searchInput, setSearchInput] = useState(
        studentsFilters.searchQuery ?? ""
    );
    const [selectedGender, setSelectedGender] = useState<string | undefined>(
        studentsFilters.gender
    );
    const [dobRange, setDobRange] = useState<
        [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
    >(() => {
        const from = studentsFilters.dobRange?.from
            ? dayjs(studentsFilters.dobRange.from)
            : null;
        const to = studentsFilters.dobRange?.to
            ? dayjs(studentsFilters.dobRange.to)
            : null;
        return from || to ? [from, to] : null;
    });
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setSearchInput(value);

            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }

            debounceTimeoutRef.current = setTimeout(() => {
                const trimmed = value.trim();
                if (trimmed) {
                    dispatch(
                        setStudentsFilters({
                            ...studentsFilters,
                            searchQuery: trimmed,
                        })
                    );
                } else {
                    dispatch(deleteStudentsFilterKey("searchQuery"));
                }
            }, 500);
        },
        [dispatch, studentsFilters]
    );

    const handleGenderChange = useCallback(
        (value?: string) => {
            setSelectedGender(value);
            if (value) {
                dispatch(
                    setStudentsFilters({
                        ...studentsFilters,
                        gender: value,
                    })
                );
            } else {
                dispatch(deleteStudentsFilterKey("gender"));
            }
        },
        [dispatch, studentsFilters]
    );

    const { data: studentsData, isLoading: isLoadingList } =
        useGetStudentsQuery(studentsFilters);
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
            const student: CreateStudentDto = {
                name: values.name as string,
                phone_number: (values.phone_number as string) || undefined,
                gender: (values.gender as string) || undefined,
                avatar_url: (values.avatar_url as string) || undefined,
                dob: dayjs.isDayjs(dob) ? dob.format("YYYY-MM-DD") : (dob as string),
                address: values.address as string,
                class: (values.class as string) || undefined,
                section: (values.section as string) || undefined,
                rollNumber: (values.rollNumber as string) || undefined,
                about: (values.about as string) || undefined,
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
        {
            title: "Class",
            dataIndex: "class",
            key: "class",
            width: 100,
            align: "center",
            render: (_, record) => <p>{record.class} {record.section}</p>,
        },
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
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Input
                        placeholder="Search by name or phone"
                        allowClear
                        value={searchInput}
                        onChange={handleSearch}
                        className="max-w-[250px] flex-1"
                    />
                    <Select
                        placeholder="Gender"
                        allowClear
                        options={GENDER_OPTIONS}
                        value={selectedGender}
                        onChange={handleGenderChange}
                        className="min-w-[160px]"
                    />
                </div>
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
                        <Text type="secondary">Roll number: {selectedStudent.rollNumber}</Text>
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
                                <Text type="secondary">Class</Text>
                                <Text>{selectedStudent.class} {selectedStudent.section}</Text>
                                <Text type="secondary">Roll number</Text>
                                <Text>{selectedStudent.rollNumber}</Text>
                                <Text type="secondary">Address</Text>
                                <Text>{selectedStudent.address}</Text>
                            </div>
                        </div>
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

                    <div className="mb-4">
                        <span className="text-sm font-medium text-gray-700 block mb-2">
                            Education
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2">
                            <Form.Item
                                name="class"
                                label="Class"
                                rules={[{ required: true, message: "Class is required" }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="section"
                                label="Section"
                                rules={[{ required: true, message: "Section is required" }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="rollNumber"
                                label="Roll number"
                                rules={[{ required: true, message: "Roll number is required" }]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    </div>

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
