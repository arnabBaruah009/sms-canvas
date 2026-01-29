"use client";

import { useState } from "react";
import { Table, Drawer, Avatar, Spin, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useGetStudentsQuery, useGetStudentByIdQuery } from "@/lib/apis/students.api";
import type { Student } from "./types/student.types";
import { DashboardHeader } from "@/components/dashboard-header/dashboard-header";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function StudentsPage() {
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const { data: studentsData, isLoading: isLoadingList } = useGetStudentsQuery();
    const { data: studentData, isLoading: isLoadingStudent } =
        useGetStudentByIdQuery(selectedStudentId ?? "", {
            skip: !selectedStudentId,
        });

    const students = studentsData?.data ?? [];
    const selectedStudent = studentData?.data ?? null;

    const columns: ColumnsType<Student> = [
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
            width: 120,
            render: (id) => <Text type="secondary">ID: {id}</Text>,
        },
        {
            title: "Mobile",
            dataIndex: "mobile",
            key: "mobile",
            width: 140,
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
            width: 100,
        },
        {
            title: "DOB",
            dataIndex: "dob",
            key: "dob",
            width: 110,
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            ellipsis: true,
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
            />
            <div className="flex-1 overflow-auto pt-4 pb-6">
                <Table<Student>
                    rowKey="id"
                    columns={columns}
                    dataSource={students}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} students`,
                    }}
                    onRow={(record) => ({
                        onClick: () => setSelectedStudentId(record.id),
                        style: { cursor: "pointer" },
                    })}
                    className="shadow-sm rounded-lg overflow-hidden"
                />
            </div>

            <Drawer
                title={
                    selectedStudent ? (
                        <span className="font-semibold">{selectedStudent.name}</span>
                    ) : (
                        "Student Details"
                    )
                }
                placement="right"
                width={480}
                open={!!selectedStudentId}
                onClose={() => setSelectedStudentId(null)}
                extra={
                    selectedStudent && (
                        <Text type="secondary">ID: {selectedStudent.id}</Text>
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
                                    src={selectedStudent.avatar}
                                    icon={!selectedStudent.avatar ? <UserOutlined /> : undefined}
                                    size={64}
                                    className="bg-[var(--primary-color)]"
                                />
                                <div>
                                    <Text strong className="text-base">
                                        {selectedStudent.firstName} {selectedStudent.lastName}
                                    </Text>
                                    {selectedStudent.department && (
                                        <div className="text-sm text-gray-500">
                                            {selectedStudent.department}
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
                                <Text>{selectedStudent.firstName}</Text>
                                <Text type="secondary">Last Name</Text>
                                <Text>{selectedStudent.lastName}</Text>
                                {selectedStudent.department && (
                                    <>
                                        <Text type="secondary">Department</Text>
                                        <Text>{selectedStudent.department}</Text>
                                    </>
                                )}
                                <Text type="secondary">Mobile</Text>
                                <Text>{selectedStudent.mobile}</Text>
                                {selectedStudent.email && (
                                    <>
                                        <Text type="secondary">Email</Text>
                                        <Text>{selectedStudent.email}</Text>
                                    </>
                                )}
                                <Text type="secondary">Gender</Text>
                                <Text>{selectedStudent.gender}</Text>
                                <Text type="secondary">DOB</Text>
                                <Text>{selectedStudent.dob}</Text>
                                <Text type="secondary">Address</Text>
                                <Text className="col-span-2">{selectedStudent.address}</Text>
                            </div>
                        </div>

                        {selectedStudent.about && (
                            <div>
                                <Text strong className="block mb-2 text-gray-700">
                                    About Student
                                </Text>
                                <p className="text-sm text-gray-600">{selectedStudent.about}</p>
                            </div>
                        )}

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
                                            {entry.description}
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
        </div>
    );
}
