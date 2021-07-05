// style
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// library
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import React, { useRef, MouseEvent } from "react";

// icon
import { FaRegHeart } from "react-icons/fa";

// type
import { IconType } from "react-icons";
import { createElement } from "react";

// temporary
import { SiBaidu } from "react-icons/si";

// components
import NavItem from "./NavItem";

const SideNavContainer = styled(motion.nav)`
  display: flex;
  justify-content: center;
  align-content: center;

  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.m + 1}px) {
    ${({ theme }) => css`
      width: ${theme.dimensions.subNav.maxWidth}px;
      min-width: ${theme.dimensions.subNav.maxWidth}px;
      max-width: ${theme.dimensions.subNav.maxWidth}px;
    `}

    height: 100%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.m}px) {
    ${({ theme }) => css`
      width: ${theme.dimensions.subNav.maxWidth}px;
      min-width: ${theme.dimensions.subNav.maxWidth}px;
      max-width: ${theme.dimensions.subNav.maxWidth}px;
    `}
    height: 100%;
  }
`;

const SideNavigation = styled(motion.ul)`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;

  justify-content: flex-start;
  align-items: center;

  padding: ${({ theme }) => theme.dimensions.subNav.maxWidth - 45}px;

  ${({ theme }) => css`
    background-color: ${theme.colors.primary.light};
  `}

  @media (min-width: ${({ theme }) => theme.breakpoints.m + 1}px) {
    width: 100%;
    height: 100%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.m}px) {
    width: 100%;
    height: 100%;
  }
`;

const WorkSpaceContainer = styled(motion.li)`
  flex: 100;
  display: flex;
  overflow: auto;

  ul {
    display: flex;
    flex-flow: column;

    justify-content: flex-start;
    align-items: center;

    overflow: auto;
  }
`;

const SideNavigationBar = () => {
  const Test = () => {
    console.log("hi");
  };
  //   const ref = useRef(0);
  //   const scroll = (scrollOffset: number) => {
  //   ref.current.scrollTop += scrollOffset;
  // };
  return (
    <SideNavContainer>
      <SideNavigation>
        <NavItem icon={FaRegHeart} link="/test"></NavItem>
        <WorkSpaceContainer>
          <ul>
            {/* <li>
              <button
                onClick={(event: MouseEvent) => {
                  scroll(-10);
                }}
              >^</button>
            </li>
            <NavItem text="home" link="/home"></NavItem>
            <NavItem text="FA20" link="/schedule"></NavItem>
            <NavItem icon={SiBaidu} onClick={Test}></NavItem>
            <NavItem icon={SiBaidu} onClick={Test}></NavItem>
            <NavItem icon={SiBaidu} onClick={Test}></NavItem>
            <NavItem icon={SiBaidu} onClick={Test}></NavItem>
            <NavItem icon={SiBaidu} onClick={Test}></NavItem>
            <NavItem icon={SiBaidu} onClick={Test}></NavItem> */}
          </ul>
        </WorkSpaceContainer>
        <NavItem text="Setting" link="/"></NavItem>
        <NavItem text="Theme" link="/"></NavItem>
        <NavItem text="Profile" link="/"></NavItem>
      </SideNavigation>
    </SideNavContainer>
  );
};

export default SideNavigationBar;
