import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import { AppHeader } from "./AppHeader";
import { SearchInput } from "./SearchInput";
import { DataCard } from "./DataCard";
import { LinksCard } from "./LinksCard";
import { RefreshButton } from "./RefreshButton";

export function Sidebar() {
  return (
    <SidebarContainer>
      <AppHeader />
      <Divider />
      <Toolbar sx={{ mt: 2 }}>
        <SearchInput />
      </Toolbar>
      <Toolbar>
        <DataCard />
      </Toolbar>
      <Toolbar sx={{ mt: 2 }}>
        <LinksCard />
      </Toolbar>
      <SidebarToolbarRefreshButton>
        <RefreshButton />
      </SidebarToolbarRefreshButton>
    </SidebarContainer>
  );
}

function SidebarContainer(props) {
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

function SidebarToolbarRefreshButton(props) {
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
