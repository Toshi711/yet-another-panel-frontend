import { Flex, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Controller, useForm } from "react-hook-form";
import api from "../utils/api";
import { Product } from "../types";

interface Props {
  product: Product | null;
  modal: boolean;
  setModal: Function;
}

const CreateProductModal = ({ modal, setModal, product }: Props) => {
  const { handleSubmit, control } = useForm();

  const onSubmit = async (data: any) => {
    try {
      if (!product?.id) {
        throw new Error('Product ID is missing');
      }
      await api.createVersion({ ...data, productId: product.id });
      setModal(false);
    } catch (error) {
      console.error('Failed to create version:', error);
    }
  };

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

export default CreateProductModal;
