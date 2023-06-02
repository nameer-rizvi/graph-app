import {
  Container,
  Sidebar,
  Main,
  FixedHeader,
  TimeframeSelect,
  Charts,
  ThemeToggle,
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
    <ThemeToggle />
  </Container>
);

export default Home;
