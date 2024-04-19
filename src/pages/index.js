import {
  Container,
  Sidebar,
  FixedHeader,
  TimeframeSelect,
  Main,
  Charts,
} from "../components";

function Home() {
  return (
    <Container>
      <Sidebar />
      <FixedHeader>
        <TimeframeSelect />
      </FixedHeader>
      <Main>
        <Charts />
      </Main>
    </Container>
  );
}

export default Home;
