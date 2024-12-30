import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import Theme from "./theme";
import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			{/* <React.StrictMode> */}
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<CssVarsProvider theme={Theme}>
					<CssBaseline />
					<App />
				</CssVarsProvider>
			</LocalizationProvider>
			{/* </React.StrictMode> */}
		</PersistGate>
	</Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
