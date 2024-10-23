import {
  KeyOutlined,
  ProductOutlined,
  SecurityScanOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Dropdown, Flex, Statistic } from "antd";
import { MenuProps } from "antd/lib";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import CreateKey from "../modals/CreateKeyModal";
import CreateLicense from "../modals/CreateLicenseModal";
import SelectUser from "../modals/SelectUserModal";
import useProfile from "../store/useProfile";
import { Product, User, UserRoles } from "../types";
import api from "../utils/api";
import ProductCard from "../components/Product";

const ProductUser = () => {
  const role = useProfile((state) => state.role);

  const [licenseModal, setLicenseModal] = React.useState(false);
  const [keyModal, setKeyModal] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [appointRole, setAppointRole] = React.useState<UserRoles>(
    UserRoles.ProductSupport,
  );
  const [products, setProducts] = React.useState<Product[] | null>(null);
  const [productId, setProductId] = React.useState<number | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetch() {
      const result = await api.getProducts();
      setProducts(result);
    }

    fetch();
  }, []);

  async function createProduct() {
    const data = await api.createProduct({
      title: "Черновик",
      description: "Черновик",
      version: "1.0.0",
      download: "",
    });

    navigate("/products/edit/" + data.id, { replace: true });
  }

  const onMenuClick: MenuProps["onClick"] = (e) => {
    const [action, id] = e.key.split(":");

    if (action == "delete") {
    } else if (action == "license") {
      setProductId(Number(id));
      setLicenseModal(true);
    } else if (action == "key") {
      setProductId(Number(id));
      setKeyModal(true);
    } else if (action == "admin") {
      setAppointRole(UserRoles.ProductAdmin);
      setModal(true);
    } else if (action == "support") {
      setAppointRole(UserRoles.ProductSupport);
      setModal(true);
    }
  };

  const appoint = async (data: any) => {
    setModal(false);

    for (let user of data.user) {
      await api.appointProduct(user, productId!, appointRole);
    }
  };

  return (
    <>
      <SelectUser modal={modal} setModal={setModal} onSubmit={appoint} />

      <CreateLicense
        modal={licenseModal}
        setModal={setLicenseModal}
        productId={productId}
      />

      <CreateKey
        modal={keyModal}
        setModal={setKeyModal}
        productId={productId}
      />

      {products ? (
        <Flex
          justify="space-around"
          align="center"
          style={{ margin: "20px 0" }}
        >
          <Statistic
            title="Продуктов"
            value={products.length}
            prefix={<ProductOutlined />}
          />
          <Statistic
            title="Лицензий"
            value={products.reduce((a, v) => (a = a + v.licenses.length), 0)}
            prefix={<SecurityScanOutlined />}
          />
        </Flex>
      ) : null}

      <Flex vertical gap={20}>
        {products?.map((product) => (
          <ProductCard product={product} onSubmit={onMenuClick} />
        ))}

        <Button size="large" onClick={() => createProduct()}>
          Создать продукт
        </Button>
      </Flex>
    </>
  );
};

export default ProductUser;
