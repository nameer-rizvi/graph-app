import { Container, Sidebar2, Main, Charts2 } from "../components";
import { useState } from "react";

function Json() {
  const [data, setData] = useState([]);

  const [axis, setAxis] = useState({ x: "", y: [], options: [] });

  return (
    <Container>
      <Sidebar2 data={data} setData={setData} axis={axis} setAxis={setAxis} />
      <Main>
        <Charts2 data={data} axis={axis} />
      </Main>
    </Container>
  );
}

export default Json;
