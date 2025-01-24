import { forwardRef } from "react";
import PropTypes from "prop-types";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTheme } from "@mui/material/styles";

const MDDatePicker = forwardRef(
  ({ size = "medium", label, value, onChange, color = "info", sx, ...rest }, ref) => {
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
        <DatePicker
          ref={ref}
          label={label}
          value={value}
          onChange={onChange}
          slotProps={{
            textField: {
              size: size,
              sx: customStyles,
            },
          }}
          {...rest}
        />
      </LocalizationProvider>
    );
  }
);

MDDatePicker.displayName = "MDDatePicker";

MDDatePicker.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
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

export default MDDatePicker;
