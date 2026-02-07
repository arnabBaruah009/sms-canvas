"use client";

import { useState, useEffect } from "react";
import { Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUploadImageMutation } from "@/lib/apis/upload.api";
import { toast } from "react-hot-toast";

interface UploadImageProps {
  value?: string;
  onChange?: (url: string) => void;
  disabled?: boolean;
  maxSizeMB?: number;
  accept?: string;
  listType?: "picture-card" | "picture-circle";
}

export function UploadImage({
  value,
  onChange,
  disabled = false,
  maxSizeMB = 5,
  accept = "image/*",
  listType = "picture-card",
}: UploadImageProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadImage, { isLoading }] = useUploadImageMutation();

  // Sync fileList with value prop when value changes externally
  useEffect(() => {
    if (value) {
      setFileList((prev) => {
        // Only update if the value is different from current fileList
        const currentUrl = prev[0]?.url;
        if (currentUrl !== value) {
          return [
            {
              uid: "-1",
              name: "image",
              status: "done",
              url: value,
            },
          ];
        }
        return prev;
      });
    } else {
      // Clear fileList if value is cleared and we don't have an active upload
      setFileList((prev) => {
        if (
          prev.length > 0 &&
          prev[0]?.status === "done" &&
          !prev[0]?.response
        ) {
          return [];
        }
        return prev;
      });
    }
  }, [value]);

  const handleChange: UploadProps["onChange"] = (info) => {
    let newFileList = [...info.fileList];

    // Only keep the latest file
    newFileList = newFileList.slice(-1);

    // Read from response and show file link
    newFileList = newFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.data?.url;
      }
      return file;
    });

    setFileList(newFileList);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }

    const isLtMaxSize = file.size / 1024 / 1024 < maxSizeMB;
    if (!isLtMaxSize) {
      toast.error(`Image must be smaller than ${maxSizeMB}MB!`);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const customRequest: UploadProps["customRequest"] = async (options) => {
    const { onSuccess, onError, file } = options;

    try {
      const formData = new FormData();
      formData.append("file", file as File);

      const response = await uploadImage(formData).unwrap();

      if (response.url) {
        onChange?.(response.url);
        onSuccess?.(response, file as any);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("No URL returned from server");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Upload failed";
      toast.error(errorMessage);
      onError?.(error);
    }
  };

  const handleRemove = () => {
    setFileList([]);
    onChange?.("");
  };

  return (
    <Upload
      fileList={fileList}
      onChange={handleChange}
      beforeUpload={beforeUpload}
      customRequest={customRequest}
      onRemove={handleRemove}
      maxCount={1}
      accept={accept}
      disabled={disabled || isLoading}
      listType={listType}
    >
      {fileList.length === 0 && (
        <div>
          <UploadOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      )}
    </Upload>
  );
}
