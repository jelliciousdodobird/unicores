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

const NavItemContainer = styled(motion.li)`
  cursor: pointer;

  width: ${({ theme }) => theme.dimensions.subNav.maxWidth - 10}px;
  height: ${({ theme }) => theme.dimensions.subNav.maxWidth - 10}px;

  flex-shrink: 0;

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

export default NavItem;
