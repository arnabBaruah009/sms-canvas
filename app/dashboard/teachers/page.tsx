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
            dataIndex: "avatar",
            key: "avatar",
            width: 80,
            render: (_, record) => (
                <Avatar
                    src={record.avatar}
                    icon={!record.avatar ? <UserOutlined /> : undefined}
                    alt={record.name}
                    className="bg-[var(--primary-color)]"
                />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (name) => <span className="font-medium">{name}</span>,
        },
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 100,
            render: (id) => <Text type="secondary">ID: {id}</Text>,
        },
        {
            title: "Year",
            dataIndex: "year",
            key: "year",
            width: 80,
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
            width: 100,
        },
        {
            title: "Subjects",
            dataIndex: "subjects",
            key: "subjects",
            width: 180,
            render: (subjects: string[]) =>
                subjects?.length ? (
                    <span className="text-sm">
                        {subjects.join(", ")}
                    </span>
                ) : (
                    "—"
                ),
        },
        {
            title: "Experience",
            dataIndex: "experience",
            key: "experience",
            width: 140,
            render: (experience: Teacher["experience"]) =>
                experience?.length ? (
                    <Text type="secondary">{experience.length} role(s)</Text>
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
                    rowKey="id"
                    columns={columns}
                    dataSource={teachers}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} teachers`,
                    }}
                    onRow={(record) => ({
                        onClick: () => setSelectedTeacherId(record.id),
                        style: { cursor: "pointer" },
                    })}
                    className="shadow-sm rounded-lg overflow-hidden"
                />
            </div>

            <Drawer
                title={
                    selectedTeacher ? (
                        <span className="font-semibold">{selectedTeacher.name}</span>
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
                        <Text type="secondary">ID: {selectedTeacher.id}</Text>
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
                                    src={selectedTeacher.avatar}
                                    icon={
                                        !selectedTeacher.avatar ? <UserOutlined /> : undefined
                                    }
                                    size={64}
                                    className="bg-[var(--primary-color)]"
                                />
                                <div>
                                    <Text strong className="text-base">
                                        {selectedTeacher.firstName} {selectedTeacher.lastName}
                                    </Text>
                                    {selectedTeacher.department && (
                                        <div className="text-sm text-gray-500">
                                            {selectedTeacher.department}
                                        </div>
                                    )}
                                    {selectedTeacher.subjects?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {selectedTeacher.subjects.map((sub) => (
                                                <Tag key={sub}>{sub}</Tag>
                                            ))}
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
                                <Text type="secondary">First name</Text>
                                <Text>{selectedTeacher.firstName}</Text>
                                <Text type="secondary">Last Name</Text>
                                <Text>{selectedTeacher.lastName}</Text>
                                <Text type="secondary">Year</Text>
                                <Text>{selectedTeacher.year}</Text>
                                <Text type="secondary">Gender</Text>
                                <Text>{selectedTeacher.gender}</Text>
                                {selectedTeacher.department && (
                                    <>
                                        <Text type="secondary">Department</Text>
                                        <Text>{selectedTeacher.department}</Text>
                                    </>
                                )}
                                {selectedTeacher.mobile && (
                                    <>
                                        <Text type="secondary">Mobile</Text>
                                        <Text>{selectedTeacher.mobile}</Text>
                                    </>
                                )}
                                {selectedTeacher.email && (
                                    <>
                                        <Text type="secondary">Email</Text>
                                        <Text>{selectedTeacher.email}</Text>
                                    </>
                                )}
                            </div>
                        </div>

                        {selectedTeacher.about && (
                            <div>
                                <Text strong className="block mb-2 text-gray-700">
                                    About
                                </Text>
                                <p className="text-sm text-gray-600">
                                    {selectedTeacher.about}
                                </p>
                            </div>
                        )}

                        {selectedTeacher.experience?.length > 0 && (
                            <div>
                                <Text strong className="block mb-2 text-gray-700">
                                    Experience
                                </Text>
                                <ul className="list-none p-0 m-0 space-y-2">
                                    {selectedTeacher.experience.map((entry, index) => (
                                        <li key={index} className="text-sm text-gray-600">
                                            <Text strong>
                                                {entry.yearFrom} - {entry.yearTo}:
                                            </Text>{" "}
                                            {entry.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {selectedTeacher.education?.length > 0 && (
                            <div>
                                <Text strong className="block mb-2 text-gray-700">
                                    Education
                                </Text>
                                <ul className="list-none p-0 m-0 space-y-2">
                                    {selectedTeacher.education.map((entry, index) => (
                                        <li key={index} className="text-sm text-gray-600">
                                            <Text strong>
                                                {entry.yearFrom} - {entry.yearTo}:
                                            </Text>{" "}
                                            {entry.description}
                                        </li>
                                    ))}
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
