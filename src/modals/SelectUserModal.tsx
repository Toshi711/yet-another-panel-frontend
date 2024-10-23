import { UserOutlined } from "@ant-design/icons";
import { Avatar, Flex, Modal, Select, Space } from "antd";
import * as React from "react";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { User } from "../types";
import api from "../utils/api";

interface Props {
  modal: boolean;
  setModal: Function;
  onSubmit: SubmitHandler<FieldValues>;
}

const SelectUser = ({ modal, setModal, onSubmit }: Props) => {
  const { handleSubmit, control } = useForm();
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await api.getUsers();
        setUsers(result);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Modal
      centered
      open={modal}
      onCancel={() => setModal(false)}
      onOk={handleSubmit(onSubmit)}
      okText="Добавить"
      cancelText="Закрыть"
      title="Выберите пользователя"
    >
      <Flex vertical gap={20} style={{ paddingTop: "20px" }}>
        <Controller
          control={control}
          name="user"
          render={({ field: { onChange, value } }) => (
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Пользователи"
              options={users.map((user) => ({
                value: user.discordId,
                label: user.globalName,
                avatar: user.avatar,
              }))}
              value={value}
              onChange={onChange}
              optionRender={(option) => (
                <Space>
                  <Avatar
                    icon={<UserOutlined />}
                    src={
                      <img
                        src={`https://cdn.discordapp.com/avatars/${option.data?.value}/${option.data.avatar}`}
                      />
                    }
                  />
                  {option.data.label}
                  <p>{option.data.value}</p>
                </Space>
              )}
            />
          )}
        ></Controller>
      </Flex>
    </Modal>
  );
};

export default SelectUser;
