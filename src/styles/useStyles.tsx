import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  flexGrow: {
    flex: "1",
  },
  toggleButton: {
    backgroundColor: "#F3C18E",
    color: "#000",
    "&:hover": {
      backgroundColor: "#e6b486",
      color: "#000",
    },
  },
});
