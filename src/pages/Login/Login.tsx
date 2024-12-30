import React, { useState } from "react";
import { Formik, Field, Form, FormikProps } from "formik";
import {
	Alert,
	Box,
	Button,
	IconButton,
	InputAdornment,
	Stack,
	TextField,
} from "@mui/material";
import { LoginForm } from "./Login.types";
import {
	LockOutlined,
	PersonOutline,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthApi, SelfApi } from "../../services";
import { setHeaderConfigAxios } from "../../services/config";
import { setCredentials, setUserInfo } from "../../redux/reducers";
import { LoadingButton } from "@mui/lab";
import { setCBHeaderConfigAxios } from "../../services/config/content-based-config";
import { setCFHeaderConfigAxios } from "../../services/config/collaborative-filtering-config";

const Login: React.FC = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [error, setError] = useState(false);
	const dispatch = useDispatch();

	const handleSubmitForm = async (
		values: LoginForm,
		{ resetForm }: { resetForm: () => void }
	) => {
		try {
			setLoading(true);
			const response = await AuthApi.login(values);
			if (response && response.data && response.data.access_token) {
				setHeaderConfigAxios(response.data.access_token);
				setCBHeaderConfigAxios(response.data.access_token);
				setCFHeaderConfigAxios(response.data.access_token);
				const userInfo = await SelfApi.getMe();
				if (userInfo.data?.role?.type === "USER") {
					dispatch(setCredentials(response.data));
					dispatch(setUserInfo(userInfo.data));
					navigate("/home-page", { replace: true });
				} else {
					navigate("/", { replace: true });
				}
			}
		} catch (err) {
			setError(true);
		} finally {
			setLoading(false);
			resetForm();
			setShowPassword(false);
		}
	};

	const handleTogglePasswordVisibility = () => {
		setShowPassword((showPassword) => !showPassword);
	};

	return (
		<Box className={styles["login-container"]}>
			<Box className={styles["login-wrapper"]}>
				<h1 className={styles["login-title"]}>Book Recommender</h1>
				<Formik
					initialValues={{
						email: "",
						password: "",
						deviceId: "device-id",
					}}
					onSubmit={handleSubmitForm}
					validateOnBlur={true}
					validateOnChange={false}
				>
					{(formProps: FormikProps<any>) => (
						<Form
							onSubmit={formProps.handleSubmit}
							className={styles["login-form"]}
						>
							{error && (
								<Alert
									className={styles["login-alert-message"]}
									severity="error"
								>
									Login failed! Incorrect username or password
								</Alert>
							)}
							<Stack spacing={2} width={"60vw"} minWidth={100} maxWidth={450}>
								<Field
									as={TextField}
									className="login-textfield"
									error={
										formProps.touched.email && Boolean(formProps.errors.email)
									}
									helperText={formProps.touched.email && formProps.errors.email}
									fullWidth
									id="email-login"
									label="Email"
									name="email"
									placeholder="Email address"
									type="email"
									variant="outlined"
									onChange={formProps.handleChange}
									value={formProps.values.email}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<PersonOutline />
											</InputAdornment>
										),
									}}
								/>
							</Stack>
							<Stack spacing={2} width={"60vw"} minWidth={100} maxWidth={450}>
								<Field
									as={TextField}
									className="login-textfield"
									error={
										formProps.touched.password &&
										Boolean(formProps.errors.password)
									}
									helperText={
										formProps.touched.password && formProps.errors.password
									}
									fullWidth
									id="password-login"
									label="Password"
									name="password"
									placeholder="Password"
									type={showPassword ? "text" : "password"}
									variant="outlined"
									onChange={formProps.handleChange}
									value={formProps.values.password}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<LockOutlined />
											</InputAdornment>
										),

										endAdornment: (
											<InputAdornment position="end">
												<IconButton onClick={handleTogglePasswordVisibility}>
													{showPassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
							</Stack>
							<Stack spacing={2} width={"60vw"} minWidth={100} maxWidth={450}>
								<LoadingButton
									className={styles["submit-login-btn"]}
									size="large"
									type="submit"
									variant="contained"
									loading={loading}
								>
									Login
								</LoadingButton>
								<Link to={"../sign-up"} style={{ color: "black" }}>
									<Button
										className={styles["submit-signup-btn"]}
										size="large"
										variant="contained"
										disabled={loading}
									>
										Sign up
									</Button>
								</Link>
							</Stack>
						</Form>
					)}
				</Formik>
			</Box>
		</Box>
	);
};

export default Login;
