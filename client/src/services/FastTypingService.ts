import axios from "axios";
import { response, type SuccessResponse, type UnsuccessResponse } from "./response";

export type FastTypingStatistics = {
  correctWords: number;
  wrongWords: number;
  wpm: number; // dakika başına kelime
  totalWordAccuracy: number; // kelime doğruluğu. (yüzde üzerinden)
};

export default class FastTypingService {
  private static readonly GET_WORDS = import.meta.env.VITE_FAST_TYPING_ENDPOINT_GET_WORDS as string;
  private static readonly SAVE_STATISTICS = import.meta.env.VITE_FAST_TYPING_SAVE_STATISTICS_ENDPOINT as string;
  private static readonly GET_STATISTICS = import.meta.env.VITE_GET_FAST_TYPING_GET_STATISTICS_ENDPOINT as string;

  static async getWords(): Promise<SuccessResponse<Array<string>> | UnsuccessResponse> {
    try {
      const { data } = await axios.get<SuccessResponse<Array<string>>>(this.GET_WORDS, { withCredentials: true });
      return response.success<Array<string>>(data.status, data.data);
    } catch (err: any) {
      return response.unsuccess(err.response.data.status, err.response.data.error);
    }
  }

  static async saveStatistics(statistics: { correctWords: number; wrongWords: number }): Promise<SuccessResponse<string> | UnsuccessResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string>>(this.SAVE_STATISTICS, statistics, { withCredentials: true });
      return response.success<string>(data.status, data.data);
    } catch (err: any) {
      return response.unsuccess(err.response.data.status, err.response.data.error);
    }
  }

  static async getStatistics(): Promise<SuccessResponse<FastTypingStatistics> | UnsuccessResponse> {
    try {
      const { data } = await axios.get<SuccessResponse<FastTypingStatistics>>(this.GET_STATISTICS, { withCredentials: true });
      return response.success<FastTypingStatistics>(data.status, data.data);
    } catch (err: any) {
      return response.unsuccess(err.response.data.status, err.response.data.error);
    }
  }
}
