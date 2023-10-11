import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weeks = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
const shifts = ["Morning", "Evening", "Night"];

function getBgColor(date, selectedDates) {
  const dateObj = selectedDates.find((de) => de.date === date.toDateString());
  if (!dateObj) {
    return "";
  }

  if (dateObj.shift === "Morning") {
    return "green";
  }
  if (dateObj.shift === "Evening") {
    return "blue";
  }
  if (dateObj.shift === "Night") {
    return "purple";
  }
}


const dayStyle = {
  cursor: "pointer",
  height: "40px",
  display: "flex",
  alignItems: "center",
  borderRadius: "16px",
  justifyContent: "center",
};

const Calender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedShift, setSelectedShift] = useState("Morning");

  const handleChange = (event) => {
    setSelectedShift(event.target.value);
  };

  const handleMonthChange = (monthOffset, yearOffset) => {
    const newDate = new Date(
      currentDate.getFullYear() + yearOffset,
      currentDate.getMonth() + monthOffset,
      1
    );
    setCurrentDate(newDate);
  };


  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const blanks = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const renderCalendarDays = () => {
    return Array.from({ length: daysInMonth + blanks }, (_, i) => {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - blanks + 1);
      const bgcolor = getBgColor(date, selectedDates);
      return (
        <Grid item key={i} width={80} height={50}>
          <Typography
            align="center"
            sx={{
              ...dayStyle,
              bgcolor,
              color: bgcolor ? "white" : "initial",
            }}
            onClick={() => handleSelectDay(date.toDateString())}
          >
            {i < blanks ? " " : date.getDate()}
          </Typography>
        </Grid>
      );
    });
  };

  function handleSelectWeekDay(dayOfWeek) {
    const dates = [];
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start with the first day of the month

    while (date.getMonth() === currentDate.getMonth()) {
      if (date.getDay() === dayOfWeek) {
        dates.push({ date: new Date(date).toDateString(), shift: selectedShift }); // Copy the date to avoid modifying the original date
      }
      date.setDate(date.getDate() + 1); // Move to the next day
    }
    const finalDates = [];
    for (let i = 0; i < dates.length; i++) {
      const dateObj = dates[i];
      const isAvailable = selectedDates.findIndex(({ date, shift }) => date === dateObj.date)
      if (isAvailable === -1) {
        finalDates.push(dateObj)
      }
    }
    setSelectedDates([...selectedDates, ...finalDates])
  }
  const handleSelectDay = (date) => {
    const isOldDate = selectedDates.find((d) => d.date === date);
    if (isOldDate) {
      setSelectedDates(selectedDates.filter((d) => d.date !== date));
    } else {
      setSelectedDates((ps) => [...ps, { date, shift: selectedShift }]);
    }
  };

  return (
    <Box m={4}>
      <FormControl>
        <FormLabel id="radio-buttons-group">Select Shift</FormLabel>
        <RadioGroup row aria-labelledby="radio-buttons-group" value={selectedShift} onChange={handleChange}>
          {shifts.map((s) => (
            <FormControlLabel key={s} value={s} control={<Radio />} label={s} />
          ))}
        </RadioGroup>
      </FormControl>

      <Paper elevation={2} sx={{ maxWidth: 560, p: 2 }}>
        <Grid container justifyContent="space-around">
          <Grid item>
            <IconButton color="primary" onClick={() => handleMonthChange(0, -1)}>
              <KeyboardDoubleArrowLeftIcon />
            </IconButton>
            <IconButton color="primary" onClick={() => handleMonthChange(-1, 0)}>
              <ChevronLeft />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">
              <code>
                <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>{months[currentDate.getMonth()]} </span>,{" "}
                {currentDate.getFullYear()}
              </code>
            </Typography>
          </Grid>
          <Grid item>
            <IconButton color="primary" onClick={() => handleMonthChange(1, 0)}>
              <ChevronRight />
            </IconButton>
            <IconButton color="primary" onClick={() => handleMonthChange(0, 1)}>
              <KeyboardDoubleArrowRightIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={2} mt={2} alignItems="center">
          {weeks.map((week, i) => (
            <Grid item width={80} key={week}>
              <Typography variant="subtitle2" align="center" sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }} onClick={() => handleSelectWeekDay(i)}>
                {week}
              </Typography>
            </Grid>
          ))}
          {renderCalendarDays()}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Calender;
