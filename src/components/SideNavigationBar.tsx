// style
import { css, jsx, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

// library
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// icon
import { FaRegHeart } from "react-icons/fa";

// type
import { IconType } from "react-icons";
import { createElement } from "react";

// temporary
import { SiBaidu } from "react-icons/si";

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
  display: flex;
  flex-flow: column nowrap;

  justify-content: flex-start;
  align-items: center;

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

const NavItemContainer = styled(motion.li)`
  cursor: pointer;
  overflow: hidden;

  width: ${({ theme }) => theme.dimensions.subNav.maxWidth - 10}px;
  height: ${({ theme }) => theme.dimensions.subNav.maxWidth - 10}px;

  border: 1px black solid;

  display: flex;
  justify-content: center;
  align-items: center;

  a,
  button {
    display: flex;
    flex-flow: column;

    justify-content: center;
    align-items: center;
    text-align: center;

    background-color: transparent;

    width: 100%;
    height: 100%;

    span {
      width: ${({ iconSize }: { iconSize: number }) => iconSize * 2}px;
      height: ${({ iconSize }: { iconSize: number }) => iconSize * 2}px;
      svg {
        width: 100%;
        height: 100%;

        path {
          fill: ${({ theme }) => theme.colors.onPrimary.main};
        }
      }
    }

    p {
      width: 100%;

      font-size: 12px;
      color: ${({ theme }) => theme.colors.onPrimary.main};
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary.main};
    }
  }
`;

const NavLink = styled(motion(Link))``;
const NavButton = styled(motion.button)``;

type NavItemProps = {
  icon?: IconType;
  text?: string;
  link?: string;
  onClick?: () => void;
  iconSize?: number;
};

const NavItem = ({
  icon,
  text,
  link = "#",
  onClick = () => {},
  iconSize = 10,
}: NavItemProps) => {
  const NavType = link === "#" ? NavButton : NavLink;
  return (
    <NavItemContainer iconSize={iconSize}>
      <NavType to={link} onClick={onClick}>
        {icon && <motion.span>{createElement(icon)}</motion.span>}
        {text && <motion.p>{text}</motion.p>}
      </NavType>
    </NavItemContainer>
  );
};

const WorkSpaceContainer = styled(motion.ul)`
  display: flex;
  flex-flow: column;

  justify-content: flex-start;
  align-items: center;

  height: 100%;

  overflow: auto;
`;

const PeripheralContainer = styled(motion.ul)`
  display: flex;
  flex-flow: column;

  justify-content: flex-start;
  align-items: center;
`;

const SideNavigationBar = () => {
  const Test = () => {
    console.log("hi");
  };
  return (
    <SideNavContainer>
      <SideNavigation>
        <NavItem icon={FaRegHeart} link="/test"></NavItem>
        <li>
          <WorkSpaceContainer>
            <NavItem text="home" link="/home"></NavItem>
            <NavItem text="FA20" link="/schedule"></NavItem>
            <NavItem icon={SiBaidu} onClick={Test}></NavItem>
          </WorkSpaceContainer>
        </li>
        <li>
          <PeripheralContainer>
            <NavItem text="Setting" link="/"></NavItem>
          </PeripheralContainer>
        </li>
      </SideNavigation>
    </SideNavContainer>
  );
};

export default SideNavigationBar;
