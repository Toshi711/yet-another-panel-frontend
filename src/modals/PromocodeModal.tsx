import React, { useState } from "react";
import { DatePicker, Flex, Input, Modal, Result, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import api from "../utils/api";
import { License } from "../types";
import { isAxiosError } from "axios";

interface Props {
  modal: boolean;
  setModal: (isOpen: boolean) => void;
}

const ActivateKeyModal: React.FC<Props> = ({ modal, setModal }) => {
  const [license, setLicense] = useState<License | null>(null)
  const [loading, setLoading] = useState(false);
  const { handleSubmit, control } = useForm();

  const onSubmit = async (data: any) => {

    
    setLoading(true);
    try {
      const result = await api.activateKey(data.key)
      setLicense(result)
      
      message.success("Key created successfully");
    } catch (error) {
      if(isAxiosError(error) && error.response?.status == 404){
        return message.error("Key does not exist");
      }

      console.error("Error creating key:", error);
      message.error("Failed to create key. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setModal(false);
    setLicense(null);
  };

  return (
    <Modal
      centered
      open={modal}
      onCancel={handleCancel}
      onOk={handleSubmit(onSubmit as any)}
      okText="Create"
      cancelText="Close"
      title="Активация ключа"
      okButtonProps={{ style: { display: license ? "none" : "inline" }, loading }}
      confirmLoading={loading}
    >
      <Flex vertical gap={20}>
        {license ? (
          <Result status="success" title="Ключ активирован" subTitle={license.product.title} />
        ) : (
          <Controller
            control={control}
            name="key"
            rules={{ required: "Please select an expiration date" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (<Input placeholder="Ключ" value={value} onChange={onChange}/>)}
          />
        )}
      </Flex>
    </Modal>
  );
};

export default ActivateKeyModal;
