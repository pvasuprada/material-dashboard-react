import { useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

function Filter() {
  return (
    <MDBox>
      <MDTypography variant="h6" gutterBottom>
        Filter Options
      </MDTypography>
      {/* Add your filter options here */}
    </MDBox>
  );
}

export default Filter;
