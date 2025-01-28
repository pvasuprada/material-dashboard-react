const textField = {
  styleOverrides: {
    root: ({ theme }) => ({
      "& .MuiInputBase-input": {
        color: theme.palette.light.text,
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
