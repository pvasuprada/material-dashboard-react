import { forwardRef } from "react";
import PropTypes from "prop-types";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTheme } from "@mui/material/styles";
import MDBox from "components/MDBox";
import dayjs from "dayjs";

const MDDateRangePicker = forwardRef(
  (
    {
      size = "medium",
      startLabel = "Start",
      endLabel = "End",
      startDate,
      endDate,
      onStartDateChange,
      onEndDateChange,
      color = "info",
      sx,
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();

    const customStyles = {
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: theme.palette[color].main,
          borderWidth: 1,
        },
        "&:hover fieldset": {
          borderColor: theme.palette[color].main,
          borderWidth: 2,
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette[color].main,
        },
      },
      "& .MuiInputLabel-root": {
        color: theme.palette[color].main,
        "&.Mui-focused": {
          color: theme.palette[color].main,
        },
      },
      "& .MuiSvgIcon-root": {
        color: theme.palette[color].main,
      },
      ...sx,
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MDBox display="flex" gap={2}>
          <DatePicker
            ref={ref}
            label={startLabel}
            value={startDate}
            onChange={onStartDateChange}
            maxDate={endDate}
            slotProps={{
              textField: {
                size: size,
                sx: customStyles,
                fullWidth: true,
              },
            }}
            {...rest}
          />
          <DatePicker
            label={endLabel}
            value={endDate}
            onChange={onEndDateChange}
            minDate={startDate}
            slotProps={{
              textField: {
                size: size,
                sx: customStyles,
                fullWidth: true,
              },
            }}
            {...rest}
          />
        </MDBox>
      </LocalizationProvider>
    );
  }
);

MDDateRangePicker.displayName = "MDDateRangePicker";

MDDateRangePicker.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  startLabel: PropTypes.string,
  endLabel: PropTypes.string,
  startDate: PropTypes.any,
  endDate: PropTypes.any,
  onStartDateChange: PropTypes.func,
  onEndDateChange: PropTypes.func,
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
    "white",
  ]),
  sx: PropTypes.object,
};

export default MDDateRangePicker;
