import * as React from "react";
import { Card } from "antd";
import LicensesTable from "../components/LicensesTable";
import { License, User } from "../types";
import useProfile from "../store/useProfile";

const Licenses = () => {
  const licenses = useProfile((state) => state.licenses);
  return (
    <>
      <Card className="card">
        <h1>Лицензии </h1>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis
          iusto quaerat rem unde obcaecati quod, rerum tempora quo amet
          consequatur!
        </p>
      </Card>

      <Card className="card">
        <LicensesTable source={licenses} />
      </Card>
    </>
  );
};

export default Licenses;
