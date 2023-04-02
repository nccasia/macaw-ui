import clsx from "clsx";
import React, { useEffect, useMemo } from "react";

import { CustomLogo } from "../icons/CustomLogo";
import { Logo } from "../icons/Logo";
import { LogoDark } from "../icons/LogoDark";
import { localStorageKeys } from "../localStorageKeys";
import { makeStyles, useTheme } from "../theme";
import useLocalStorage from "../tools/useLocalStorage";
import { ExpandButton } from "./ExpandButton";
import { MenuItem, menuWidth, shrunkMenuWidth } from "./MenuItem";
import { BaseSidebarProps } from "./types";

export interface SidebarStylesProps {
  sidebarWidth: number;
}

const useStyles = makeStyles(
  (theme) => ({
    expandButton: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1.5),
    },
    float: {
      height: "100vh",
      position: "fixed",
      overflowY: "auto",
      overflowX: "hidden",
      paddingBottom: theme.spacing(3),
    },
    logo: {
      display: "block",
      margin: `36px 0 ${theme.spacing(3)} ${theme.spacing(2.5)}`,
      color: "inherit",
    },
    root: {
      transition: "width 0.5s ease",
      width: (props: SidebarStylesProps) => props.sidebarWidth,
    },
    rootShrink: {
      width: `${shrunkMenuWidth}px !important`,
    },
    toolbarContainer: {
      margin: theme.spacing(1, 0, 1, 1.5),
    },
  }),
  {
    name: "SideBar",
  }
);

export interface SidebarProps extends BaseSidebarProps {
  activeId: string;
  logoSrc?: string;
  logo?: React.ReactNode;
  popover?: boolean;
  onExpand?: (value: boolean) => void;
  customSidebarWidth?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeId,
  menuItems,
  toolbar,
  onMenuItemClick,
  logoHref,
  linkComponent,
  className,
  logoSrc,
  popover,
  logo,
  onExpand,
  customSidebarWidth,
}) => {
  const sidebarWidth = customSidebarWidth ?? menuWidth;
  const { themeType } = useTheme();
  const classes = useStyles({ sidebarWidth });
  const { value: isShrunkStr, setValue: setShrink } = useLocalStorage(
    localStorageKeys.menuShrink,
    false.toString()
  );
  const logoContent = useMemo(() => {
    if (logoSrc) {
      return <CustomLogo src={logoSrc} />;
    }
    if (logo) {
      return logo;
    }
    return themeType === "dark" ? <LogoDark /> : <Logo />;
  }, [logoSrc, logo, themeType]);
  const isShrunk = isShrunkStr === "true";

  const checkPopover = useMemo(() => {
    if (isShrunk) {
      return !popover;
    }
    return popover;
  }, [isShrunk]);
  const Link = linkComponent ?? "a";

  useEffect(() => {
    if (typeof onExpand === "function") {
      onExpand(isShrunk);
    }
  }, [isShrunk]);

  return (
    <div
      className={clsx(className, classes.root, {
        [classes.rootShrink]: isShrunk,
      })}
    >
      <div className={classes.float}>
        <Link href={logoHref} className={classes.logo}>
          {logoContent}
        </Link>
        {menuItems.map((menuItem) =>
          linkComponent ? (
            <MenuItem
              activeId={activeId}
              isMenuShrunk={isShrunk}
              menuItem={menuItem}
              key={menuItem.ariaLabel}
              popover={checkPopover}
              linkComponent={linkComponent}
              customMenuWidth={sidebarWidth}
            />
          ) : (
            <MenuItem
              activeId={activeId}
              isMenuShrunk={isShrunk}
              menuItem={menuItem}
              popover={checkPopover}
              onClick={onMenuItemClick}
              key={menuItem.ariaLabel}
              customMenuWidth={sidebarWidth}
            />
          )
        )}
        {toolbar && <div className={classes.toolbarContainer}>{toolbar}</div>}
        <ExpandButton
          className={classes.expandButton}
          isShrunk={isShrunk}
          onClick={() => setShrink((!isShrunk).toString())}
        />
      </div>
    </div>
  );
};

Sidebar.displayName = "SideBar";
