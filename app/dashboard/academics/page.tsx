"use client";

import { DashboardHeader } from "@/components/dashboard-header/dashboard-header";
import { AddSubject } from "./components/add-subject/add-subject";
import { CreateExamModal } from "./components/create-exam-modal/create-exam-modal";
import { useState } from "react";
import { useGetExamsQuery } from "@/lib/apis/exams.api";
import type { Exam } from "./types/exam.types";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Spin, Table } from "antd";
import { ClipboardList, Plus } from "lucide-react";
import { PrimaryButton } from "@/components/buttons/primary-button";

export default function AcademicsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { data: examsData, isLoading } = useGetExamsQuery();
  const exams: Exam[] = examsData?.data ?? [];

  const columns: ColumnsType<Exam> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span className="font-medium text-gray-800">{name}</span>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col md:px-8 pt-4 md:pt-6">
      <DashboardHeader
        title="Academics"
        description="Manage subjects and exams"
        showBackButton={false}
        bottomBorder={true}
      />
      <div className="overflow-auto pt-4 pb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Subjects</h2>
        <AddSubject />
      </div>
      <div className="flex-1 overflow-auto pt-4 pb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Exams</h2>
          <PrimaryButton
            key="create-exam"
            title="Create exam"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setCreateModalOpen(true)}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[320px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center py-16">
              <Spin size="large" />
            </div>
          ) : exams.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-gray-500">
              <ClipboardList className="w-16 h-16 text-gray-300 mb-4" strokeWidth={1.2} />
              <p className="text-center">
                No exams created yet. Create your first exam.
              </p>
            </div>
          ) : (
            <div className="p-4">
              <Table<Exam>
                rowKey="_id"
                columns={columns}
                dataSource={exams}
                pagination={false}
                className="shadow-none"
              />
            </div>
          )}
        </div>
      </div>
      <CreateExamModal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
