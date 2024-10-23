import { CloseCircleFilled } from "@ant-design/icons";
import { Button, Collapse } from "antd";
import { Control, useFieldArray } from "react-hook-form";
import { Property } from "../types";
import RecursiveConfig from "./RecursiveConfig";
import React from "react";

const { Panel } = Collapse;
interface ComponentProps {
  component: Property;
  control: Control;
  path: string;
}

const ArrayComponent = ({ component, control, path }: ComponentProps) => {

  const { fields, append, remove } = useFieldArray({
    control,
    name: path,
  });

  return (
    <>
      <Button
        onClick={() => {
          append({});
        }}
        style={{ margin: "10px 0", width: "100%" }}
        type="primary"
      >
        Создать
      </Button>

      <Collapse bordered={false}>
        {fields.map((item, index) => {
          return (
            <>
              {Object.values(component?.items!).map((value) => {
                return (
                  <Panel
                    header={`${component._name} ${index + 1}`}
                    key={item.id}
                    className="panel"
                    extra={<CloseCircleFilled onClick={() => remove(index)} />}
                  >
                    <RecursiveConfig
                      config={value}
                      control={control}
                      path={`${path}.${index}`}
                    />
                  </Panel>
                );
              })}
            </>
          );
        })}
      </Collapse>
    </>
  );
};

export default ArrayComponent;
