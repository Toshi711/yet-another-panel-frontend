import React, { useState } from "react";
import { DatePicker, Flex, Input, Modal, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import api from "../utils/api";

interface Props {
  productId: number | null;
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}


const CreateLicense: React.FC<Props> = ({ modal, setModal, productId }) => {
  const { handleSubmit, control } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    if (!productId) {
      message.error("Product ID is missing");
      return;
    }

    setLoading(true);
    try {
      await api.createLicense({
        userId: data.discord,
        timeAmount: data.time.$d.getTime(),
        productId,
      });
      message.success("License created successfully");
      setModal(false);
    } catch (error) {
      console.error("Error creating license:", error);
      message.error("Failed to create license");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Новая лицензия"
      centered
      open={modal}
      onCancel={() => setModal(false)}
      onOk={handleSubmit(onSubmit)}
      okText="Создать"
      cancelText="Отменить"
    >
      <Flex vertical gap={20}>
        <Controller
          control={control}
          name="discord"
          render={({ field: { onChange, value } }) => (
            <Input
              size="large"
              placeholder="Discord ID пользователя"
              onChange={onChange}
              value={value}
            />
          )}
        ></Controller>

        <Controller
          control={control}
          name="time"
          render={({ field: { onChange, value } }) => (
            <DatePicker
              renderExtraFooter={() => "extra footer"}
              placeholder="Дата окончания"
              showTime
              onChange={onChange}
              value={value}
              size="large"
            />
          )}
        ></Controller>
      </Flex>
    </Modal>
  );
};

export default CreateLicense;
