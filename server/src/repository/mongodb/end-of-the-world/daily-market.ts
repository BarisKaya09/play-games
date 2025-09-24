import { MongoClient, type Collection, type Document, type UpdateFilter, type UpdateResult } from "mongodb";
import { allItems, Rarity, type Item } from "./data/items";
import { v4 as uuidV4 } from "uuid";
import { getMongoClient } from "../client";

const MAX_DAILY_MARKET_ITEM = 50;

type DailyMarketItem = {
  id: string;
  item: Item;
  value: number;
  stock: number;
};

const getRandomItemStock = (rarity: Rarity): number => {
  switch (rarity) {
    case "Yaygın":
      return Math.floor(Math.random() * (40 - 10 + 1)) + 10;
    case "Yaygın Değil":
      return Math.floor(Math.random() * (35 - 10 + 1)) + 10;
    case "Nadir":
      return Math.floor(Math.random() * (20 - 10 + 1)) + 10;
    case "Epik":
      return Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    case "Efsane":
      return Math.floor(Math.random() * (5 - 1 + 1)) + 1;
    default:
      return 0;
  }
};

type DailyMarket = {
  id: string;
  items: Array<DailyMarketItem>;
};

export class DailyMarketRepository {
  public async insertDailyMarket() {
    const dailyMarket: DailyMarket = {
      id: uuidV4(),
      items: [],
    } as DailyMarket;

    for (let i = 0; i < MAX_DAILY_MARKET_ITEM; i++) {
      const item = allItems[Math.floor(Math.random() * allItems.length)];
      dailyMarket.items.push({
        id: uuidV4(),
        item: item,
        value: item.getValue(),
        stock: getRandomItemStock(item.rarity),
      } as DailyMarketItem);
    }

    await (await this.collection()).insertOne(dailyMarket);
  }

  public async findDailyMarket(): Promise<DailyMarket | null> {
    const dailyMarket = await (await this.collection()).find<DailyMarket>({}).toArray();
    return dailyMarket.length > 0 ? dailyMarket[0] : null;
  }

  public async findItem(itemID: string): Promise<DailyMarketItem | undefined> {
    const dailyMarket = await (await this.collection()).find<DailyMarket>({}).toArray();
    return dailyMarket[0].items.find((item) => item.id == itemID);
  }

  public async updateOneDailyMarket(filter: { id: string }, update: Document[] | UpdateFilter<Document>): Promise<UpdateResult> {
    return await (await this.collection()).updateOne(filter, update);
  }

  public async deleteDailyMarket(filter: { id: string }) {
    await (await this.collection()).deleteOne(filter);
  }

  private async collection(): Promise<Collection> {
    return (await getMongoClient()).db("play-games").collection("daily-market");
  }
}
