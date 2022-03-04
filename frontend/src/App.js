// import logo from "./logo.svg";
import "./App.css";
import * as React from "react";
import Box from "@mui/material/Box";
import { Text, StyleSheet } from "react-native";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "axios";

import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

Chart.register(ChartDataLabels, ArcElement, Tooltip, Legend);

class Portfolio extends React.Component {
  constructor(props) {
    super(props);

    // Set initial state
    this.state = {
      dateStart: "",
      dateEnd: "",
      stock: [""],
      pieLabels: [],
      pieData: [],
      expectedReturn: "",
      expectedRisk: "",
      showTable: false,
      cov: [],
      covStock: [""],
      inputRisk: 0,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // handleChangeNumber(event) {
  //   this.setState({ number: event.target.value });
  //   console.log(this.state.number);
  // }
  handleChangeStock(i, e, value) {
    console.log(i, value);
    let newStock = this.state.stock;
    newStock[i] = value;
    this.setState({ stock: newStock });
    console.log(newStock[i]);
  }
  handleChangeDateStart(e) {
    // let stock = this.state.stock;
    // stock[i][e.target.name] = e.target.value;
    this.setState({ dateStart: e });
    console.log(this.state.dateStart);
  }
  handleChangeDateEnd(e) {
    // let stock = this.state.stock;
    // stock[i][e.target.name] = e.target.value;
    this.setState({ dateEnd: e });
    console.log(this.state.dateEnd);
  }
  addStock() {
    this.setState({ stock: [...this.state.stock, ""] });
  }
  removeStock(i) {
    var newStock = this.state.stock;
    newStock.splice(i, 1);
    this.setState({ stock: newStock });
  }
  handleSubmit(event) {
    event.preventDefault();
    // alert(JSON.stringify(this.state.stock));
    console.log(JSON.stringify(this.state.stock));
    axios
      .post("http://127.0.0.1:8000/result", {
        risk: this.state.inputRisk,
        stock: this.state.stock,
        dateStart: this.state.dateStart,
        dateEnd: this.state.dateEnd,
      })
      .then((res) => {
        console.log(res.data);
        let arr = res.data[0];
        console.log("return", res.data[1]);
        console.log("risk", res.data[2]);

        var tempLabels = [],
          tempData = [];
        console.log("res.data.length:", res.data.length);
        for (let i = 0; i < arr.length; i++) {
          let tempArr = arr[i];
          console.log("tempArr: ", tempArr);
          // let splitArr = tempArr.split(":");
          tempLabels.push(tempArr.split(":")[0]);
          tempData.push(parseFloat(tempArr.split(":")[1]));
        }
        this.setState({ pieLabels: tempLabels });
        this.setState({ pieData: tempData });
        this.setState({ expectedReturn: res.data[1] });
        this.setState({ expectedRisk: res.data[2] });
        this.setState({ cov: res.data[3] });
        this.setState({ covStock: this.state.stock });
        this.setState({ showTable: true });
        console.log("pieData", this.state.pieData);
        console.log("cov", this.state.cov);
        // console.log(this.state.pieLabels);
        // console.log(this.state.pieData);
      })
      .catch((err) => {
        console.log(err);
      });
  }
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
      <>
        <Box sx={{ flexGrow: 1 }} class="box-padding">
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start"
                  views={["year", "month"]}
                  minDate={new Date("2015-01-01")}
                  maxDate={new Date("2021-08-01")}
                  value={this.state.dateStart}
                  onChange={(e) => this.handleChangeDateStart(e)}
                  // onchange={this.setState({date: this.state.date})}
                  renderInput={(params) => (
                    <TextField {...params} helperText={null} />
                  )}
                />
                <Text style={styles.titleText}>to</Text>
                <DatePicker
                  label="End"
                  views={["year", "month"]}
                  minDate={new Date("2015-02-01")}
                  maxDate={new Date("2021-09-01")}
                  value={this.state.dateEnd}
                  onChange={(e) => this.handleChangeDateEnd(e)}
                  // onchange={this.setState({date: this.state.date})}
                  renderInput={(params) => (
                    <TextField {...params} helperText={null} />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="outlined-basic"
                label="Accepted Risk"
                variant="outlined"
                helperText="The value must be a number"
                onChange={(e) => this.setState({inputRisk: e.target.value})}
              />
            </Grid>
              <form
                class="show-form"
                // sx={{ m: 1, width: 300 }}
                onSubmit={this.handleSubmit}
              >
                {this.state.stock.map((element, index) => (
                  <div key={index}>
                    <FormControl sx={{ m: 0.5, width: 200 }}>
                      <Autocomplete
                        options={stockData}
                        renderInput={(params) => (
                          <TextField {...params} label="Stock" />
                        )}
                        value={this.state.stock[index]}
                        onChange={(e, value) =>
                          this.handleChangeStock(index, e, value)
                        }
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1 }}>
                      {index ? (
                        <button
                          type="button"
                          className="button remove"
                          onClick={() => this.removeStock(index)}
                        >
                          Remove
                        </button>
                      ) : null}
                    </FormControl>
                  </div>
                ))}
                <div className="button-section">
                  <button
                    className="button add"
                    type="button"
                    onClick={() => this.addStock()}
                  >
                    Add
                  </button>
                  <button className="button submit" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            <div class="show-pie">
              <Pie 
                // data={this.pie}
                data={{
                  labels: this.state.pieLabels,
                  datasets: [
                    {
                      // label: "Portfolio",
                      backgroundColor: [
                        '#ff6384',
                        '#36a2eb',
                        '#cc65fe',
                        '#ffce56',
                        "#B21F00",
                        "#C9DE00",
                        "#2FDE00",
                        "#00A6B4",
                        "#6800B4",
                      ],
                      data: this.state.pieData,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    datalabels: {
                      borderColor: "white",
                      borderRadius: 25,
                      borderWidth: 3,
                      color: "white",
                      font: {
                        weight: "bold",
                      },
                      padding: 6,
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
            {this.state.showTable && (
              <TableContainer component={Paper} class="show-table">
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Covariance Of Expected Return</TableCell>
                      {this.state.covStock.map((stock) => (
                        <TableCell
                          key={stock}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          align="right"
                        >
                          {stock}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.covStock.map((stock, index) => (
                      <TableRow
                        key={stock}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {stock}
                        </TableCell>
                        {this.state.cov.map((covArr) => (
                          <TableCell key={covArr} align="right">
                            {covArr[index]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={1}>
                        Expected Return Of Portfolio
                      </TableCell>
                      <TableCell align="right">
                        {this.state.expectedReturn}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={1}>
                        Standard Deviation Of Portfolio
                      </TableCell>
                      <TableCell align="right">
                        {this.state.expectedRisk}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Box>
      </>
    );
  }
}
const stockData = [
  "0003.香港中華煤氣",
  "0012.恆基地產",
  "2382.舜宇光學科技",
  "0066.港鐵公司",
  "0001.長和",
  "0388.香港交易所",
  "0700.騰訊控股",
  "3968.招商銀行",
  "0002.中電控股",
  "0011.恆生銀行",
];
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
export default Portfolio;
