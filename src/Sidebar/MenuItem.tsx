import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MuiMenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { alpha } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import React from "react";
import SVG from "react-inlinesvg";

import { makeStyles } from "../theme";
import { CustomLinkComponent, SidebarMenuItem } from "./types";
import { getLinkComponent, getLinkProps } from "./utils";

export interface MenuItemCommonProps {
  activeId: string;
  isMenuShrunk: boolean;
  menuItem: SidebarMenuItem;
  popover?: boolean;
  customMenuWidth?: number;
}

export type MenuItemProps = MenuItemCommonProps &
  (
    | {
        onClick: (menuItem: SidebarMenuItem) => void;
        linkComponent?: never;
      }
    | {
        onClick?: never;
        linkComponent: CustomLinkComponent;
      }
  );

export interface MenuItemStylesProps {
  menuItemWidth: number;
}

export const menuWidth = 210;
export const shrunkMenuWidth = 72;

const useStyles = makeStyles(
  (theme) => ({
    hideLabel: {
      "&$label": {
        opacity: 0,
      },
    },
    icon: {
      "& svg": {
        height: 24,
        width: 24,
      },
      marginRight: theme.spacing(1.5),
      transition: theme.transitions.duration.shortest + "ms",
    },
    rootFlat: {
      height: "auto",
    },
    label: {
      cursor: "pointer",
      display: "block",
      fontSize: "1.6rem",
      fontWeight: 600,
      opacity: 1,
      transition: theme.transitions.duration.shortest + "ms",
    },
    labelRoot: {
      position: "absolute",
      left: 60,
      width: 200,
      textAlign: "left",
      pointerEvents: "none",
    },
    menuItemBtn: {
      "&:focus": {
        color: theme.palette.primary.main,
        outline: 0,
      },
      background: "none",
      border: "none",
      color: "inherit",
      cursor: "pointer",
      display: "inline-flex",
      margin: 0,
      padding: 0,
    },
    subMemuPanel: {
      display: "flex",
      flexDirection: "column",
      marginTop: 18,
    },
    paper: {
      borderRadius: 4,
      boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.16)",
      cursor: "default",
      textAlign: "left",
    },
    popper: {
      margin: theme.spacing(3.5, 0, 0, 0),
      marginLeft: -menuWidth / 2,
      zIndex: 2,
    },
    popperShrink: {
      marginLeft: -shrunkMenuWidth / 2,
    },
    root: {
      "&:hover, &:focus-visible, &$rootOpen": {
        color: theme.palette.primary.main,
        outline: 0,
      },
      borderBottomRightRadius: 4,
      borderTopRightRadius: 4,
      color: alpha(theme.palette.text.primary, 0.6),
      cursor: "pointer",
      display: "flex",
      height: 56,
      overflow: "hidden",
      padding: theme.spacing(2, 3, 2, 3),
      transition: theme.transitions.duration.shortest + "ms",
      width: shrunkMenuWidth,
      "&$rootFlat": {
        height: "auto !important",
      },
      "& $subMenuLabel": {
        paddingLeft: 0,
      },
    },
    rootActive: {
      "&$root": {
        "&:hover, &:focus-visible, &$rootOpen": {
          color: theme.palette.primary.main,
        },
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
      },
    },
    rootExpanded: {
      width: (props: MenuItemStylesProps) => props.menuItemWidth,
    },
    rootOpen: {},
    subMenuHeader: {
      textTransform: "uppercase",
      color: theme.palette.text.hint,
      padding: theme.spacing(2, 2, 0.5, 2),
    },
    subMenuLabel: {
      "&.Mui-selected": {
        background: "unset !important",
      },
      background: "none",
      border: "none",
      color: theme.palette.text.primary,
      fontWeight: 500,
      height: 48,
      lineHeight: 36 + "px",
      textAlign: "left",
      textDecoration: "none",
      whiteSpace: "nowrap",
      width: "100%",
    },
  }),
  {
    name: "MenuItem",
  }
);

export const MenuItem: React.FC<MenuItemProps> = ({
  activeId,
  menuItem,
  popover,
  isMenuShrunk,
  onClick,
  linkComponent,
  customMenuWidth,
}) => {
  const menuItemWidth = customMenuWidth ?? menuWidth;
  const classes = useStyles({ menuItemWidth });
  const [open, setOpen] = React.useState(false);
  const anchor = React.useRef<any>(null);

  const handleClick = (event: React.MouseEvent, menuItem: SidebarMenuItem) => {
    event.stopPropagation();
    if (menuItem.children) {
      setOpen(true);
    } else {
      if (onClick) {
        onClick(menuItem);
      }

      if (menuItem.onClick) {
        menuItem.onClick();
      }

      setOpen(false);
    }
  };

  const RootNavComponent = menuItem.children ? "div" : linkComponent ?? "div";

  return (
    <RootNavComponent
      className={clsx(classes.root, {
        [classes.rootOpen]: open,
        [classes.rootFlat]: popover === false,
        [classes.rootActive]: [
          menuItem.id,
          ...(menuItem.children?.map((subMenu) => subMenu.id) || []),
        ].includes(activeId),
        [classes.rootExpanded]: !isMenuShrunk,
      })}
      ref={anchor}
      onClick={(event: React.MouseEvent) => handleClick(event, menuItem)}
      {...getLinkProps(menuItem)}
    >
      <span
        className={classes.menuItemBtn}
        data-test="menu-item-label"
        data-test-id={menuItem.id}
      >
        {menuItem.iconSrc && (
          <SVG className={classes.icon} src={menuItem.iconSrc} />
        )}
        <Typography
          aria-label={menuItem.ariaLabel}
          className={clsx(classes.label, classes.labelRoot, {
            [classes.hideLabel]: isMenuShrunk,
          })}
          variant="body2"
        >
          {menuItem.label}
        </Typography>
      </span>
      {menuItem.children && popover === true && (
        <Popper
          className={clsx(classes.popper, {
            [classes.popperShrink]: isMenuShrunk,
          })}
          open={open}
          anchorEl={anchor.current}
          transition
          placement="right-start"
        >
          <ClickAwayListener
            onClickAway={() => setOpen(false)}
            // https://github.com/mui/material-ui/issues/17402
            mouseEvent="onMouseDown"
            touchEvent="onTouchStart"
          >
            <Paper className={classes.paper}>
              {menuItem.children.map((subMenuItem) => {
                if (subMenuItem.url || subMenuItem.children) {
                  const linkProps = getLinkProps(subMenuItem);

                  return (
                    <MuiMenuItem
                      aria-label={subMenuItem.ariaLabel}
                      component={getLinkComponent(subMenuItem, linkComponent)}
                      className={clsx(classes.label, classes.subMenuLabel)}
                      key={subMenuItem.url}
                      onClick={(event: React.MouseEvent) =>
                        handleClick(event, subMenuItem)
                      }
                      data-test="submenu-item-label"
                      data-test-id={subMenuItem.id}
                      selected={activeId === subMenuItem.id}
                      {...linkProps}
                    >
                      {subMenuItem.label}
                    </MuiMenuItem>
                  );
                }

                return (
                  <Typography
                    key={subMenuItem.label}
                    variant="caption"
                    className={classes.subMenuHeader}
                  >
                    {subMenuItem.label}
                  </Typography>
                );
              })}
            </Paper>
          </ClickAwayListener>
        </Popper>
      )}
      {menuItem.children && popover === false && (
        <div className={classes.subMemuPanel}>
          {menuItem.children.map((subMenuItem) => {
            if (subMenuItem.url || subMenuItem.children) {
              const linkProps = getLinkProps(subMenuItem);

              return (
                <MuiMenuItem
                  aria-label={subMenuItem.ariaLabel}
                  component={getLinkComponent(subMenuItem, linkComponent)}
                  className={clsx(classes.label, classes.subMenuLabel)}
                  key={subMenuItem.url}
                  onClick={(event: React.MouseEvent) =>
                    handleClick(event, subMenuItem)
                  }
                  data-test="submenu-item-label"
                  data-test-id={subMenuItem.id}
                  selected={activeId === subMenuItem.id}
                  {...linkProps}
                >
                  {subMenuItem.label}
                </MuiMenuItem>
              );
            }

            return (
              <Typography
                key={subMenuItem.label}
                variant="caption"
                className={classes.subMenuHeader}
              >
                {subMenuItem.label}
              </Typography>
            );
          })}
        </div>
      )}
    </RootNavComponent>
  );
};

MenuItem.displayName = "MenuItem";
