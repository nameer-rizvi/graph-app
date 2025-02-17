import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";

export function SidebarContainer(props) {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 350,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: 350, boxSizing: "border-box" },
      }}
      {...props}
    />
  );
}

export function SidebarContainerButton(props) {
  return (
    <Toolbar
      sx={{
        flexDirection: "column",
        justifyContent: "flex-end",
        flexGrow: 1,
      }}
      {...props}
    />
  );
}
