import axios from "axios";
import { response, type SuccessResponse, type UnsuccessResponse } from "./response";

export default class AccountService {
  private static readonly GET_ACCOUNT = import.meta.env.VITE_GET_ACCOUNT_ENDPOINT as string;
  private static readonly CHANGE_USERNAME_ENDPOINT = import.meta.env.VITE_CHANGE_USERNAME_ENDPOINT as string;
  private static readonly CHANGE_EMAIL_ENDPOINT = import.meta.env.VITE_CHANGE_EMAIL_ENDPOINT as string;

  static async getAccount(): Promise<SuccessResponse<{ username: string; email: string }> | UnsuccessResponse> {
    try {
      const { data } = await axios.get<SuccessResponse<{ username: string; email: string }>>(this.GET_ACCOUNT, { withCredentials: true });
      return response.success<{ username: string; email: string }>(data.status, data.data);
    } catch (err: any) {
      return response.unsuccess(err.response.data.status, err.response.data.error);
    }
  }

  static async changeUsername(newUsername: string): Promise<SuccessResponse<string> | UnsuccessResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string>>(
        this.CHANGE_USERNAME_ENDPOINT,
        { newUsername: newUsername },
        { withCredentials: true }
      );
      return response.success<string>(data.status, data.data);
    } catch (err: any) {
      return response.unsuccess(err.response.data.status, err.response.data.error);
    }
  }

  static async changeEmail(newEmail: string): Promise<SuccessResponse<string> | UnsuccessResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string>>(this.CHANGE_EMAIL_ENDPOINT, { newEmail: newEmail }, { withCredentials: true });
      return response.success<string>(data.status, data.data);
    } catch (err: any) {
      return response.unsuccess(err.response.data.status, err.response.data.error);
    }
  }
}
