import React, { useState } from "react";
import { DatePicker, Flex, Modal, Result, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import api from "../utils/api";

interface Props {
  productId: number | null;
  modal: boolean;
  setModal: (isOpen: boolean) => void;
}

const CreateKey: React.FC<Props> = ({ modal, setModal, productId }) => {
  const [key, setKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { handleSubmit, control, reset } = useForm();

  const onSubmit = async (data: { time: { $d: Date } }) => {
    if (!productId) {
      message.error("Product ID is missing");
      return;
    }

    setLoading(true);
    try {
      const result = await api.createKey(
        productId,
        data.time.$d.getTime()
      );
      setKey(result.key);
      message.success("Key created successfully");
    } catch (error) {
      console.error("Error creating key:", error);
      message.error("Failed to create key. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setModal(false);
    setKey(null);
    reset();
  };

  return (
    <Modal
      centered
      open={modal}
      onCancel={handleCancel}
      onOk={handleSubmit(onSubmit as any)}
      okText="Create"
      cancelText="Close"
      okButtonProps={{ style: { display: key ? "none" : "inline" }, loading }}
      confirmLoading={loading}
    >
      <Flex vertical gap={20}>
        {key ? (
          <Result status="success" title="New Key" subTitle={key} />
        ) : (
          <Controller
            control={control}
            name="time"
            rules={{ required: "Please select an expiration date" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DatePicker
                placeholder="Expiration date"
                showTime
                onChange={onChange}
                value={value}
                size="large"
                style={{ width: '100%' }}
                status={error ? "error" : ""}
              />
            )}
          />
        )}
      </Flex>
    </Modal>
  );
};

export default CreateKey;
