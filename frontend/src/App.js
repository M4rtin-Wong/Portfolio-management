// import logo from "./logo.svg";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import ShowTable from "./ShowTable";
import DatePick from "./DatePick";
import PieChart from "./PieChart";
import "./App.css";
import * as React from "react";
import Box from "@mui/material/Box";
import { Text, StyleSheet } from "react-native";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "axios";

import CircularProgress from "@mui/material/CircularProgress";

Chart.register(ChartDataLabels, ArcElement, Tooltip, Legend);

class Portfolio extends React.Component {
  constructor() {
    super();

    // Set initial state
    this.state = {
      oldLabel: "",
      newLabel: "",
      numOfStocks: 0,
      dateStart: "",
      dateEnd: "",
      stock: [""],
      pieLabels: [],
      pieData: [],
      expectedReturn: "",
      expectedRisk: "",
      showTable: false,
      isSubmitted: false,
      cov: [],
      stockLabel: [""],
      changeCov: [],
      mean: [],
      changeMean: [],
      inputRisk: 0,
      inputCash: 0,

      errorOccured: false,
      errorRisk: false,
      errorStock: false,
      errorCovOrReturn: false,
    };
    // this.returnToDefault = this.returnToDefault.bind(this);
    this.handleChangeDateStart = this.handleChangeDateStart.bind(this);
    this.handleChangeDateEnd = this.handleChangeDateEnd.bind(this);
    this.handleChangeCov = this.handleChangeCov.bind(this);
    this.handleChangeMean = this.handleChangeMean.bind(this);
    this.returnToDefault = this.returnToDefault.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.DateSnackbarOpen = this.DateSnackbarOpen.bind(this);
    this.DateSnackbarClose = this.DateSnackbarClose.bind(this);
    this.RiskSnackbarOpen = this.RiskSnackbarOpen.bind(this);
    this.RiskSnackbarClose = this.RiskSnackbarClose.bind(this);
    this.StockSnackbarOpen = this.StockSnackbarOpen.bind(this);
    this.StockSnackbarClose = this.StockSnackbarClose.bind(this);
    this.CovOrReturnSnackbarOpen = this.CovOrReturnSnackbarOpen.bind(this);
    this.CovOrReturnSnackbarClose = this.CovOrReturnSnackbarClose.bind(this);
  }

  handleChangeCov(value, covIndex, index) {
    console.log(value, covIndex, index);
    let oldCov = [];
    // use ths method to clone an array of objects.
    // otherwise, you will make a reference copy and will affect the second array.
    this.state.changeCov.forEach((val) => oldCov.push(Object.assign([], val)));
    // oldCov[covIndex][index] = parseFloat(value);
    // oldCov[index][covIndex] = parseFloat(value);
    oldCov[covIndex][index] = value;
    oldCov[index][covIndex] = value;

    this.setState({ changeCov: oldCov });
    console.log("this.state.changeCov", this.state.changeCov);
  }
  handleChangeMean(value, index) {
    console.log(value, index);
    let changeMean = [...this.state.changeMean];
    changeMean[index] = value;
    this.setState({ changeMean });
    console.log("this.state.changeMean", this.state.changeMean);
  }

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
  returnToDefault() {
    console.log("cov", this.state.cov);
    console.log("mean", this.state.mean);
    // this.setState({stock: this.state.stock});
    this.setState({ changeCov: this.state.cov });
    this.setState({ changeMean: this.state.mean });
    console.log("changeCov", this.state.changeCov);
    console.log("changeMena", this.state.changeMean);
  }
  handleSubmit(event) {
    event.preventDefault();
    // alert(JSON.stringify(this.state.stock));
    console.log(JSON.stringify(this.state.stock));
    // this.state.changeCov = parseFloat(this.state.changeCov);
    // console.log("float cov",this.state.changeCov);
    // changeCov[index][covIndex] = parseFloat(value);
    this.setState({ isSubmitted: true });
    if (this.state.dateStart == "" || this.state.dateEnd == "") {
      this.DateSnackbarOpen();
      this.setState({ isSubmitted: false });
    }
    if (isNaN(this.state.inputRisk) ||this.state.inputRisk == 0 || this.state.inputRisk < 0 ||this.state.inputRisk > 1 ){
      this.RiskSnackbarOpen();
      this.setState({ isSubmitted: false });
    }
    if(this.state.stock.includes("") ){
      this.StockSnackbarOpen();
      this.setState({ isSubmitted: false });
    }
    for (let arr = 0; arr < this.state.changeCov.length; arr++){
      for (let item = 0; item < this.state.changeCov[arr].length; item++){
        if(!isNaN(this.state.changeCov[arr][item])){
          this.state.changeCov[arr][item] = parseFloat(this.state.changeCov[arr][item])
        }
        else{
          this.CovOrReturnSnackbarOpen();
          this.setState({ isSubmitted: false });
        }
      }
      // this.state.changeCov[arr] = parseFloat(this.state.changeCov[arr])
    }

    for (let item = 0; item < this.state.changeMean.length; item++){
      if(!isNaN(this.state.changeMean[item])){
        this.state.changeMean[item] = parseFloat(this.state.changeMean[item])
      }
      else{
        this.CovOrReturnSnackbarOpen();
        this.setState({ isSubmitted: false });
      }
    }

    console.log("this.state.changeCov:",this.state.changeCov)
    console.log("this.state.changemean:",this.state.changeMean)
    
    axios
      .post("http://127.0.0.1:8000/result", {
        cash: this.state.inputCash,
        risk: this.state.inputRisk,
        stock: this.state.stock,
        dateStart: this.state.dateStart,
        dateEnd: this.state.dateEnd,
        changedCov: this.state.changeCov,
        changedMean: this.state.changeMean,
        label: this.state.oldLabel,
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
        this.setState({ oldLabel: res.data[8] });
        this.setState({ numOfStocks: res.data[7] });
        this.setState({ pieLabels: tempLabels });
        this.setState({ pieData: tempData });
        this.setState({ expectedReturn: res.data[1] });
        this.setState({ expectedRisk: res.data[2] });
        this.setState({ cov: res.data[5] });
        // this.setState({ stockLabel: this.state.stock });
        this.setState({ stockLabel: tempLabels });
        this.setState({ changeCov: res.data[3] });
        this.setState({ mean: res.data[6] });
        this.setState({ changeMean: res.data[4] });
        this.setState({ showTable: true });
        this.setState({ isSubmitted: false });
        console.log("pieData", this.state.pieData);
        console.log("cov", this.state.cov);
        console.log("mean", this.state.mean);
        console.log("numberOfStocks", this.state.numOfStocks);
        // console.log(this.state.pieLabels);
        // console.log(this.state.pieData);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  DateSnackbarOpen() {
    this.setState({ errorDate: true });
  }
  DateSnackbarClose() {
    this.setState({ errorDate: false });
  }

  RiskSnackbarOpen() {
    this.setState({ errorRisk: true });
  }
  RiskSnackbarClose() {
    this.setState({ errorRisk: false });
  }
  

  StockSnackbarOpen() {
    this.setState({ errorStock: true });
  }
  StockSnackbarClose() {
    this.setState({ errorStock: false });
  }

  CovOrReturnSnackbarOpen() {
    this.setState({ errorCovOrReturn: true });
  }
  CovOrReturnSnackbarClose() {
    this.setState({ errorCovOrReturn: false });
  }

  render() {
    return (
      <>
        <Box sx={{ flexGrow: 1 }} class="box-padding">
          <Snackbar
            sx={{ height: "100%" }}
            open={this.state.errorDate}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            autoHideDuration={6000}
            onClose={this.DateSnackbarClose}
          >
            <Alert
              onClose={this.DateSnackbarClose}
              severity="warning"
              sx={{ width: "100%" }}
            >
              Please select a valid date!
            </Alert>
          </Snackbar>

          <Snackbar
            sx={{ height: "100%" }}
            open={this.state.errorRisk}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            autoHideDuration={6000}
            onClose={this.RiskSnackbarClose}
          >
            <Alert
              onClose={this.RiskSnackbarClose}
              severity="warning"
              sx={{ width: "100%" }}
            >
              Please input a valid accepted risk! Risk should between 0 and 1.
            </Alert>
          </Snackbar>
          

          <Snackbar
            sx={{ height: "100%" }}
            open={this.state.errorStock}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            autoHideDuration={6000}
            onClose={this.StockSnackbarClose}
          >
            <Alert
              onClose={this.StockSnackbarClose}
              severity="warning"
              sx={{ width: "100%" }}
            >
              Please select a valid stock! Make sure the stock is not empty!
            </Alert>
          </Snackbar>
          
          <Snackbar
            sx={{ height: "100%" }}
            open={this.state.errorCovOrReturn}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            autoHideDuration={6000}
            onClose={this.CovOrReturnSnackbarClose}
          >
            <Alert
              onClose={this.CovOrReturnSnackbarClose}
              severity="warning"
              sx={{ width: "100%" }}
            >
              Please input valid covariance or expected return! Covariance and Expected return must be numbers!
            </Alert>
          </Snackbar>

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <DatePick
                handleChangeDateStart={this.handleChangeDateStart}
                handleChangeDateEnd={this.handleChangeDateEnd}
                dateStart={this.state.dateStart}
                dateEnd={this.state.dateEnd}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="outlined-basic"
                label="Accepted Risk"
                variant="outlined"
                helperText="The value must be a number"
                onChange={(e) => this.setState({ inputRisk: e.target.value })}
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
                      autoHighlight
                      // getOptionLabel={(option) => option.label}
                      groupBy={(option) => option.industry}
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
              <PieChart
                pieLabels={this.state.pieLabels}
                pieData={this.state.pieData}
              />
            </div>

            {this.state.isSubmitted && (
              <div>
                <CircularProgress class="progress" size={"7%"} />
              </div>
            )}

            {this.state.showTable && (
              <ShowTable
                stock={this.state.stock}
                stockLabel={this.state.stockLabel}
                handleChangeCov={this.handleChangeCov}
                changeCov={this.state.changeCov}
                changeMean={this.state.changeMean}
                handleChangeMean={this.handleChangeMean}
                numOfStocks={this.state.numOfStocks}
                returnToDefault={this.returnToDefault}
                expectedReturn={this.state.expectedReturn}
                expectedRisk={this.state.expectedRisk}
              />
            )}
          </Grid>
        </Box>
      </>
    );
  }
}
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const stockData = [
  { industry: "燃氣供應", label: "0003.香港中華煤氣" ,lot:1000},
  { industry: "燃氣供應", label: "2688.新奧能源", lot: 100},
  { industry: "燃氣供應", label: "0384.中國燃氣", lot: 200},

  { industry: "地產發展商", label: "0012.恆基地產", lot: 1000},
  // { industry: "地產發展商", label: "0960.龍湖集團", lot: 500},
  { industry: "地產發展商", label: "1109.華潤置地", lot: 2000},
  { industry: "地產發展商", label: "0016.新鴻基地產", lot: 500},

  { industry: "電子零件", label: "2382.舜宇光學科技", lot: 100},
  { industry: "電子零件", label: "2018.瑞聲科技", lot: 500},

  { industry: "公共運輸", label: "0066.港鐵公司", lot: 500},
  { industry: "公共運輸", label: "0525.廣深鐵路股份", lot: 2000},

  { industry: "綜合企業", label: "0001.長和", lot: 500},

  { industry: "其他金融", label: "0388.香港交易所", lot: 100},

  { industry: "汽車", label: "1211.比亞迪股份", lot: 500},

  { industry: "電子商貿及互聯網服務", label: "0700.騰訊控股", lot: 100},
  { industry: "電子商貿及互聯網服務", label: "1137.香港科技探索", lot: 1000},

  { industry: "銀行", label: "3968.招商銀行", lot: 500},
  { industry: "銀行", label: "0011.恆生銀行", lot: 100},
  { industry: "銀行", label: "1398.工商銀行", lot: 1000},
  { industry: "銀行", label: "0939.建設銀行", lot: 1000},
  { industry: "銀行", label: "2388.中銀香港", lot: 500},

  { industry: "電力", label: "0002.中電控股", lot: 500},
  { industry: "電力", label: "1038.長江基建集團", lot: 500},
  { industry: "電力", label: "0006.電能實業", lot: 500},

  { industry: "半導體", label: "0522.ASM太平洋", lot: 100},
  { industry: "半導體", label: "1385.上海復旦", lot: 2000},
  { industry: "半導體", label: "0981.中芯國際", lot: 500},
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
