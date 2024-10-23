import React, { useState, useEffect, useCallback } from "react";
import { Avatar, Card, Flex, Select, message, Spin } from "antd";
import LicensesTable from "../components/LicensesTable";
import { UserOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { License, User, UserRoles } from "../types";

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [userLicenses, setLicenses] = useState<License[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    if (!id) {
      navigate('/404');
      return;
    }

    try {
      setLoading(true);
      const fetchedUser = await api.getUser(id);
      if (!fetchedUser) {
        navigate('/404');
        return;
      }

      setUser(fetchedUser);
      const licenses = await api.getLicenses(fetchedUser.discordId);
      setLicenses(licenses);
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("Failed to load user data. Please try again.");
      navigate('/404');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleChange = async (value: string) => {
    if (!user) return;

    try {
      await api.appointUser(user.discordId, value as UserRoles);
      message.success("User role updated successfully");
      // Optionally, you can refetch the user data here to update the UI
      await fetchUserData();
    } catch (error) {
      console.error("Error updating user role:", error);
      message.error("Failed to update user role. Please try again.");
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!user) {
    return null; // This will be handled by the navigation to 404 page
  }

  return (
    <>
      <Card className="card">
        <Flex gap={12} align="center">
          <Avatar
            size={128}
            icon={<UserOutlined />}
            src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}` : undefined}
          />
          <div>
            <h1>{user.globalName}</h1>
            <p>{user.role}</p>
            {user.role === UserRoles.Developer && (
              <Flex gap={10} vertical style={{ marginTop: "20px" }}>
                <Select
                  style={{ textAlign: "center" }}
                  defaultValue={user.role}
                  options={[
                    { value: UserRoles.User, label: "User" },
                    { value: UserRoles.SystemAdmin, label: "Admin" },
                    { value: UserRoles.SystemSupport, label: "Support" },
                  ]}
                  onChange={handleChange}
                />
              </Flex>
            )}
          </div>
        </Flex>
      </Card>
      <Card>
        <LicensesTable source={userLicenses} />
      </Card>
    </>
  );
};

export default Profile;
