import React, { useState } from "react";
import { Formik, Field, Form, FormikProps } from "formik";
import {
	Alert,
	Box,
	Button,
	IconButton,
	InputAdornment,
	MenuItem,
	Select,
	Stack,
	TextField,
} from "@mui/material";
import {
	Badge,
	LockOutlined,
	PersonOutline,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthApi, SelfApi } from "../../services";
import { setHeaderConfigAxios } from "../../services/config";
import { setCredentials, setUserInfo } from "../../redux/reducers";
import { LoadingButton } from "@mui/lab";
import styles from "./SignUp.module.css";
import { SignUpForm } from "./SignUp.types";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { setCBHeaderConfigAxios } from "../../services/config/content-based-config";
import { setCFHeaderConfigAxios } from "../../services/config/collaborative-filtering-config";

const SignUp: React.FC = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [error, setError] = useState(false);
	const dispatch = useDispatch();

	const disableToday = (date: any) => {
		return dayjs(date).isSame(dayjs().startOf("day"));
	};

	const handleSubmitForm = async (
		values: SignUpForm,
		{ resetForm }: { resetForm: () => void }
	) => {
		try {
			const signUpData = {
				user: {
					name: values.name,
					country: values.country,
					email: values.email,
					dob: values.dob,
					gender: values.gender,
					roleId: 2,
					password: values.password,
				},
				deviceId: values.deviceId,
			};
			setLoading(true);
			const response = await AuthApi.signup(signUpData);
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
		<Box className={styles["signup-container"]}>
			<Box className={styles["signup-wrapper"]}>
				<h1 className={styles["signup-title"]}>Book Recommender</h1>
				<Formik
					initialValues={{
						name: "",
						country: "",
						email: "",
						dob: "",
						gender: "",
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
							className={styles["signup-form"]}
						>
							{error && (
								<Alert
									className={styles["signup-alert-message"]}
									severity="error"
								>
									Sign-up failed!
								</Alert>
							)}
							<Stack spacing={2} width={"60vw"} minWidth={100} maxWidth={450}>
								<Field
									as={TextField}
									className="signup-textfield"
									fullWidth
									id="name-signup"
									label="Full name"
									name="name"
									placeholder="Full name"
									type="text"
									variant="outlined"
									onChange={formProps.handleChange}
									value={formProps.values.name}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Badge />
											</InputAdornment>
										),
									}}
								/>
							</Stack>
							<Stack spacing={2} width={"60vw"} minWidth={100} maxWidth={450}>
								<Field
									as={TextField}
									className="signup-textfield"
									fullWidth
									id="email-signup"
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
									className="signup-textfield"
									fullWidth
									id="password-signup"
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
								<Select
									fullWidth
									value={formProps.values.gender}
									id="gender"
									name="gender"
									onBlur={formProps.handleBlur}
									onChange={(event) => {
										formProps.setFieldValue("gender", event.target.value);
									}}
									displayEmpty
								>
									<MenuItem value="" disabled>
										Select your gender
									</MenuItem>
									<MenuItem value="MALE">Male</MenuItem>
									<MenuItem value="FEMALE">Female</MenuItem>
									<MenuItem value="OTHER">Other</MenuItem>
								</Select>
							</Stack>
							<Stack spacing={2} width={"60vw"} minWidth={100} maxWidth={450}>
								<Field
									as={TextField}
									className="signup-textfield"
									fullWidth
									id="country-signup"
									label="Country"
									name="country"
									placeholder="Country"
									variant="outlined"
									onChange={formProps.handleChange}
									value={formProps.values.country}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<LockOutlined />
											</InputAdornment>
										),
									}}
								/>
							</Stack>
							<Stack spacing={2} width={"60vw"} minWidth={100} maxWidth={450}>
								<DatePicker
									format="DD/MM/YYYY"
									disableFuture
									shouldDisableDate={disableToday}
									value={formProps.values.dob || null}
									onChange={(date: any) => {
										formProps.setFieldValue("dob", date);
									}}
									slotProps={{
										textField: {
											onBlur: formProps.handleBlur,
										},
									}}
								/>
							</Stack>
							<Stack spacing={2} width={"60vw"} minWidth={100} maxWidth={450}>
								<LoadingButton
									className={styles["submit-signup-btn"]}
									size="large"
									type="submit"
									variant="contained"
									loading={loading}
								>
									Sign Up
								</LoadingButton>
								<Link to={"../login"} style={{ color: "black" }}>
									<Button
										className={styles["submit-login-btn"]}
										size="large"
										variant="contained"
										disabled={loading}
									>
										Login
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

export default SignUp;
