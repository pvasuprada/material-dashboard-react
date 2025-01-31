import { forwardRef } from "react";
import PropTypes from "prop-types";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";

const MDAutocomplete = forwardRef(
  ({ size = "medium", label, options, value, onChange, color = "info", sx, ...rest }, ref) => {
    const theme = useTheme();

    const customStyles = {
      "& .MuiOutlinedInput-root": {
        color: theme.palette[color].main,
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
        "& input": {
          color: theme.palette[color].main,
        },
      },
      "& .MuiInputLabel-root": {
        color: theme.palette[color].main,
        "&.Mui-focused": {
          color: theme.palette[color].main,
        },
      },
      "& .MuiAutocomplete-clearIndicator": {
        color: theme.palette[color].main,
      },
      "& .MuiAutocomplete-popupIndicator": {
        color: theme.palette[color].main,
      },
      "& .MuiInputBase-input": {
        color: theme.palette[color].main,
      },
      "& .MuiAutocomplete-endAdornment": {
        color: theme.palette[color].main,
      },
      ...sx,
    };

    return (
      <Autocomplete
        ref={ref}
        size={size}
        options={options}
        value={value}
        onChange={onChange}
        renderInput={(params) => (
          <TextField {...params} label={label} variant="outlined" sx={customStyles} />
        )}
        {...rest}
      />
    );
  }
);

MDAutocomplete.displayName = "MDAutocomplete";

MDAutocomplete.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
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

export default MDAutocomplete;
