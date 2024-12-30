import instance from "./../config";

type LoginType = {
	email: string;
	password: string;
	deviceId: string;
};

type SignUpType = {
	user: {
		name: string;
		country?: string;
		avatar?: string;
		email: string;
		dob: string;
		gender?: string;
		roleId?: number;
		password: string;
	};
	deviceId: string;
};
interface AuthResponse {
	access_token: string;
	refresh_token: string;
}

const login = (data: LoginType) => {
	return instance.post<AuthResponse>("/login/local", data);
};

const signup = (data: SignUpType) => {
	return instance.post<AuthResponse>("/local/sign-up", data);
};

export const AuthApi = {
	login,
	signup,
};
