// import logo from "./logo.svg";
import "./App.css";
import * as React from "react";
import { Text, StyleSheet } from "react-native";
import TextField from "@mui/material/TextField";

import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";



class DatePick extends React.Component {
  getRandomColor() {
    var letters = "0123456789ABCDEF".split("");
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  render() {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Start"
          views={["year", "month"]}
          minDate={new Date("2008-01-01")}
          maxDate={new Date("2021-12-01")}
          value={this.props.dateStart}
          onChange={(e) => this.props.handleChangeDateStart(e)}
          renderInput={(params) => <TextField {...params} helperText={null} />}
        />
        <Text style={styles.titleText}>to</Text>
        <DatePicker
          label="End"
          views={["year", "month"]}
          minDate={new Date("2008-02-01")}
          maxDate={new Date("2022-01-01")}
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
