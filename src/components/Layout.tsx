import {
  DesktopOutlined,
  DownOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Divider, Dropdown, Flex, Layout, Menu, Space } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import useProfile from "../store/useProfile";
import React from "react";
import { MenuProps } from "antd/lib";
import api from "../utils/api";
import ActivateKeyModal from "../modals/PromocodeModal";

const { Header, Content } = Layout;

const profileItems: MenuProps['items'] = [
  {
    key: 'activate-key', // Изменено ключ для активации
    label: "Активировать ключ"
  },
  {
    key: 'logout',
    label: "Выйти"
  },
];

const App = (): JSX.Element => {
  const user = useProfile((state) => state.user);
  const logout = useProfile(state => state.logout)

  const navigate = useNavigate();

  const [items, setItems] = React.useState<MenuProps['items']>([
    {
      key: "/",
      label: `Главная`,
      icon: <HomeOutlined />,
    },
    {
      key: "faq",
      label: `FAQ`,
      icon: <InfoCircleOutlined />,
    },
  ])
  

  React.useEffect(() => {

    const fetch = async () => {
      const products = await api.getProducts()
      console.log(products)
      if (products.length > 0){
        console.log('yey')
        setItems([...items!, {
          key: "products",
          label: "Администрирование",
          icon: <DesktopOutlined />
        }])
      }
    }

    fetch()
  }, [])

  const login = () => {
    window.open("http://localhost:3000/auth/login", "_self");
  };

  const [isModalOpen, setIsModalOpen] = React.useState(false); // Состояние для модального окна

  const profile = async (e: any) => {
    if(e.key == 'logout'){
      await api.logout()
      logout()
      navigate('/', {replace: true})
    } else if (e.key === 'activate-key') { // Открываем модальное окно
      setIsModalOpen(true);
    }
  }

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="wrapper">
          <div className="demo-logo" />
          <Menu
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={items}
            style={{ flex: 1, minWidth: 0 }}
            onClick={(e) => navigate(e.key)}
          />

          <div>
            {user ? (
              <>
                <Flex gap={10} align="center">
                  {user.avatar ? (
                    <Avatar
                      icon={<UserOutlined />}
                      src={
                        <img
                          src={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}`}
                        />
                      }
                    />
                  ) : (
                    <Avatar icon={<UserOutlined />} />
                  )}

                  <Dropdown
                    menu={{ items: profileItems, onClick: profile }}
                    arrow={false}
                  >
                    <a onClick={() => navigate("user/" + user?.id)}>
                      <Space>
                        {user.username}
                      </Space>
                    </a>
                  </Dropdown>
                </Flex>
                
              </>
            ) : (
              <Button onClick={login}>Войти</Button>
            )}
          </div>
        </div>
      </Header>
      <Content className="content">
        <div>
          <Outlet />
        </div>
        <ActivateKeyModal modal={isModalOpen} setModal={setIsModalOpen} /> {/* Добавляем модальное окно */}
      </Content>
    </Layout>
  );
};

export default App;
