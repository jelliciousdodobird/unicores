/** @jsxImportSource @emotion/react */
import { css, Global, useTheme } from "@emotion/react";
// custom type definitions (FOUND IN @type/emotion.d.ts):
import {
  Dimension,
  Font,
  Theme,
  Breakpoints,
  Color,
  MainColor,
} from "@emotion/react";

import styled from "@emotion/styled";
import ColorString from "color";

/**
 * Creates a spread of colors based on a "main" color
 * @args color is an object with at least a "main" property
 * @returns Returns a Color object
 */
const createColorSpread = (color: MainColor): Color => {
  const mainColor = ColorString(color.main);

  return {
    lighter: color.lighter ? color.lighter : mainColor.lighten(0.2).hex(),
    light: color.light ? color.light : mainColor.lighten(0.1).hex(),
    main: color.main,
    dark: color.dark ? color.dark : mainColor.darken(0.1).hex(),
    darker: color.darker ? color.darker : mainColor.darken(0.2).hex(),
  };
};

const ccs = createColorSpread;

export const dimensions: Dimension = {
  unit: 14,
  mainNav: {
    maxWidth: 100,
    maxHeight: 70,
  },
  subNav: {
    maxWidth: 60,
    maxHeight: 60,
  },
};

export const baseFont: Font = {
  size: dimensions.unit,
  family: "Inter, sans-serif",
  weight: "400",
};

export const bp: Breakpoints = {
  xs: 300,
  s: 400,
  m: 550,
  l: 1080,
  xl: 1440,
};

export const darkTheme: Theme = {
  name: "dark",
  dimensions,
  font: baseFont,
  breakpoints: bp,
  colors: {
    primary: ccs({ main: "#43dbab", light: "#ff0000" }),
    secondary: ccs({ main: "#2dc3e9" }),

    background: ccs({ main: "#363f49" }),
    surface: ccs({ main: "#2c333b" }),

    onPrimary: ccs({ main: "#ffffff" }),
    onSecondary: ccs({ main: "#ffffff" }),

    onBackground: ccs({ main: "#ffffff" }),
    onSurface: ccs({ main: "#f6f6f6" }),

    // error: ccs({ main: "#ff6b6b" }),
    // error: ccs({ main: "#ff6b6b", light: "#fd3131" }),
    error: ccs({ main: "#ff5b5b", light: "#fd5050" }),

    correct: ccs({ main: "#37d7b2" }),
    warning: ccs({ main: "#fee257" }),
  },
};

export const lightTheme: Theme = {
  name: "light",
  dimensions,
  font: baseFont,
  breakpoints: bp,
  colors: {
    primary: ccs({ main: "#5b6eff" }),
    secondary: ccs({ main: "#6c63ff" }),

    background: ccs({ main: "#f5f7fb", light: "#fcfbfc" }),
    surface: ccs({ main: "#ffffff" }),

    onPrimary: ccs({ main: "#ffffff" }),
    onSecondary: ccs({ main: "#000000" }),

    onBackground: ccs({ main: "#363f49" }),
    onSurface: ccs({ main: "#2c333b" }),

    // error: ccs({ main: "#ff6b6b" }),
    // error: ccs({ main: "#ff6b6b", light: "#fd3131" }),
    // error: ccs({ main: "#fd3131", light: "#ff6b6b" }),
    error: ccs({ main: "#fd3131", light: "#ff5b5b" }),

    correct: ccs({ main: "#37d7b2" }),
    warning: ccs({ main: "#fee257" }),
  },
};

export const defaultCustomTheme: Theme = {
  ...darkTheme,
  name: "custom",
};

/** THEMES represent all the themes you define in Themes.tsx */
export const THEMES = {
  [lightTheme.name]: lightTheme,
  [darkTheme.name]: darkTheme,
  [defaultCustomTheme.name]: defaultCustomTheme,
};

export const GlobalReset = () => {
  const theme: Theme = useTheme();

  return (
    <Global
      styles={css`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          border: 0;
          outline: 0;

          font-family: ${theme.font.family};
          font-size: ${theme.font.size}px;
          font-weight: ${theme.font.weight};
          color: ${theme.colors.onBackground.main};
        }

        html {
          width: 100%;
          height: 100%;
          overflow: hidden;

          background-color: ${theme.colors.background.main};

          body {
            overflow: hidden;
            width: 100%;
            height: 100%;

            #root {
              overflow: hidden;
              width: 100%;
              height: 100%;

              display: flex;
            }
          }
        }

        a,
        a:link,
        a:visited,
        a:hover,
        a:active {
          cursor: pointer;
          text-decoration: none;
        }

        ul,
        ol,
        li {
          list-style-type: none;
        }

        button {
          border: 0;
          cursor: pointer;
        }

        button:active,
        button:focus {
          outline: 0;
        }

        input {
          border: 0;
          outline: 0;
        }
      `}
    />
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;

  /* background-color: ${({ theme }) => theme.colors.primary.main}; */

  display: flex;
`;

const getFontColor = (color: string) =>
  ColorString(color).isDark() ? "#ffffff" : "#000000";

const Column = styled.div`
  flex: 1;
  /* background-color: ${({ theme }) => theme.colors.background.main}; */
  background-color: ${({ c }: { c: string }) => c};
  padding: 1rem;

  display: flex;
  flex-direction: column;

  span {
    color: ${({ c }: { c: string }) => getFontColor(c)};
  }
`;

const ColorName = styled.span`
  width: 100%;
  color: #000;
`;

const ThemePreview = ({ theme }: { theme: Theme }) => {
  return (
    <Container>
      <Column c={theme.colors.background.main}>
        <ColorName>background: {theme.colors.background.main}</ColorName>
      </Column>
      <Column c={theme.colors.surface.main}>
        <ColorName>surface: {theme.colors.surface.main}</ColorName>
      </Column>
      <Column c={theme.colors.onBackground.main}>
        <ColorName>onBackground: {theme.colors.onBackground.main}</ColorName>
      </Column>
      <Column c={theme.colors.onSurface.main}>
        <ColorName>onSurface: {theme.colors.onSurface.main}</ColorName>
      </Column>
    </Container>
  );
};

export default ThemePreview;
