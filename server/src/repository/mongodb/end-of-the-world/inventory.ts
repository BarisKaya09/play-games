import { MongoClient, type Collection, type Document, type UpdateFilter, type UpdateResult } from "mongodb";
import type { Item } from "./data/items";
import { getMongoClient } from "../client";

const BASE_MONEY = 500;

export type InventoryItem = {
  itemID: string;
  item: Item;
  value: number;
  img: string;
};

export type Inventory = {
  user_id: string;
  items: Array<InventoryItem>;
  money: number;
};

export class InventoryRepository {
  public async insertInventory(user_id: string) {
    const inventory: Inventory = {
      user_id: user_id,
      items: [],
      money: BASE_MONEY,
    };
    (await this.collection()).insertOne(inventory);
  }

  public async findOneInventory(filter: { user_id: string }): Promise<Inventory | null> {
    return await (await this.collection()).findOne<Inventory>(filter);
  }

  public async updateOneInventory(filter: { user_id: string }, update: Document[] | UpdateFilter<Document>): Promise<UpdateResult> {
    return await (await this.collection()).updateOne(filter, update);
  }

  private async collection(): Promise<Collection> {
    return (await getMongoClient()).db("play-games").collection("inventory");
  }
}
