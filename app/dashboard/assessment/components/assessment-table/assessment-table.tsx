"use client";

import { useCallback, useMemo, useState } from "react";
import { Table, InputNumber, Input, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { AssessmentRow } from "../../types/assessment.types";

interface AssessmentTableProps {
  rows: AssessmentRow[];
  loading?: boolean;
  onRowsChange: (rows: AssessmentRow[]) => void;
}

export function AssessmentTable({
  rows,
  loading,
  onRowsChange,
}: AssessmentTableProps) {
  const handleMarksChange = useCallback(
    (studentId: string, value: number | null) => {
      onRowsChange(
        rows.map((r) =>
          r._id === studentId
            ? { ...r, marksObtained: value ?? 0 }
            : r
        )
      );
    },
    [rows, onRowsChange]
  );

  const handleRemarksChange = useCallback(
    (studentId: string, value: string) => {
      onRowsChange(
        rows.map((r) =>
          r._id === studentId ? { ...r, remarks: value } : r
        )
      );
    },
    [rows, onRowsChange]
  );

  const columns: ColumnsType<AssessmentRow> = useMemo(
    () => [
      {
        title: "Roll Number",
        dataIndex: "rollNumber",
        key: "rollNumber",
        width: 120,
        render: (val: number) => (
          <span className="font-medium text-gray-800">{val}</span>
        ),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (val: string) => (
          <span className="text-gray-800">{val}</span>
        ),
      },
      {
        title: "Enter Mark",
        dataIndex: "marksObtained",
        key: "marksObtained",
        width: 140,
        render: (_, record) => (
          <InputNumber
            min={0}
            max={record.maxMark}
            value={record.marksObtained}
            onChange={(v) => handleMarksChange(record._id, v)}
            className="w-full"
            placeholder="Marks"
          />
        ),
      },
      {
        title: "Pass Mark",
        dataIndex: "passMark",
        key: "passMark",
        width: 150,
        align: "center",
        render: (val: number) => (
          <span className="text-gray-600">{val}</span>
        ),
      },
      {
        title: "Max Mark",
        dataIndex: "maxMark",
        key: "maxMark",
        width: 150,
        align: "center",
        render: (val: number) => (
          <span className="text-gray-600">{val}</span>
        ),
      },
      {
        title: "Remark",
        dataIndex: "remarks",
        key: "remarks",
        render: (_, record) => (
          <Input
            value={record.remarks}
            onChange={(e) => handleRemarksChange(record._id, e.target.value)}
            placeholder="Remarks"
            allowClear
          />
        ),
      },
    ],
    [handleMarksChange, handleRemarksChange]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Table<AssessmentRow>
      rowKey="_id"
      columns={columns}
      dataSource={rows}
      pagination={false}
      className="shadow-none"
      scroll={{ x: "max-content" }}
    />
  );
}
