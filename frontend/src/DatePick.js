// import logo from "./logo.svg";
import "./App.css";
import * as React from "react";
import { Text, StyleSheet } from "react-native";
import TextField from "@mui/material/TextField";

import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";



class DatePick extends React.Component {

  render() {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Start"
          views={["year", "month"]}
          minDate={new Date("2015-01-01")}
          maxDate={new Date("2021-08-01")}
          value={this.props.dateStart}
          onChange={(e) => this.props.handleChangeDateStart(e)}
          renderInput={(params) => <TextField {...params} helperText={null} />}
        />
        <Text style={styles.titleText}>to</Text>
        <DatePicker
          label="End"
          views={["year", "month"]}
          minDate={new Date("2015-02-01")}
          maxDate={new Date("2021-09-01")}
          value={this.props.dateEnd}
          onChange={(e) => this.props.handleChangeDateEnd(e)}
          renderInput={(params) => <TextField {...params} helperText={null} />}
        />
      </LocalizationProvider>
    );
  }
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: "Cochin",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default DatePick;
