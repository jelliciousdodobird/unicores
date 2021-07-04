// styling:
import { css, jsx, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { createElement } from "react";
import { IconType } from "react-icons";

const getIconHeight = (iconSize: number | undefined, theme: Theme) => {
  return iconSize ? iconSize : theme.dimensions.unit * 1.5;
};

const Button = styled(motion.button)`
  background-color: transparent;

  height: 2.5rem;
  width: 2.5rem;

  span {
    height: 100%;
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      ${({
        iconSize,
        theme,
      }: {
        iconSize: number | undefined;
        theme?: Theme;
      }) =>
        css`
          width: ${getIconHeight(iconSize, theme as Theme)}px;
          height: ${getIconHeight(iconSize, theme as Theme)}px;
        `}

      path {
        fill: ${({ theme }) => theme.colors.onBackground.main};
      }
    }

    p {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  &:hover {
    span {
      svg {
        path {
          fill: ${({ theme }) => theme.colors.primary.main};
        }
      }
      p {
        color: ${({ theme }) => theme.colors.primary.main};
      }
    }
  }
`;

type IconButtonProps = {
  icon?: IconType;
  iconAnimationProps?: any;
  iconSize?: number;
  type?: "button" | "reset" | "submit" | undefined;
  text?: string;
  [x: string]: any;
};

const IconButton = ({
  icon,
  text,
  iconAnimationProps,
  iconSize,
  type = "button",
  children,
  ...props
}: IconButtonProps) => {
  return (
    <Button {...props} type={type} iconSize={iconSize}>
      <motion.span {...iconAnimationProps} whileTap={{ scale: 0.85 }}>
        {icon && createElement(icon)}
        {text && <p>{text}</p>}
      </motion.span>
    </Button>
  );
};

export default IconButton;
