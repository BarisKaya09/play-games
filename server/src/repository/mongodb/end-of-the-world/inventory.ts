import { type Collection, type Document, type UpdateFilter, type UpdateResult } from "mongodb";
import type { Item } from "./data/items";
import { getMongoClient } from "../client";

const BASE_MONEY: number = 500;
const BASE_HP: number = 100;
const BASE_HUNGER: number = 100;
const BASE_THIRST: number = 100;
const BASE_ENERGY: number = 100;

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

export class InventoryRepository {
  public async insertInventory(user_id: string) {
    const inventory: Inventory = {
      user_id: user_id,
      items: [],
      money: BASE_MONEY,

      hp: BASE_HP,
      hunger: BASE_HUNGER,
      thirst: BASE_THIRST,
      energy: BASE_ENERGY,
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
