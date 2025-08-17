import axios from "axios";
import { response, type SuccessResponse, type UnsuccessResponse } from "./response";

export type SnakeGameRecordStatistics = {
  playTime: string;
  appleCount: number;
  wallCount: number;
};

export default class SnakeGameService {
  private static SAVE_SNAKE_GAME_RECORD_ENDPOINT = import.meta.env.VITE_SAVE_SNAKE_GAME_RECORD_ENDPOINT as string;
  private static GET_SNAKE_GAME_RECORD = import.meta.env.VITE_GET_SNAKE_GAME_RECORD_ENDPOINT as string;

  public static async saveSnakeGameRecord(record: SnakeGameRecordStatistics): Promise<SuccessResponse<string> | UnsuccessResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string>>(this.SAVE_SNAKE_GAME_RECORD_ENDPOINT, record, { withCredentials: true });
      return response.success<string>(data.status, data.data);
    } catch (err: any) {
      return response.unsuccess(err.response.data.status, err.response.data.error);
    }
  }

  public static async getSnakeGameRecord(): Promise<SuccessResponse<SnakeGameRecordStatistics> | UnsuccessResponse> {
    try {
      const { data } = await axios.get<SuccessResponse<SnakeGameRecordStatistics>>(this.GET_SNAKE_GAME_RECORD, { withCredentials: true });
      return response.success<SnakeGameRecordStatistics>(data.status, data.data);
    } catch (err: any) {
      return response.unsuccess(err.response.data.status, err.response.data.error);
    }
  }
}
