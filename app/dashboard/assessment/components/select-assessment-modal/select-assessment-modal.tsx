"use client";

import { useRouter } from "next/navigation";
import { Button, Modal, Form, Select } from "antd";
import { useGetSubjectsQuery } from "@/lib/apis/subjects.api";
import { PrimaryButton } from "@/components/buttons/primary-button";
import { CLASS_OPTIONS, SECTION_OPTIONS } from "../../constants/assessment.constants";
import type { Exam } from "@/app/dashboard/academics/types/exam.types";
import type { Subject } from "@/app/dashboard/academics/types/subject.types";
import { useMemo } from "react";

export interface SelectAssessmentFormValues {
  subjectId: string;
  class: string;
  section: string;
}

interface SelectAssessmentModalProps {
  open: boolean;
  onCancel: () => void;
  exam: Exam | null;
}

export function SelectAssessmentModal({
  open,
  onCancel,
  exam,
}: SelectAssessmentModalProps) {
  const [form] = Form.useForm<SelectAssessmentFormValues>();
  const router = useRouter();
  const { data: subjectsData } = useGetSubjectsQuery(undefined, { skip: !open });
  const subjects: Subject[] = subjectsData?.data ?? [];

  const subjectOptions = useMemo(
    () => subjects.map((s) => ({ value: s._id, label: s.name })),
    [subjects]
  );

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (!exam) return;
      const searchParams = new URLSearchParams({
        class: values.class,
        section: values.section,
      });
      const query = searchParams.toString();
      const path = `/dashboard/assessment/${exam._id}/${values.subjectId}${query ? `?${query}` : ""}`;
      router.push(path);
      form.resetFields();
      onCancel();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Select assessment details"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={400}
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
          name="subjectId"
          label="Subject"
          rules={[{ required: true, message: "Subject is required" }]}
        >
          <Select
            placeholder="Select subject"
            options={subjectOptions}
            className="w-full"
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="class"
          label="Class"
          rules={[{ required: true, message: "Class is required" }]}
        >
          <Select
            placeholder="Select class (1–10)"
            options={CLASS_OPTIONS}
            className="w-full"
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="section"
          label="Section"
          rules={[{ required: true, message: "Section is required" }]}
        >
          <Select
            placeholder="Select section (A–H)"
            options={SECTION_OPTIONS}
            className="w-full"
            allowClear
          />
        </Form.Item>
        <div className="flex justify-end gap-2 pt-4 border-t mt-6">
          <Button onClick={handleCancel}>Cancel</Button>
          <PrimaryButton
            title="Continue"
            type="primary"
            htmlType="submit"
          />
        </div>
      </Form>
    </Modal>
  );
}
