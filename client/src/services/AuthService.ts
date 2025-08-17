import axios from "axios";
import { response, type SuccessResponse, type UnsuccessResponse } from "./response";

export default class AuthService {
  private static readonly SIGNUP_ENDPOINT = import.meta.env.VITE_SIGNUP_ENDPOINT as string;
  private static readonly SIGNIN_ENDPOINT = import.meta.env.VITE_SIGNIN_ENDPOINT as string;
  private static readonly LOGOUT_ENDPOINT = import.meta.env.VITE_LOGOUT_ENDPOINT as string;
  private static readonly IS_LOGGED_IN_ENDPOINT = import.meta.env.VITE_IS_LOGGED_IN_ENDPOINT as string;

  static async signup(username: string, email: string, password: string): Promise<SuccessResponse<string> | UnsuccessResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string>>(this.SIGNUP_ENDPOINT, { username, email, password }, { withCredentials: true });
      return response.success<string>(data.status, data.data);
    } catch (err: any) {
      return response.unsuccess(err.response.data.status, err.response.data.error);
    }
  }

  static async signin(username: string, password: string): Promise<SuccessResponse<string> | UnsuccessResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string>>(this.SIGNIN_ENDPOINT, { username, password }, { withCredentials: true });
      return response.success<string>(data.status, data.data);
    } catch (err: any) {
      return response.unsuccess(err.response.data.status, err.response.data.error);
    }
  }

  static async logout(): Promise<SuccessResponse<string> | UnsuccessResponse> {
    try {
      const { data } = await axios.post(this.LOGOUT_ENDPOINT, {}, { withCredentials: true });
      return response.success<string>(data.status, data.data);
    } catch (err: any) {
      return response.unsuccess(err.response.data.status, err.response.data.error);
    }
  }

  static async isLoggedIn(): Promise<SuccessResponse<boolean> | UnsuccessResponse> {
    try {
      const { data } = await axios.get<SuccessResponse<boolean>>(this.IS_LOGGED_IN_ENDPOINT, { withCredentials: true });
      return response.success<boolean>(data.status, data.data);
    } catch (err: any) {
      return response.unsuccess(err.response.data.status, err.response.data.error);
    }
  }
}
