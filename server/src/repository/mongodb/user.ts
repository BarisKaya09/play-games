import { MongoClient, type Collection, type Document, type UpdateFilter, type UpdateResult } from "mongodb";

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
  private client: MongoClient;

  constructor(uri: string) {
    this.client = new MongoClient(uri);
  }

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

    await this.collection().insertOne(user);
  }

  public async findUser(filter: Partial<Record<keyof User, any>>): Promise<User | null> {
    return await this.collection().findOne<User>(filter);
  }

  public async updateOne(filter: Partial<Record<keyof User, any>>, update: Document[] | UpdateFilter<Document>): Promise<UpdateResult> {
    return await this.collection().updateOne(filter, update);
  }

  private collection(): Collection {
    return this.client.db("play-games").collection("users");
  }

  public async close() {
    await this.client.close();
  }
}
