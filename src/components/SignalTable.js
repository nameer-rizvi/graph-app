import useAsyncFetch from "async-fetch";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import simpul from "simpul";

const columns = [
  {
    title: "Symbol",
    link: (row) => `/?timeframe=${row.timeframe}&symbol=${row.symbol}`,
    label: (row) => row.symbol?.toUpperCase(),
    labelTitle: (row) => row.name || "",
  },
  {
    title: "Signal",
    label: (row) =>
      ({
        ACCUMULATION: "Maximum accumulation",
        VOLUME: "Maximum volume",
        SMA_SMA: "Minimum sma-sma signal",
      }[row.type]),
  },
  {
    title: "Date",
    label: (row) => new Date(row.date).toLocaleDateString(),
  },
  {
    title: "Value",
    label: (row) => row.value.toLocaleString(),
  },
  {
    title: "Change",
    color: (row) =>
      row.change > 0 ? "#4caf50" : row.change < 0 ? "#e91e63" : "",
    label: (row) => simpul.numberString(row.change, ["%", "+"]),
  },
  {
    title: "Age",
    label: (row) =>
      simpul.date
        .getRelative(row.date)
        .replace("ago", "")
        .replace("last", "1")
        .trim(),
  },
];

export function SignalTable(query) {
  const request = useAsyncFetch("/api/table", {
    query,
    auto: true,
    ignoreCleanup: true,
  });

  if (request.pending) {
    return "Loading...";
  }

  if (request.error) {
    return request.error.statusText;
  }

  if (request.data?.length) {
    return (
      <TableContainer component={Paper}>
        <Table size="small" aria-label="table container">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.title} align={column.align}>
                  {column.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {request.data.map((row) => (
              <TableRow key={row.symbol + row.type}>
                {columns.map((column) => (
                  <TableCell
                    key={row.symbol + column.title}
                    align={column.align}
                    sx={{ color: column.color?.(row) }}
                    title={column.labelTitle?.(row) || column.label(row)}
                  >
                    {column.link ? (
                      <Link href={column.link(row)} target="_blank">
                        {column.label(row)}
                      </Link>
                    ) : (
                      column.label(row)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
