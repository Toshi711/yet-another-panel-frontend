import { Flex } from "antd";
import { Control } from "react-hook-form";
import { ComponentType, Property } from "../types";
import ConfigComponent from "./ConfigComponent";
import React from "react";

interface RecursiveProps {
  config: Property;
  control: Control;
  path: string;
}

const RecursiveConfig = ({ config, control, path }: RecursiveProps) => {
  return (
    <div className="component" style={{ flexGrow: config?._grow ? 1 : 0 }}>
      {config.properties ? (
        config._name ? (
          <h4 style={{ borderColor: "white" }}>{config._name}</h4>
        ) : null
      ) : null}

      {config.properties ? (
        config._description ? (
          <p className="componentDescription">{config._description}</p>
        ) : null
      ) : null}

      {config._component ? (
        <ConfigComponent component={config} control={control} path={path} />
      ) : null}

      {config?.properties ? (
        <>
          <Flex
            gap={15}
            justify="space-between"
            align="center"
            vertical={config._component != ComponentType.Flex}
          >
            {Object.entries(config.properties).map(([key, value]) => {
              return (
                <>
                  <RecursiveConfig
                    control={control}
                    config={value}
                    path={`${path}.${key}`}
                  />
                </>
              );
            })}
          </Flex>
        </>
      ) : null}
    </div>
  );
};

export default RecursiveConfig;
