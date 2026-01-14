import { useData } from "../hooks";
import { DataContext } from "../contexts";

export function DataProvider(props) {
  const data = useData();
  return <DataContext.Provider value={data} {...props} />;
}
