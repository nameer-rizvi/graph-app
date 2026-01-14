import { useState } from "react";
import {
  Container,
  Sidebar,
  FixedHeader,
  TimeframeSelect,
  Main,
  Charts,
  ApexChart,
  ViewToggle,
} from "../components";

function Home() {
  const [view, setView] = useState(true);

  return (
    <Container>
      <Sidebar />
      <FixedHeader>
        <TimeframeSelect />
      </FixedHeader>
      <Main>{view ? <Charts /> : <ApexChart />}</Main>
      <ViewToggle onClick={() => setView(!view)} />
    </Container>
  );
}

export default Home;
