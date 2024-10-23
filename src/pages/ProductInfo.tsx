import React, { useState, useEffect, useCallback } from "react";
import { CodeOutlined, DatabaseOutlined, MutedOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, Select, Statistic, Table, Tag, message, Tabs, Divider, Collapse } from "antd";
import { Link, useParams } from "react-router-dom";
import useProfile from "../store/useProfile";
import { KeysDataType, License, LicensesDataType, Product, Promo, TableRowSelection, User } from "../types";
import api from "../utils/api";


const UsersColumns = [
  {
    title: "User",
    dataIndex: "user",
    render: (user: User) => (
       <Flex gap={20} align="center">
          <Link to={`/user/${user.discordId}`} replace>
          <Flex align="center" gap={15}>
            <Avatar
              icon={<UserOutlined />}
              src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}`}
            />
            {user.globalName}
          </Flex>
          </Link>

          <Button danger type="primary">Снять</Button>

        </Flex>
    ),
  },

];

const LicensesColumns = [
  {
    title: "User",
    dataIndex: "user",
    render: (user: User) => (
      <Link to={`/user/${user.discordId}`} replace>
        <Flex align="center" gap={15}>
          <Avatar
            icon={<UserOutlined />}
            src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}`}
          />
          {user.globalName}
        </Flex>
      </Link>
    ),
  },
  { title: "Expires", dataIndex: "expiresAt" },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (tags: string[] | null) => (
      <>
        {tags ? tags.map((tag) => (
          <Tag key={tag} color={tag === 'ACTIVE' ? 'green' : 'red'}>
            {tag}
          </Tag>
        )) : null}
      </>
    ),
  }
];

const KeysColumns = [
  { title: "Key", dataIndex: "promo" },
  { title: "Expires", dataIndex: "expiresAt" },
];

const ProductItem: React.FC = () => {
  const { user } = useProfile();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<"license" | "key">("license");
  const [licenses, setLicenses] = useState<License[]>([]);
  const [keys, setKeys] = useState<Promo[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [supports, setSupports] = useState<User[]>([]);

  const formatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [productResult, licensesResult, keysResult] = await Promise.all([
        api.getProduct(Number(id)),
        api.getLicensesByProductId(Number(id)),
        api.getKeysByProductId(Number(id))
      ]);

      setProduct(productResult);
      setLicenses(licensesResult);
      setKeys(keysResult);
      
      if(licensesResult){
        setAllUsers(licensesResult.map((license: License) => license.user));
      }
      setAdmins(productResult.admins);
      setSupports(productResult.supports);

    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load product data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleChange = (value: string) => {
    setPage(value as "license" | "key");
  };

  const deleteEntity = async () => {
    try {
      setLoading(true);

      if (page == 'key'){
        for (let key of selectedRowKeys){
          await api.deleteKey(Number(id), Number(key))
        }
      }
      else{
        for (let license of selectedRowKeys){
          console.log(license)
          await api.deleteLicense(Number(id), Number(license))
        }
      }

      message.success("Entities deleted successfully");
      setSelectedRowKeys([]);
      await fetchData(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting entities:", error);
      message.error("Failed to delete entities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="card">
      <Flex vertical gap={20}>
        <Flex justify="space-between">
          <Flex vertical gap={0}>
            <h1>{product?.title}</h1>
            <h3>{product?.description}</h3>
            <p>Current version: {product?.versions[0]?.version}</p>
          </Flex>
        </Flex>


        <Flex gap={30}>
          <Statistic
            title="Licenses"
            value={product?.licenses?.length}
            prefix={<DatabaseOutlined style={{ fontSize: 24 }} />}
          />
          <Statistic
            title="Admins"
            value={product?.admins?.length}
            prefix={<CodeOutlined style={{ fontSize: 24 }} />}
          />
          <Statistic
            title="Support"
            value={product?.supports?.length}
            prefix={<MutedOutlined style={{ fontSize: 24 }} />}
          />
        </Flex>

        <Flex gap={10} align="center">
          <Button type="primary" size="middle">Выдать лицензию</Button>
          <Button size="middle" >Создать ключ</Button>
        </Flex>

         <Collapse bordered={false}>
          <Collapse.Panel key='1' header="Пользователи">
            <Flex vertical gap='middle'>
              <Flex gap={10} align='center'>
                <Button
                  type="primary"
                  size="middle"
                  danger
                  disabled={selectedRowKeys.length === 0}
                  loading={loading}
                  onClick={deleteEntity}
                >
                  Delete
                </Button>
              </Flex>

              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Лицензии" key="1">
                  <Table
                    loading={loading}
                    rowSelection={rowSelection}
                    columns={LicensesColumns}
                    dataSource={ licenses.map((license) => ({
                            key: license.id,
                            user: license.user,
                            expiresAt: formatter.format(new Date(license.timeAmount)),
                            status: [Date.now() > license.timeAmount ? 'EXPIRED' : 'ACTIVE'],
                      }))
                    }
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Ключи" key="2">
                <Table
                  loading={loading}
                  rowSelection={rowSelection}
                  columns={KeysColumns}
                  dataSource={keys.map((key) => ({
                          key: key.id,
                          promo: key.key,
                          expiresAt: formatter.format(new Date(key.timeAmount)),
                        }))
                  }
                />
                </Tabs.TabPane>
                </Tabs>
            </Flex>
          </Collapse.Panel>
          
        </Collapse>

        <Collapse bordered={false}>
          <Collapse.Panel key='1' header="Пользователи">
            <Flex vertical gap='middle'>
              <Flex gap={10} align='center'>
                  <Button type="primary" size="middle">Назначить администратора</Button>
                  <Button type="primary" size="middle">Назначить саппорта</Button>
              </Flex>

              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="All Users" key="1">
                  <Table
                    dataSource={allUsers.map(user => ({
                      key: user.discordId,
                      user: user,
                      // Add other necessary fields
                    }))}
                    columns={UsersColumns} // Use the same columns for user display
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Administrators" key="2">
                  <Table
                    dataSource={admins.map(user => ({
                      key: user.discordId,
                      user: user,
                      // Add other necessary fields
                    }))}
                    columns={UsersColumns}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Support Staff" key="3">
                  <Table
                    dataSource={supports.map(user => ({
                      key: user.discordId,
                      user: user,
                    }))}
                    columns={UsersColumns}
                  />
                </Tabs.TabPane>
              </Tabs>
            </Flex>
          </Collapse.Panel>
          
        </Collapse>
      </Flex>
    </Card>
  );
};

export default ProductItem;
