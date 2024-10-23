import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, Flex } from "antd";
import { Control } from "react-hook-form";
import { ConfigProperty } from "../types";
import RecursiveComponent from "./RecursiveConfig";
import React from "react";

interface ConfigProps {
  config: string;
  control: Control;
}

const Config = ({ config, control }: ConfigProps) => {
  
  const productConfig = (JSON.parse(config) as ConfigProperty).properties;

  return (
    <>
      {Object.entries(productConfig).map(([key, value]) => {
        return (
          <>
            <Collapse
              bordered={false}
              size="large"
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              items={[
                {
                  key: "1",
                  label: value._name,
                  children: (
                    <>
                      <h1>{value._name}</h1>
                      <Flex vertical>
                        {value.properties
                          ? Object.entries(value.properties).map(
                              ([nestedKey, value]) => (
                                <>
                                  <RecursiveComponent
                                    control={control}
                                    path={`${key}.${nestedKey}`}
                                    config={value}
                                  />{" "}
                                  <div className="componentBorder"></div>{" "}
                                </>
                              ),
                            )
                          : null}
                      </Flex>
                    </>
                  ),
                },
              ]}
            />
          </>
        );
      })}
    </>
  );
};

export default Config;
