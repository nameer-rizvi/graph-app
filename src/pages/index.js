import { useState } from "react";
import {
  Container,
  Sidebar,
  FixedHeader,
  TimeframeSelect,
  Main,
  ApexChart,
  Charts,
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
      <Main>
        {view ? <Charts /> : <ApexChart />}
        <ViewToggle onClick={() => setView(!view)} />
      </Main>
    </Container>
  );
}

export default Home;
