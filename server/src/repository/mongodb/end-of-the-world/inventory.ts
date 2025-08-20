import { MongoClient, type Collection, type Document, type UpdateFilter, type UpdateResult } from "mongodb";
import type { Item } from "./data/items";

const BASE_MONEY = 500;

export type InventoryItem = {
  itemID: string;
  item: Item;
  value: number;
};

export type Inventory = {
  user_id: string;
  items: Array<InventoryItem>;
  money: number;
};

export class InventoryRepository {
  private client: MongoClient;

  constructor(uri: string) {
    this.client = new MongoClient(uri);
  }

  public async insertInventory(user_id: string) {
    const inventory: Inventory = {
      user_id: user_id,
      items: [],
      money: BASE_MONEY,
    };
    this.collection().insertOne(inventory);
  }

  public async findOneInventory(filter: { user_id: string }): Promise<Inventory | null> {
    return await this.collection().findOne<Inventory>(filter);
  }

  public async updateOneInventory(filter: { user_id: string }, update: Document[] | UpdateFilter<Document>): Promise<UpdateResult> {
    return await this.collection().updateOne(filter, update);
  }

  private collection(): Collection {
    return this.client.db("play-games").collection("inventory");
  }

  public async close() {
    await this.client.close();
  }
}
