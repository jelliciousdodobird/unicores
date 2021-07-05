// style
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

const TopNavContainer = styled("nav")`
  display: flex;
  flex-flow: row nowrap;

  align-items: center;

  ${({ theme }) => css`
    background-color: ${theme.colors.primary.main};
  `}

  @media (min-width: ${({ theme }) => theme.breakpoints.m + 1}px) {
    ${({ theme }) => css`
      height: ${theme.dimensions.mainNav.maxHeight}px;
      min-height: ${theme.dimensions.mainNav.maxHeight}px;
      max-height: ${theme.dimensions.mainNav.maxHeight}px;
    `}

    // position: sticky;
    // top: 0;

    width: 100%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.m}px) {
    ${({ theme }) => css`
      height: ${theme.dimensions.mainNav.maxHeight}px;
      max-height: ${theme.dimensions.mainNav.maxHeight}px;
    `}
    width: 100%;
  }
`;

const TopNavigationBar = () => {
  const theme = useTheme();

  return <TopNavContainer></TopNavContainer>;
};

export default TopNavigationBar;
