import { Checkbox, ColorPicker, Flex, Select, Switch } from "antd";
import { Control, Controller } from "react-hook-form";
import useLicense from "../store/useLicense";
import { ComponentType, Property } from "../types";
import ArrayComponent from "./ArrayConfig";
import FloatInput from "./FloatInput";
import React from "react";

interface ComponentProps {
  component: Property;
  control: Control;
  path: string;
}

const ConfigComponent = ({ component, control, path }: ComponentProps) => {
  const roles = useLicense((state) => state.roles);
  const channels = useLicense((state) => state.channels);

  if (
    [
      ComponentType.Checkbox,
      ComponentType.Switch,
      ComponentType.Color,
    ].includes(component._component)
  ) {
    return (
      <>
        <Flex gap={5} align="center">
          <div className="componentBlock">
            <Controller
              control={control}
              name={path}
              render={({ field: { onChange, value } }) => {
                if (component._component == ComponentType.Checkbox) {
                  return (
                    <Checkbox onChange={onChange} value={value}></Checkbox>
                  );
                } else if (component._component == ComponentType.Switch) {
                  return (
                    <Switch
                      size="default"
                      checked={value}
                      onChange={onChange}
                    />
                  );
                } else if (component._component == ComponentType.Color) {
                  return (
                    <ColorPicker defaultValue="#1677ff" onChange={onChange} />
                  );
                }

                return <></>;
              }}
            />
          </div>

          <div className="componentText">
            <h5 className="componentTitle">{component._name}</h5>
            {component._description ? (
              <p className="componentDescription">{component._description}</p>
            ) : null}
          </div>
        </Flex>
      </>
    );
  } else if (component._component == ComponentType.Array) {
    return (
      <ArrayComponent component={component} control={control} path={path} />
    );
  } else if (component._component == ComponentType.Input) {
    return (
      <Flex gap={5} vertical style={{ width: "100%" }}>
        <Flex gap={10} align="center">
          <h2>{component._name}</h2>
        </Flex>
        <Controller
          control={control}
          name={path}
          render={({ field: { onChange, value } }) => (
            <FloatInput
              size="large"
              style={{ width: "100%" }}
              label={component._placeholder}
              placeholder={component._placeholder}
              value={value}
              onChange={onChange}
              showCount
            />
          )}
        />

        <p className="componentDescription">{component._description}</p>
      </Flex>
    );
  } else if (
    [ComponentType.Channel, ComponentType.Role].includes(component._component)
  ) {
    const options =
      component._component == ComponentType.Role ? roles : channels;
    return (
      <Flex gap={0} vertical>
        <Flex gap={10} align="center">
          <h2>{component._name}</h2>
          <p className="componentDescription">{component._description}</p>
        </Flex>

        <Controller
          control={control}
          name={path}
          render={({ field: { onChange, value } }) => (
            <Select
              showSearch
              placeholder={component._description}
              optionFilterProp="label"
              options={
                options
                  ? options?.map((option) => ({
                      value: option.id,
                      label: option.name,
                    }))
                  : undefined
              }
              {...(component._multi ? { mode: "multiple" } : {})}
              value={value}
              onChange={onChange}
            />
          )}
        />
      </Flex>
    );
  }

  return <></>
};

export default ConfigComponent;
