
import "./App.css";
import * as React from "react";
import TextField from "@mui/material/TextField";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

class ShowTable extends React.Component {
  render() {
    return (
      <TableContainer component={Paper} class="show-table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Covariance Of Historical Return</TableCell>
              {this.props.stockLabel.map((stock) => (
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
            {this.props.stockLabel.map((stock, index) => (
              <TableRow
                key={stock}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {stock}
                </TableCell>
                {this.props.changeCov.map((covArr, covIndex) => (
                  <TableCell key={covIndex} align="right">
                    <TextField
                      // label={covArr[index]}
                      // autoFocus='true'
                      outlined="true"
                      value={this.props.changeCov[covIndex][index]}
                      // defaultValue={covArr[index]}
                      onChange={(e) =>
                        this.props.handleChangeCov(e.target.value, covIndex, index)
                      }
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={1}>Expected Return Of Stock</TableCell>
              {this.props.stockLabel.map((stock, index) => (
                <TableCell key={stock} align="right">
                  {/* {covArr[index]} */}

                  <TextField
                    // label={covArr[index]}
                    variant="outlined"
                    value={this.props.changeMean[index]}
                    // defaultValue={this.state.mean[index]}
                    onChange={(e) =>
                      this.props.handleChangeMean(e.target.value, index)
                    }
                  />
                </TableCell>
              ))}
            </TableRow>

            <TableRow>
              <TableCell colSpan={this.props.numOfStocks + 1} align="right">
                <button
                  className="button-return"
                  type="button"
                  onClick={() => this.props.returnToDefault()}
                >
                  Return To Default
                </button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={1}>Expected Return Of Portfolio</TableCell>
              <TableCell align="right">{this.props.expectedReturn}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={1}>Standard Deviation Of Portfolio</TableCell>
              <TableCell align="right">{this.props.expectedRisk}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default ShowTable;
