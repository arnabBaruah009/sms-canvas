"use client";

import { useState } from "react";
import { Table, Drawer, Avatar, Spin, Typography, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    useGetTeachersQuery,
    useGetTeacherByIdQuery,
} from "@/lib/apis/teachers.api";
import type { Teacher } from "./types/teacher.types";
import { DashboardHeader } from "@/components/dashboard-header/dashboard-header";
import { UserOutlined } from "@ant-design/icons";
import { genderLabels } from "../settings/profile-details/constants/profile.constant";
import dayjs from "dayjs";

const { Text } = Typography;

export default function TeachersPage() {
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
        null
    );
    const { data: teachersData, isLoading: isLoadingList } =
        useGetTeachersQuery();
    const { data: teacherData, isLoading: isLoadingTeacher } =
        useGetTeacherByIdQuery(selectedTeacherId ?? "", {
            skip: !selectedTeacherId,
        });

    const teachers = teachersData?.data ?? [];
    const selectedTeacher = teacherData?.data ?? null;

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
        {
            title: "Education",
            dataIndex: "education",
            key: "education",
            width: 120,
            render: (education: Teacher["education"]) =>
                education?.length ? (
                    <Text type="secondary">{education.length} entry(ies)</Text>
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
        </div>
    );
}
