import React, { Suspense, useEffect, useState } from "react";
import "./App.css";
import { Box, ThemeProvider } from "@mui/material";
import { store } from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setHeaderConfigAxios } from "./services/config";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { GlobalStyle } from "./styles/GlobalStyle";
import Theme from "./theme";
import { setCBHeaderConfigAxios } from "./services/config/content-based-config";
import { setCFHeaderConfigAxios } from "./services/config/collaborative-filtering-config";

function App() {
	const [loading, setLoading] = useState(true);
	const accessToken = store.getState().auth.accessToken;

	useEffect(() => {
		if (accessToken) {
			setHeaderConfigAxios(accessToken);
			setCBHeaderConfigAxios(accessToken);
			setCFHeaderConfigAxios(accessToken);
		}
		setLoading(false);
	}, [accessToken]);

	if (loading) return <></>;

	return (
		<Box>
			<Suspense fallback={<>Loading...</>}>
				<ThemeProvider theme={Theme}>
					<GlobalStyle>
						<ToastContainer
							style={{ fontSize: "15px" }}
							autoClose={2000}
							draggable
						/>
						<RouterProvider router={router}></RouterProvider>
					</GlobalStyle>
				</ThemeProvider>
			</Suspense>
		</Box>
	);
}

export default App;
