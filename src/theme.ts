import { theme } from "antd";

const custom_theme = {
  token: {
    wireframe: false,
    borderRadius: 7,
    colorTextBase: "#faf7f7",
    colorBgBase: "#0c192b",
  },
  components: {
    Layout: {
      bodyBg: "#0c192b",
      headerBg: "#0c192b",
    },
    Checkbox: {
      colorPrimary: "rgb(42,79,131)",
      controlInteractiveSize: 22,
    },
    Switch: {
      colorPrimary: "rgb(42,79,131)",
    },
    Input: {
      colorText: "rgba(252,251,251,0.88)",
      colorTextPlaceholder: "rgba(225,218,218,0.25)",
      colorBorder: "rgb(35,54,81)",
      colorBgContainer: "rgba(255,255,255,0)",
      activeShadow: "0",
      hoverBorderColor: "rgb(45,75,116)",
      borderRadius: 10,
      controlHeight: 40,
    },
    Select: {
      colorText: "rgba(252,251,251,0.88)",
      colorTextPlaceholder: "rgba(225,218,218,0.25)",
      colorBorder: "rgb(35,54,81)",
      colorBgContainer: "rgba(255,255,255,0)",
      activeShadow: "0",
      hoverBorderColor: "rgb(45,75,116)",
      borderRadius: 10,
      controlHeight: 40,
      optionSelectedBg: "rgb(24,59,83)",
    },
  },
};

export default custom_theme;
