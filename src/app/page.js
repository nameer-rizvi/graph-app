"use client";
import { useState } from "react";
import { DataProvider } from "../providers";
import {
  Container,
  Sidebar,
  FixedHeader,
  TimeframeSelect,
  Main,
  Charts,
  ViewToggle,
} from "../components";

export default function Home() {
  const [view, setView] = useState(true);
  return (
    <Container>
      <DataProvider>
        <Sidebar />
        <FixedHeader>
          <TimeframeSelect />
        </FixedHeader>
        <Main>{view ? <Charts /> : "<ApexChart />"}</Main>
      </DataProvider>
      <ViewToggle onClick={() => setView(!view)} />
    </Container>
  );
}
