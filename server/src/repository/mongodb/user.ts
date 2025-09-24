import { MongoClient, type Collection, type Document, type UpdateFilter, type UpdateResult } from "mongodb";
import { getMongoClient } from "./client";

export type FastTypingGameStatistics = {
  correctWords: number;
  wrongWords: number;
  wpm: number; // dakika başına kelime
  totalWordAccuracy: number; // kelime doğruluğu. (yüzde üzerinden)
};

export type SnakeGameRecordStatistics = {
  playTime: string;
  appleCount: number;
  wallCount: number;
};

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;

  // Oyun istatistikleri
  fastTyping: FastTypingGameStatistics;
  snakeGameRecord: SnakeGameRecordStatistics;
};

export class UserRepository {
  public async insertUser(id: string, username: string, email: string, password: string) {
    const user: User = {
      id: id,
      username,
      email,
      password,

      fastTyping: {
        correctWords: 0,
        wrongWords: 0,
        wpm: 0,
        totalWordAccuracy: 0,
      } as FastTypingGameStatistics,

      snakeGameRecord: {
        playTime: "",
        appleCount: 0,
        wallCount: 0,
      } as SnakeGameRecordStatistics,
    } as User;

    await (await this.collection()).insertOne(user);
  }

  public async findUser(filter: Partial<Record<keyof User, any>>): Promise<User | null> {
    return await (await this.collection()).findOne<User>(filter);
  }

  public async updateOne(filter: Partial<Record<keyof User, any>>, update: Document[] | UpdateFilter<Document>): Promise<UpdateResult> {
    return await (await this.collection()).updateOne(filter, update);
  }

  private async collection(): Promise<Collection> {
    return (await getMongoClient()).db("play-games").collection("users");
  }
}
