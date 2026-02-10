"use client";

import { useState } from "react";
import { Input, Spin } from "antd";
import { Plus } from "lucide-react";
import { useGetSubjectsQuery, useCreateSubjectMutation } from "@/lib/apis/subjects.api";
import { PrimaryButton } from "@/components/buttons/primary-button";
import type { Subject } from "../../types/subject.types";
import { toast } from "react-hot-toast";

export function AddSubject() {
  const [subjectName, setSubjectName] = useState("");
  const { data: subjectsData, isLoading } = useGetSubjectsQuery();
  const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation();

  const subjects: Subject[] = subjectsData?.data ?? [];

  const handleAdd = async () => {
    const trimmed = subjectName.trim();
    if (!trimmed) return;
    try {
      await createSubject({ name: trimmed }).unwrap();
      toast.success("Subject added");
      setSubjectName("");
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to add subject";
      toast.error(message);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Subjects</h2>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Input
          placeholder="New subject name..."
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          onPressEnter={handleAdd}
          className="max-w-[320px] rounded-lg"
          disabled={isCreating}
        />
        <PrimaryButton
          title="Add"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleAdd}
          loading={isCreating}
          type="primary"
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Spin />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {subjects.map((subject) => (
            <span
              key={subject._id}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
            >
              {subject.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
