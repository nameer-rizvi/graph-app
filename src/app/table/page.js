"use client";
import { useState } from "react";
import { Container, Sidebar3, Main, SignalTable } from "../../components";

const OPTIONS = {
  SCREENER: ["ETFs", "Equities", "Mid Caps", "Small Caps"],
  TIMEFRAME: ["Monthly", "Weekly"],
};

function TablePage() {
  const [screener, setScreener] = useState(OPTIONS.SCREENER[0]);

  const [timeframe, setTimeframe] = useState(OPTIONS.TIMEFRAME[0]);

  return (
    <Container>
      <Sidebar3
        options={OPTIONS}
        screener={screener}
        timeframe={timeframe}
        setScreener={setScreener}
        setTimeframe={setTimeframe}
      />
      <Main>
        <SignalTable screener={screener} timeframe={timeframe} />
      </Main>
    </Container>
  );
}

export default TablePage;
