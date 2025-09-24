import { MongoClient } from "mongodb";

let client: MongoClient;

export const getMongoClient = async (): Promise<MongoClient> => {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();
  }
  return client;
};
