"use client";

import { useState, useMemo } from "react";
import { Modal, Form, Input, DatePicker, Select, InputNumber, Button } from "antd";
import { Trash2 } from "lucide-react";
import { useGetSubjectsQuery } from "@/lib/apis/subjects.api";
import { useCreateExamMutation } from "@/lib/apis/exams.api";
import { PrimaryButton } from "@/components/buttons/primary-button";
import type { CreateExamDto, ExamSubjectInputDto } from "../../types/exam.types";
import type { Subject } from "@/app/dashboard/academics/types/subject.types";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";

export interface ExamSubjectRow {
  subjectId: string;
  subjectName: string;
  passMark: number;
  maxMark: number;
}

interface CreateExamModalProps {
  open: boolean;
  onCancel: () => void;
}

export function CreateExamModal({ open, onCancel }: CreateExamModalProps) {
  const [form] = Form.useForm();
  const [subjectRows, setSubjectRows] = useState<ExamSubjectRow[]>([]);
  const [subjectSelectValue, setSubjectSelectValue] = useState<string | null>(null);
  const { data: subjectsData } = useGetSubjectsQuery(undefined, { skip: !open });
  const [createExam, { isLoading: isCreating }] = useCreateExamMutation();

  const subjects: Subject[] = subjectsData?.data ?? [];
  const subjectOptions = useMemo(
    () =>
      subjects.map((s) => ({ value: s._id, label: s.name })),
    [subjects]
  );
  const addedSubjectIds = useMemo(
    () => new Set(subjectRows.map((r) => r.subjectId)),
    [subjectRows]
  );
  const availableOptions = useMemo(
    () => subjectOptions.filter((o) => !addedSubjectIds.has(o.value)),
    [subjectOptions, addedSubjectIds]
  );

  const handleAddSubject = (subjectId: string) => {
    const subject = subjects.find((s) => s._id === subjectId);
    if (!subject) return;
    setSubjectRows((prev) => [
      ...prev,
      { subjectId, subjectName: subject.name, passMark: 40, maxMark: 100 },
    ]);
    setSubjectSelectValue(null);
  };

  const handleRemoveSubject = (subjectId: string) => {
    setSubjectRows((prev) => prev.filter((r) => r.subjectId !== subjectId));
  };

  const handleRowChange = (subjectId: string, field: "passMark" | "maxMark", value: number) => {
    setSubjectRows((prev) =>
      prev.map((r) =>
        r.subjectId === subjectId ? { ...r, [field]: value } : r
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (subjectRows.length === 0) {
        toast.error("Add at least one subject");
        return;
      }
      const exam: CreateExamDto = {
        name: values.name,
        startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
        subjects: subjectRows.map(
          (r): ExamSubjectInputDto => ({
            subjectId: r.subjectId,
            passMark: r.passMark,
            maxMark: r.maxMark,
          })
        ),
      };
      await createExam(exam).unwrap();
      toast.success("Exam created");
      form.resetFields();
      setSubjectRows([]);
      setSubjectSelectValue(null);
      onCancel();
    } catch (err: unknown) {
      if ((err as { errorFields?: unknown[] })?.errorFields) return;
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to create exam";
      toast.error(message);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSubjectRows([]);
    setSubjectSelectValue(null);
    onCancel();
  };

  return (
    <Modal
      title="Create New Exam"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={560}
      destroyOnHidden
      closable
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="pt-2"
      >
        <Form.Item
          name="name"
          label="Exam Name"
          rules={[{ required: true, message: "Exam name is required" }]}
        >
          <Input placeholder="e.g. Mid-Term Examination" />
        </Form.Item>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "Start date is required" }]}
          >
            <DatePicker className="w-full" format="YYYY-MM-DD" placeholder="Pick date" />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "End date is required" }]}
          >
            <DatePicker className="w-full" format="YYYY-MM-DD" placeholder="Pick date" />
          </Form.Item>
        </div>

        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700 block mb-2">
            Subjects
          </span>
          <Select
            placeholder="Add a subject..."
            options={availableOptions}
            onSelect={handleAddSubject}
            value={subjectSelectValue}
            onChange={setSubjectSelectValue}
            className="w-full"
            allowClear
            suffixIcon={<span className="text-gray-400">▼</span>}
          />
          <div className="mt-3 space-y-3">
            {subjectRows.map((row) => (
              <div
                key={row.subjectId}
                className="flex flex-wrap items-center gap-2 py-2 border-b border-gray-100 last:border-0"
              >
                <span className="font-medium text-gray-800 min-w-[100px]">
                  {row.subjectName}
                </span>
                <InputNumber
                  min={0}
                  value={row.passMark}
                  onChange={(v) => handleRowChange(row.subjectId, "passMark", v ?? 0)}
                  className="w-20"
                />
                <span className="text-gray-400">/</span>
                <InputNumber
                  min={0}
                  value={row.maxMark}
                  onChange={(v) => handleRowChange(row.subjectId, "maxMark", v ?? 0)}
                  className="w-20"
                />
                <Button
                  type="text"
                  danger
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => handleRemoveSubject(row.subjectId)}
                  aria-label="Remove subject"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t mt-6">
          <Button onClick={handleCancel}>Cancel</Button>
          <PrimaryButton
            title="Create Exam"
            type="primary"
            htmlType="submit"
            loading={isCreating}
          />
        </div>
      </Form>
    </Modal>
  );
}
