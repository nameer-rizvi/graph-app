import {
  Container,
  Sidebar,
  FixedHeader,
  TimeframeSelect,
  Main,
  Charts,
} from "../components";

const Home = () => (
  <Container>
    <Sidebar />
    <FixedHeader>
      <TimeframeSelect />
    </FixedHeader>
    <Main>
      <Charts />
    </Main>
    {/*<ThemeToggle />*/}
  </Container>
);

export default Home;
