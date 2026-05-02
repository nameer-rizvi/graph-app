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
        MACD_TREND: "Macd trend",
        SMA_SMA: "Minimum sma-sma signal",
        VOLUME: "Maximum volume",
      }[row.type]),
  },
  {
    title: "Date",
    label: (row, rows) =>
      (rows.filter((r) => r.date === row.date && r.type !== "MACD_TREND")
        .length >= 3
        ? "⭐ "
        : "") + new Date(row.date).toLocaleDateString(),
  },
  {
    title: "Value",
    label: (row) =>
      ({
        ACCUMULATION: "",
        MACD_TREND: "",
        SMA_SMA: "",
        VOLUME: row.value >= 900000000 ? "⭐ " : "",
      }[row.type] +
      (simpul.isNumber(row.value)
        ? row.value.toLocaleString()
        : row.value.toUpperCase())),
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
              <TableRow
                key={row.symbol + row.type}
                hover
                role="link"
                sx={{ cursor: "pointer" }}
                onClick={() => openLink(columns, row)}
              >
                {columns.map((column) => (
                  <TableCell
                    key={row.symbol + column.title}
                    align={column.align}
                    sx={{ color: column.color?.(row) }}
                    title={
                      column.labelTitle?.(row) ||
                      column.label(row, request.data)
                    }
                  >
                    {column.link ? (
                      <Link>{column.label(row, request.data)}</Link>
                    ) : (
                      column.label(row, request.data)
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

  return "No data found.";
}

function openLink(columns, row) {
  return window.open(columns[0].link(row), "_blank", "noopener,noreferrer");
}
