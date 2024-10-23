import React, { useState } from "react";
import { Button, Table, Tag, Modal, Flex } from "antd";
import { Link } from "react-router-dom";
import { License } from "../types";
import type { TableProps } from "antd";
import api from "../utils/api";

type ColumnsType<T extends object> = TableProps<T>["columns"];

interface DataType {
  key: string;
  license: string;
  product: string;
  expires: string;
  status: string[];
}

interface Props {
  source: License[] | null;
}

const LicensesTable: React.FC<Props> = ({ source }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentLicenseId, setCurrentLicenseId] = useState<string | null>(null);

  const showModal = (licenseId: string) => {
    setCurrentLicenseId(licenseId);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (currentLicenseId) {
      try {
        //await api.clearHWID(currentLicenseId);
        // Здесь можно добавить обновление данных таблицы, если необходимо
        setIsModalVisible(false);
      } catch (error) {
        console.error("Error clearing HWID:", error);
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "License",
      dataIndex: "license",
      key: "license",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Expires at",
      key: "expires",
      dataIndex: "expires",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (tags: string[]) => (
        <span>
          {tags.map((tag) => {
            return <Tag key={tag}>{tag.toUpperCase()}</Tag>;
          })}
        </span>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => {
        return (
          <Flex gap={5}>
            <Button type="primary" size="small" style={{ marginRight: '8px' }}>
              <Link replace to={`/products/config/${record.key}`}>
                Настройки
              </Link>
            </Button>
            <Button size="small" onClick={() => showModal(record.key)}>
              HWID
            </Button>
          </Flex>
        );
      },
    },
  ];

  const formatter = new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "full",
    timeStyle: "long",
  });

  const data = source?.map((license) => ({
    key: String(license.id),
    license: license.key,
    product: license.product.title,
    expires: formatter.format(new Date(license.timeAmount)),
    status: [license.timeAmount > Date.now() ? "Активен" : "Истек"],
  })) as DataType[];

  return (
    <>
      <Table
        columns={columns}
        pagination={{ position: ["bottomLeft"] }}
        dataSource={data}
      />
      <Modal
        title="Подтверждение очистки HWID"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Вы уверены, что хотите очистить HWID для этой лицензии?</p>
      </Modal>
    </>
  );
};

export default LicensesTable;
