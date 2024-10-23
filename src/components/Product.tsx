import {
  KeyOutlined,
  MoreOutlined,
  ProductOutlined,
  SecurityScanOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Dropdown, Flex, Statistic } from "antd";
import { useNavigate } from "react-router-dom";
import { Product, User } from "../types";
import React from "react";
import api from "../utils/api";

interface ProductProps {
  product: Product;
  onSubmit: any;
}

const ProductCard = ({ product, onSubmit }: ProductProps) => {
  const items = [
    {
      key: `license:${product.id}`,
      label: "Выдать лицензию",
      icon: <UserAddOutlined />,
    },
    {
      key: `key:${product.id}`,
      label: "Создать ключ активации",
      icon: <KeyOutlined />,
    },
  ];

  const navigate = useNavigate();

  return (
    <Card className="card">
      <Flex justify="space-between">
        <Flex vertical gap={15}>
          <div className="text">
            <h1>
              <a
                onClick={() =>
                  navigate("/products/" + product.id, { replace: true })
                }
              >
                {" "}
                {product?.title}
              </a>
            </h1>
            <p>{product?.description}</p>
          </div>

          <Flex gap={15}>
            <Statistic
              title="Лицензий"
              value={product.licenses.length}
              prefix={<ProductOutlined />}
            />
            <Statistic
              title="Версий"
              value={product.versions.length}
              prefix={<SecurityScanOutlined />}
            />
          </Flex>

          <Flex gap={15}>
            <Button
              type="primary"
              onClick={() =>
                navigate(`/products/${product.id}`, { replace: true })
              }
            >
              Подробнее
            </Button>
            <Button
              type="default"
              onClick={() =>
                navigate(`/products/edit/${product.id}`, { replace: true })
              }
            >
              Редактировать
            </Button>
          </Flex>
        </Flex>

        <Dropdown menu={{ items, onClick: onSubmit }} placement="bottomRight">
          <Button type="text" size="large">
            <MoreOutlined />
          </Button>
        </Dropdown>
      </Flex>
    </Card>
  );
};

export default ProductCard;
