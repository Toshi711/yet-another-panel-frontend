import { Flex, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import api from "../utils/api";
import { Product, ProductVersion } from "../types";
import React from "react";

interface Props {
  version: ProductVersion | null;
  modal: boolean;
  onSubmit: SubmitHandler<FieldValues>;
  setModal: Function;
}

const VersionModal = ({ modal, setModal, version, onSubmit }: Props) => {
  const { handleSubmit, control, reset } = useForm();

  React.useEffect(() => {
    if (version) {
      reset(version);
    }
  }, [modal]);

  return (
    <Modal
      title="Настройка"
      centered
      open={modal}
      onCancel={() => setModal(false)}
      onOk={handleSubmit(onSubmit)}
      okText="Сохранить"
      cancelText="Отменить"
    >
      <Flex vertical gap={20}>
        <Controller
          control={control}
          name="version"
          render={({ field: { onChange, value } }) => (
            <Input
              size="large"
              placeholder="Версия"
              onChange={onChange}
              value={value}
            />
          )}
        ></Controller>

        <Controller
          control={control}
          name="config"
          render={({ field: { onChange, value } }) => (
            <TextArea
              placeholder="Конфиг"
              style={{ height: 120, resize: "none" }}
              onChange={onChange}
              value={value}
            />
          )}
        ></Controller>
      </Flex>
    </Modal>
  );
};

export default VersionModal;
