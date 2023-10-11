import React, { useMemo } from "react";

//MRT Imports
//import MaterialReactTable from 'material-react-table'; //default import deprecated
import { MaterialReactTable } from "material-react-table";

//Material UI Imports
import { Box, Button, ListItemIcon, MenuItem, TextField, Typography } from "@mui/material";

//Date Picker Imports
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

//Icons Imports
import { AccountCircle, Send } from "@mui/icons-material";

//Mock Data
import { data } from "./makeData";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { isEqual } from "date-fns";

const Example = () => {
  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`, //accessorFn used to join multiple data into a single cell
        id: "name", //id is still required when using accessorFn instead of accessorKey
        header: "Name",
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}>
            <img alt="avatar" height={30} src={row.original.avatar} loading="lazy" style={{ borderRadius: "50%" }} />
            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
            <span>{renderedCellValue}</span>
          </Box>
        ),
      },
      {
        accessorKey: "email", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
        header: "Email",
      
      },

      {
        accessorKey: "salary",
        // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
        filterFn: "between",
        header: "Salary",
        //custom conditional format and styling
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() < 50_000
                  ? theme.palette.error.dark
                  : cell.getValue() >= 50_000 && cell.getValue() < 75_000
                  ? theme.palette.warning.dark
                  : theme.palette.success.dark,
              borderRadius: "0.25rem",
              color: "#fff",
              maxWidth: "9ch",
              p: "0.25rem",
            })}>
            {cell.getValue()?.toLocaleString?.("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Box>
        ),
      },
      {
        accessorKey: "jobTitle", //hey a simple column for once
        header: "Job Title",
      },
      {
        accessorFn: (row) => new Date(row.startDate), //convert to Date for sorting and filtering
        id: "startDate",
        header: "Start Date",

        filterFn: (row, columnId, filterValue) => {
          return isEqual(new Date(row.getValue(columnId)), new Date(filterValue));
        },
        sortingFn: "datetime",
        Cell: ({ cell }) => cell.getValue()?.toLocaleDateString("en-in"), //render Date as a string
        Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
        //Custom Date Picker Filter from @mui/x-date-pickers
        Filter: ({ column }) => {
          console.log(column.getFilterValue(), column);
          return (
            <DatePicker
            inputFormat="dd/MM/yyyy"
              value={column.getFilterValue() || null}
              onChange={(newValue) => {
                column.setFilterValue(newValue);
              }}
              renderInput={(params) => <TextField {...params} variant="standard" size="small" />}
            />
          );
        },
      },
    ],
    []
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableColumnFilterModes
      enableColumnOrdering
      enableGrouping
      enablePinning
      //   enableRowActions

      enableRowSelection
      initialState={{ showColumnFilters: true }}
      positionToolbarAlertBanner="bottom"
      //   renderDetailPanel={({ row }) => (
      //     <Box
      //       sx={{
      //         display: 'flex',
      //         justifyContent: 'space-around',
      //         alignItems: 'center',
      //       }}
      //     >
      //       <img
      //         alt="avatar"
      //         height={200}
      //         src={row.original.avatar}
      //         loading="lazy"
      //         style={{ borderRadius: '50%' }}
      //       />
      //       <Box sx={{ textAlign: 'center' }}>
      //         <Typography variant="h4">Signature Catch Phrase:</Typography>
      //         <Typography variant="h1">
      //           &quot;{row.original.signatureCatchPhrase}&quot;
      //         </Typography>
      //       </Box>
      //     </Box>
      //   )}
      renderRowActionMenuItems={({ closeMenu }) => [
        <MenuItem
          key={0}
          onClick={() => {
            // View profile logic...
            closeMenu();
          }}
          sx={{ m: 0 }}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          View Profile
        </MenuItem>,
        <MenuItem
          key={1}
          onClick={() => {
            // Send email logic...
            closeMenu();
          }}
          sx={{ m: 0 }}>
          <ListItemIcon>
            <Send />
          </ListItemIcon>
          Send Email
        </MenuItem>,
      ]}
      renderTopToolbarCustomActions={({ table }) => {
        const handleDeactivate = () => {
          table.getSelectedRowModel().flatRows.forEach((row) => {
            alert("deactivating " + row.getValue("name"));
          });
        };

        const handleActivate = () => {
          table.getSelectedRowModel().flatRows.forEach((row) => {
            alert("activating " + row.getValue("name"));
          });
        };

        const handleContact = () => {
          table.getSelectedRowModel().flatRows.forEach((row) => {
            alert("contact " + row.getValue("name"));
          });
        };

        return (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              color="error"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleDeactivate}
              variant="contained">
              Deactivate
            </Button>
            <Button
              color="success"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleActivate}
              variant="contained">
              Activate
            </Button>
            <Button color="info" disabled={!table.getIsSomeRowsSelected()} onClick={handleContact} variant="contained">
              Contact
            </Button>
          </div>
        );
      }}
    />
  );
};

export default Example;
