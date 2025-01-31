import MDButton from "components/MDButton";
import { styled } from "@mui/material/styles";

const MDButtonSmall = styled(MDButton)({
  padding: "4px 16px",
  fontSize: "0.75rem",
  fontWeight: "medium",
  textTransform: "capitalize",
  minHeight: "28px",
  borderRadius: "8px",
  "&:hover": {
    transform: "translateY(-1px)",
    transition: "transform 0.2s",
  },
});

export default MDButtonSmall;
