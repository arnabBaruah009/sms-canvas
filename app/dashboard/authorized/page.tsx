"use client";

import { useState } from "react";
import {
  Table,
  Spin,
  Modal,
  Form,
  Input,
  Button,
  Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  useGetAllowListQuery,
  useCreateAllowListMutation,
  useDeleteAllowListMutation,
} from "@/lib/apis/allow-list.api";
import type { AllowList, AllowListCreatedBy } from "./types/allow-list.types";
import { DashboardHeader } from "@/components/dashboard-header/dashboard-header";
import { PrimaryButton } from "@/components/buttons/primary-button";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";

export default function AuthorizedPage() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { data: allowListData, isLoading: isLoadingList } =
    useGetAllowListQuery();
  const [createAllowList, { isLoading: isCreating }] =
    useCreateAllowListMutation();
  const [deleteAllowList, { isLoading: isDeleting }] =
    useDeleteAllowListMutation();

  const items = allowListData?.data ?? [];

  const openAddModal = () => {
    form.resetFields();
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    form.resetFields();
  };

  const handleAdd = async (values: { phone: string }) => {
    try {
      await createAllowList({ allowList: { phone: values.phone } }).unwrap();
      toast.success("Phone number added to allow list");
      closeAddModal();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to add phone number";
      toast.error(message);
    }
  };

  const columns: ColumnsType<AllowList> = [
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => (
        <span className="font-medium">{phone}</span>
      ),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (_, record) => {
        return (<div>
          <p>{record.createdBy.name}</p>
          <p>{record.createdBy.phone_number}</p>
        </div>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (createdAt: string) => dayjs(createdAt).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <Popconfirm
          title="Remove from allow list"
          description="Are you sure you want to remove this phone number?"
          onConfirm={() => {
            deleteAllowList(record._id)
              .unwrap()
              .then(() => toast.success("Removed from allow list"))
              .catch((err: { data?: { message?: string } }) =>
                toast.error(err?.data?.message ?? "Failed to remove")
              );
          }}
          okText="Remove"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={isDeleting}
            aria-label="Remove from allow list"
          />
        </Popconfirm>
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
        title="Authorized"
        description="Manage phone numbers allowed to access the system"
        showBackButton={false}
        bottomBorder={true}
        buttons={[
          <PrimaryButton
            key="add-authorized"
            title="Add phone number"
            icon={<PlusOutlined />}
            onClick={openAddModal}
          />,
        ]}
      />
      <div className="flex-1 overflow-auto pt-4 pb-6">
        <Table<AllowList>
          rowKey="_id"
          columns={columns}
          dataSource={items}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} entries`,
          }}
          className="shadow-sm rounded-lg overflow-hidden"
        />
      </div>

      <Modal
        title="Add phone number"
        open={addModalOpen}
        onCancel={closeAddModal}
        footer={null}
        width={400}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          className="pt-2"
        >
          <Form.Item
            name="phone"
            label="Phone number"
            rules={[
              {
                required: true,
                message: "Phone number is required",
              },
              {
                pattern:
                  /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
                message: "Enter a valid phone number",
              },
            ]}
          >
            <Input placeholder="e.g. 1234567890" />
          </Form.Item>
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={closeAddModal}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating}
              className="bg-[var(--primary-color)] hover:!bg-[var(--primary-color)]/90"
            >
              Submit
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
