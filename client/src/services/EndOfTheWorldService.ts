import axios from "axios";
import { response, type SuccessResponse, type UnsuccessResponse } from "./response";
import { type Item } from "../components/games/end-of-the-world/types";

export type InventoryItem = {
  itemID: string;
  item: Item;
  value: number;
};

export type Inventory = {
  user_id: string;
  items: Array<InventoryItem>;
  money: number;

  hp: number;
  hunger: number;
  thirst: number;
  energy: number;
};

export default class EndOfTheWorldService {
  private static readonly GET_USER_INVENTORY_ENDPOINT: string = import.meta.env.VITE_GET_USER_INVENTORY_ENDPOINT as string;
  private static readonly SPLIT_ITEM_STACK_ENDPOINT: string = import.meta.env.VITE_SPLIT_ITEM_STACK_ENDPOINT as string;
  private static readonly CONCAT_ITEMS_ENDPOINT: string = import.meta.env.VITE_CONCAT_ITEMS_ENDPOINT as string;
  private static readonly GET_DAILY_MARKET_ENDPOINT: string = import.meta.env.VITE_GET_DAILY_MARKET_ENDPOINT as string;
  private static readonly BUY_ITEM_IN_DAILY_MARKET_ENDPOINT: string = import.meta.env.VITE_BUY_ITEM_IN_DAILY_MARKET_ENDPOINT as string;
  private static readonly SELL_ITEM_IN_MARKET_ENDPOINT: string = import.meta.env.VITE_SELL_ITEM_IN_MARKET_ENDPOINT as string;
  private static readonly GET_MARKET_ENDPOINT: string = import.meta.env.VITE_GET_MARKET_ENDPOINT as string;
  private static readonly BUY_ITEM_IN_MARKET_ENDPOINT: string = import.meta.env.VITE_BUY_ITEM_IN_MARKET_ENDPOINT as string;
  private static readonly DELETE_ITEM_IN_MARKET_ENDPOINT: string = import.meta.env.VITE_DELETE_ITEM_IN_MARKET_ENDPOINT as string;
  private static readonly STACK_THE_ITEM_IN_INVENTORY_ENDPOINT: string = import.meta.env.VITE_STACK_THE_ITEM_IN_INVENTORY_ENDPOINT as string;
  private static readonly GET_MAP_ENDPOINT: string = import.meta.env.VITE_GET_MAP_ENDPOINT as string;

  public static async getUserInventory(): Promise<SuccessResponse<Inventory> | UnsuccessResponse> {
    try {
      const { data } = await axios.get<SuccessResponse<Inventory>>(this.GET_USER_INVENTORY_ENDPOINT, { withCredentials: true });
      return response.success(data.status, data.data);
    } catch (err: any) {
      return response.unsuccess(err.response.data.status, err.response.data.error);
    }
  }

  public static async splitItemStack(item: InventoryItem, splitSize: number): Promise<SuccessResponse<string> | UnsuccessResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string>>(this.SPLIT_ITEM_STACK_ENDPOINT, { item, splitSize }, { withCredentials: true });
      return response.success(data.status, data.data);
    } catch (err: any) {
      return response.unsuccess(err.response.data.status, err.response.data.error);
    }
  }

  public static async concatItems(subItem: InventoryItem, draggedItem: InventoryItem): Promise<SuccessResponse<string> | UnsuccessResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string>>(this.CONCAT_ITEMS_ENDPOINT, { subItem, draggedItem }, { withCredentials: true });
      return response.success(data.status, data.data);
    } catch (err: any) {
      return response.unsuccess(err.response.data.status, err.response.data.error);
    }
  }
}
