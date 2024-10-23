import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => (
  <Result
    title="404"
    subTitle="Ничего не найдено"
    extra={
      <Button type="primary">
        <Link to="/" replace>
          Назад
        </Link>
      </Button>
    }
  />
);

export default NotFound;
