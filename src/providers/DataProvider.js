import { useData } from "../hooks";
import { DataContext } from "../context";

export function DataProvider(props) {
  const data = useData();
  return <DataContext.Provider value={data} {...props} />;
}
