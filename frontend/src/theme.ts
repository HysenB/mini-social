import { theme as baseTheme } from "@chakra-ui/react";

const theme = {
  ...baseTheme,
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
};

export default theme;
