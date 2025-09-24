import { Collection, FindCursor, MongoClient, type Document, type UpdateFilter, type UpdateResult } from "mongodb";
import type { Item } from "./data/items";
import { v4 as uuidV4 } from "uuid";
import { getMongoClient } from "../client";

type MarketItem = {
  ownerID: string;
  itemID: string;
  item: Item;
  value: number;
  sellAmount: number;
};

export class MarketRepository {
  public async insertItem(user_id: string, item: Item, value: number, sellAmount: number) {
    const marketItem: MarketItem = {
      ownerID: user_id,
      itemID: uuidV4(),
      item: item,
      value: value,
      sellAmount: sellAmount,
    } as MarketItem;

    await (await this.collection()).insertOne(marketItem);
  }

  public async findOneItem(filter: { itemID: string }): Promise<MarketItem | null> {
    return await (await this.collection()).findOne<MarketItem>(filter);
  }

  public async findAllItem(): Promise<Array<MarketItem>> {
    return await (await this.collection()).find<MarketItem>({}).toArray();
  }

  public async updateOneItem(filter: { itemID: string }, update: Document[] | UpdateFilter<Document>): Promise<UpdateResult> {
    return await (await this.collection()).updateOne(filter, update);
  }

  public async deleteOneItem(filter: { itemID: string }) {
    return await (await this.collection()).deleteOne(filter);
  }

  private async collection(): Promise<Collection> {
    return (await getMongoClient()).db("play-games").collection("market");
  }
}
