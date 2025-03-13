import {
  Container,
  Sidebar,
  FixedHeader,
  TimeframeSelect,
  Main,
  ApexChart,
} from "../components";

function Apex() {
  return (
    <Container>
      <Sidebar />
      <FixedHeader>
        <TimeframeSelect />
      </FixedHeader>
      <Main>
        <ApexChart />
      </Main>
    </Container>
  );
}

export default Apex;
