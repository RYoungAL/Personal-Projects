import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

import {
  Grid,
  TextField,
  Button,
  Card,
  ThemeProvider,
  responsiveFontSizes,
  createTheme,
  Box,
  Alert,
} from "@mui/material";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import AirIcon from "@mui/icons-material/Air";
import CloudIcon from "@mui/icons-material/Cloud";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#0a28e2",
    },
    secondary: {
      main: "#f50057",
    },
    info: {
      main: "#2196f3",
    },
  },
  typography: {
    fontSize: 25,
  },
});

// Api key for weather API
const API_key = "70f4c5e1740e4c6e9bb62445220905";

export async function getStaticProps() {
  const apiFetch = await fetch(`https://countriesnow.space/api/v0.1/countries`);
  const response = await apiFetch.json();
  response.data.map((data) => {
    console.log(data.cities[0]);
  });

  return {
    props: {},
  };
}

export default function Home() {
  // states to transfer the data from the API to the components that will be displayed
  const [inputName, setInputName] = useState("");

  const [name, setName] = useState("");
  const [region, setRegion] = useState("");

  // temperatures
  const [temp, setTemp] = useState("");
  const [condition, setCon] = useState("");
  const [icon, setIcon] = useState("");
  const [minTemp, setMin] = useState("");
  const [maxTemp, setMax] = useState("");

  // wind
  const [windSpeed, setWind] = useState("");
  const [gustSpeed, setGust] = useState("");
  const [windDir, setDir] = useState("");

  // rain
  const [rainChance, setRainChance] = useState("");
  const [rain, setRain] = useState("");
  const [humidity, setHumidity] = useState("");

  // astro
  const [sunrise, setRise] = useState("");
  const [sunset, setSet] = useState("");

  // load cities
  const [data, setData] = useState("");

  // method to get all data from the API from the inputted city
  const findCity = async () => {
    try {
      const apiCall = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${API_key}&q=${inputName}&days=1&aqi=no&alerts=no`
      );
      const response = await apiCall.json();

      // using state to set all the variables to data retrieved from the API
      setName(response.location.name);
      setRegion(response.location.region);

      // Temperature
      setTemp(response.current.temp_c);
      setCon(response.current.condition.text);
      setIcon(response.current.condition.icon);
      setMin(response.forecast.forecastday[0].day.mintemp_c);
      setMax(response.forecast.forecastday[0].day.maxtemp_c);

      // Wind
      setWind(response.current.wind_kph);
      setGust(response.current.gust_kph);
      setDir(response.current.wind_dir);

      // Rain
      setRain(response.forecast.forecastday[0].day.totalprecip_mm);
      setRainChance(response.forecast.forecastday[0].day.daily_chance_of_rain);
      setHumidity(response.forecast.forecastday[0].day.avghumidity);

      // Astro
      setRise(response.forecast.forecastday[0].astro.sunrise);
      setSet(response.forecast.forecastday[0].astro.sunset);
      console.log(response);
    } catch {
      alert("Please enter a valid city");
    }
  };

  return (
    // the input controls
    <ThemeProvider theme={responsiveFontSizes(theme)}>
      <Grid container className={styles.main}>
        <Alert
          id="alertID"
          severity="error"
          variant="filled"
          sx={{
            visibility: "hidden",
            height: "10px",
            width: "400px",
          }}
        >
          Please enter a valid city name.
        </Alert>
        <TextField
          className={styles.input}
          sx={{
            paddingTop: "20px",
            backgroundColor: "transparent",
          }}
          id="cityName"
          label="City name"
          variant="standard"
          value={inputName}
          onChange={(e) => {
            setInputName(e.target.value);
          }}
        />

        <Button
          variant="contained"
          onClick={findCity}
          sx={{ mb: "2rem", mt: "2rem" }}
        >
          Get Weather
        </Button>

        {/* Output */}
        {temp !== "" ? (
          <Card varient="outlined" className={styles["grid-container"]}>
            <Box className={styles.name}>
              <h3>
                {name}, {region}
              </h3>
            </Box>

            <Box className={styles["astro-rise"]}>
              <WbSunnyIcon /> - {sunrise}
            </Box>
            <Box className={styles["astro-set"]}>
              <DarkModeIcon /> - {sunset}
            </Box>

            <Box className={styles.temp}>
              {temp}° C <DeviceThermostatIcon />
            </Box>
            <Box className={styles.condition}>{condition}</Box>

            <Box className={styles.minmax}>
              {minTemp} / {maxTemp}
            </Box>

            <br />

            <Box className={styles.rain}>
              <h4>
                Rain <CloudIcon />
              </h4>
              <div>Rain amount is {rain} mm</div>
              <div>Rain chance is {rainChance} %</div>
              <div>Humidity is {humidity} %</div>
            </Box>

            <Box className={styles.wind}>
              <h4>
                Wind <AirIcon />
              </h4>
              <Box>
                Speed is {windSpeed} km/h {windDir}
              </Box>
              <Box>
                Gusts are {gustSpeed} km/h {windDir}
                <br />
                &nbsp;
              </Box>
            </Box>
          </Card>
        ) : null}
      </Grid>
    </ThemeProvider>
  );
}
