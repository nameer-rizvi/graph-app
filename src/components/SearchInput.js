"use client";
import { useContext } from "react";
import { DataContext } from "../providers";
import Box from "@mui/material/Box";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";
import simpul from "simpul";

export function SearchInput() {
  const data = useContext(DataContext);

  function updateSymbol(e) {
    if (e.key === "Enter") data.symbol.update(e.target.value);
  }

  return (
    <Box width="100%">
      <Search error>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          type="search"
          defaultValue={data.symbol.value || data.data.symbol}
          onKeyDown={updateSymbol}
          placeholder="Search…"
          inputProps={{ "aria-label": "search", style: { width: "100%" } }}
        />
      </Search>
      <SearchStatus data={data} />
    </Box>
  );
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: "100%",
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0), // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function SearchStatus({ data = {} }) {
  const sx = {
    display: "block",
    color: data.error?.response && "#ff412b",
    lineHeight: 1.25,
  };

  const label =
    data.pending === true
      ? "Loading..."
      : data.error?.response
      ? data.error.response.substring(data.error.response.indexOf(":") + 1)
      : "";

  return (
    <Box height="24px" my={1}>
      <Typography variant="caption" sx={sx}>
        {simpul.trimBoundary(simpul.capitalize(label))}
      </Typography>
    </Box>
  );
}
