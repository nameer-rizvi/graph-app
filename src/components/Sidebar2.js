import { SidebarContainer, SidebarContainerButton } from "./SidebarContainer";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import { AppHeader } from "./AppHeader";
import { FormCard } from "./FormCard";
import { UploadButton } from "./UploadButton";

export function Sidebar2(props) {
  return (
    <SidebarContainer>
      <AppHeader />
      <Divider />
      <Toolbar sx={{ mt: 2 }}>
        <FormCard {...props} />
      </Toolbar>
      <SidebarContainerButton>
        <UploadButton {...props} />
      </SidebarContainerButton>
    </SidebarContainer>
  );
}
