"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header/dashboard-header";
import { PrimaryButton } from "@/components/buttons/primary-button";
import {
  useGetAssessmentQuery,
  useSubmitAssessmentMutation,
} from "@/lib/apis/assessment.api";
import type { AssessmentRow } from "../../types/assessment.types";
import { AssessmentTable } from "../../components/assessment-table/assessment-table";
import { toast } from "react-hot-toast";

export default function AssessmentEntryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const examId = params.examId as string;
  const subjectId = params.subjectId as string;
  const classParam = searchParams.get("class") ?? "";
  const sectionParam = searchParams.get("section") ?? "";

  const hasRequiredParams = Boolean(examId && subjectId && classParam && sectionParam);

  const { data, isLoading, isError, error } = useGetAssessmentQuery(
    {
      examId,
      subjectId,
      class: classParam,
      section: sectionParam,
    },
    { skip: !hasRequiredParams }
  );

  const [submitAssessment, { isLoading: isSubmitting }] =
    useSubmitAssessmentMutation();

  const [rows, setRows] = useState<AssessmentRow[]>([]);

  const initialRows = useMemo<AssessmentRow[]>(() => {
    if (!data) return [];
    return data.students.map((s) => ({
      ...s,
      passMark: data.passMark,
      maxMark: data.maxMark,
      marksObtained: 0,
      remarks: "",
    }));
  }, [data]);

  useEffect(() => {
    setRows([]);
  }, [examId, subjectId, classParam, sectionParam]);

  useEffect(() => {
    if (!isLoading && data && initialRows.length > 0) {
      setRows((prev) => (prev.length === 0 ? initialRows : prev));
    }
  }, [data, initialRows, isLoading]);

  const handleRowsChange = useCallback((newRows: AssessmentRow[]) => {
    setRows(newRows);
  }, []);

  const handleSubmit = async () => {
    const payload = {
      examId,
      subjectId,
      assessment: rows.map((r) => ({
        studentId: r._id,
        marksObtained: r.marksObtained,
        remarks: r.remarks,
      })),
    };
    try {
      await submitAssessment(payload).unwrap();
      toast.success("Assessment submitted");
      router.push("/dashboard/assessment");
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to submit assessment";
      toast.error(message);
    }
  };

  if (!hasRequiredParams) {
    return (
      <div className="w-full h-full flex flex-col md:px-8 pt-4 md:pt-6">
        <DashboardHeader
          title="Assessment entry"
          description="Missing class or section. Go back and select exam, subject, class and section."
          showBackButton={true}
          backText="Back to Assessment"
          backLink="/dashboard/assessment"
        />
      </div>
    );
  }

  if (isError) {
    const message =
      (error as { data?: { message?: string } })?.data?.message ??
      "Failed to load assessment";
    return (
      <div className="w-full h-full flex flex-col md:px-8 pt-4 md:pt-6">
        <DashboardHeader
          title="Assessment entry"
          description={message}
          showBackButton={true}
          backText="Back to Assessment"
          backLink="/dashboard/assessment"
        />
      </div>
    );
  }

  const displayRows = rows.length > 0 ? rows : initialRows;

  return (
    <div className="w-full h-full flex flex-col md:px-8 pt-4 md:pt-6">
      <DashboardHeader
        title="Assessment entry"
        description="Enter marks and remarks for each student"
        showBackButton={true}
        backText="Back to Assessment"
        backLink="/dashboard/assessment"
      />
      <div className="flex-1 overflow-auto pt-4 pb-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[320px] flex flex-col">
          <div className="p-4">
            <AssessmentTable
              rows={displayRows}
              loading={isLoading}
              onRowsChange={handleRowsChange}
            />
          </div>
          <div className="p-4 border-t border-gray-200 flex justify-end">
            <PrimaryButton
              title="Submit"
              type="primary"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={displayRows.length === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
