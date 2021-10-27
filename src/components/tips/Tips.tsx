import * as React from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Margin } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import i18n from "../../locales/i18n";

const steps = [
  {
    label: i18n.t("98"),
    description: i18n.t("99"),
  },
  {
    label: i18n.t("98"),
    description: i18n.t("100"),
  },
  {
    label: i18n.t("101"),
    description: i18n.t("102"),
  },
  {
    label: i18n.t("103"),
    description: i18n.t("104"),
  },
];

export default function Tips() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ maxWidth: "100%", flexGrow: 1 }}>
      <Paper
        square
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          height: 40,
          pl: 2,
          bgcolor: "transparent",
          borderRadius: "12px",
          width: "100%",
        }}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
          {steps[activeStep].label}
        </Typography>
      </Paper>
      <Box
        sx={{ height: 140, maxWidth: "100%", width: "100%", p: 2 }}
        className="tips-box"
        // marginTop= '-12px'
      >
        {steps[activeStep].description}
      </Box>
      <MobileStepper
        className="tips-selector"
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        sx={{ borderRadius: "12px", height: 40 }}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            {t("67")}
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            {t("68")}
          </Button>
        }
      />
    </Box>
  );
}
