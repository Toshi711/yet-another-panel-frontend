import * as React from "react";
import { Button, Card } from "antd";
import { Radio, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import LicensesTable from "../components/LicensesTable";
import { License, User } from "../types";
import useProfile from "../store/useProfile";

const Home = () => {
  const licenses = useProfile((state) => state.licenses);

  return (
    <>
      <Card className="card">
        <h1>DSSYS </h1>
      </Card>

      <Card className="card">
        <LicensesTable source={licenses} />
      </Card>
    </>
  );
};

export default Home;
