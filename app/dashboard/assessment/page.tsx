"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header/dashboard-header";
import { useGetExamsQuery } from "@/lib/apis/exams.api";
import type { Exam } from "@/app/dashboard/academics/types/exam.types";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Spin, Table } from "antd";
import { ClipboardList } from "lucide-react";
import { SelectAssessmentModal } from "./components/select-assessment-modal/select-assessment-modal";

export default function AssessmentPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const { data: examsData, isLoading } = useGetExamsQuery();
  const exams: Exam[] = examsData?.data ?? [];

  const handleRowClick = (exam: Exam) => {
    setSelectedExam(exam);
    setModalOpen(true);
  };

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
        title="Assessment"
        description="Enter marks for exams"
        showBackButton={false}
        bottomBorder={true}
      />
      <div className="flex-1 overflow-auto pt-4 pb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Exams</h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[320px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center py-16">
              <Spin size="large" />
            </div>
          ) : exams.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-gray-500">
              <ClipboardList
                className="w-16 h-16 text-gray-300 mb-4"
                strokeWidth={1.2}
              />
              <p className="text-center">No exams available for assessment.</p>
            </div>
          ) : (
            <div className="p-4">
              <Table<Exam>
                rowKey="_id"
                columns={columns}
                dataSource={exams}
                pagination={false}
                className="shadow-none"
                onRow={(record) => ({
                  onClick: () => handleRowClick(record),
                  className: "cursor-pointer hover:bg-gray-50",
                })}
              />
            </div>
          )}
        </div>
      </div>
      <SelectAssessmentModal
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setSelectedExam(null);
        }}
        exam={selectedExam}
      />
    </div>
  );
}
