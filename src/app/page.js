import { DataProvider } from "../providers";
import { Container, Sidebar } from "../components";

export default function Home() {
  return (
    <Container>
      <DataProvider>
        <Sidebar />
      </DataProvider>
    </Container>
  );
}

// const [view, setView] = useState(true);
// <Container>
//   <Sidebar />
//   <FixedHeader>
//     <TimeframeSelect />
//   </FixedHeader>
//   <Main>{view ? <Charts /> : <ApexChart />}</Main>
//   <ViewToggle onClick={() => setView(!view)} />
// </Container>
