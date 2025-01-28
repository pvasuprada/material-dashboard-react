/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React Base Styles
import colors from "assets/theme-dark/base/colors";

const { transparent } = colors;

const textField = {
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: transparent.main,
      "& .MuiInputBase-input": {
        color: theme.palette.dark.text,
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: theme.palette.divider,
        },
        "&:hover fieldset": {
          borderColor: theme.palette.info.main,
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette.info.main,
        },
      },
    }),
  },
};

export default textField;
