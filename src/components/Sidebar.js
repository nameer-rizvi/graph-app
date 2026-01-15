import { SidebarContainer, SidebarContainerButton } from "./SidebarContainer";
import { AppHeader } from "./AppHeader";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import { SearchInput } from "./SearchInput";
import { DataCard } from "./DataCard";
// import { LinksCard } from "./LinksCard";
// import { RefreshButton } from "./RefreshButton";

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
      <Toolbar sx={{ mt: 2 }}>{/*<LinksCard />*/}</Toolbar>
      <SidebarContainerButton>{/*<RefreshButton />*/}</SidebarContainerButton>
    </SidebarContainer>
  );
}
