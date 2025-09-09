// ---------------------- Rarity ---------------------- //
export enum Rarity {
  Common = "Yaygın", // Yaygın
  Uncommon = "Yaygın Değil", // Yaygın değil
  Rare = "Nadir", // Nadir
  Epic = "Epik", // Epik
  Legendary = "Efsane", // Efsane
}

export type RarityColor =
  | "shadow-md shadow-zinc-700"
  | "shadow-md shadow-slate-700"
  | "shadow-md shadow-violet-700"
  | "shadow-md shadow-fuchsia-700"
  | "shadow-md shadow-pink-700";
export const CommonColor: RarityColor = "shadow-md shadow-zinc-700";
export const UncommonColor: RarityColor = "shadow-md shadow-slate-700";
export const RareColor: RarityColor = "shadow-md shadow-violet-700";
export const EpicColor: RarityColor = "shadow-md shadow-fuchsia-700";
export const LegendaryColor: RarityColor = "shadow-md shadow-pink-700";

// ---------------------- Rarity ---------------------- //

// ---------------------- ItemType ---------------------- //
export enum ItemType {
  Food = "Yiyecek",
  Clothes = "Giyecek",
  Weapon = "Silah",
  Container = "Kutu",
  Bullet = "Cephane",
  Valuable = "Değerli Eşya",
  Medical = "Tıbbi",
}
// ---------------------- ItemType ---------------------- //

// ---------------------- Food Effects ---------------------- //
enum FoodEffects {
  IncreaseThirst = "IncreaseThirst",
  ReduceThirst = "ReduceThirst",
  IncreaseHunger = "IncreaseHunger",
  ReduceHunger = "ReduceHunger",
  IncreaseEnergy = "IncreaseEnergy",
  ReduceEnergy = "ReduceEnergy",
  CauseIllness = "CauseIllness",
  CureIllness = "CureIllness",
}

type Effect = "very-low" | "low" | "medium" | "high" | "very-high";
export type FoodEffect = {
  foodEffect: FoodEffects;
  description: string;
  effect: Effect;
};

// ---------------------- Food ---------------------- //
export type Food = {
  name: string; //TODO: Tipi sonra değişecek.
  itemType: ItemType;
  rarity: Rarity;

  stack: number;
  stackSize: number;
  stackable: boolean;

  hungerRestoration: "low" | "medium" | "high" | "very-high"; // Açlık giderme miktarı. //? foodEffects'deki ReduceHunger efektinden dolayı bu fielda gerek kalmaya bilir.
  decayTime: number; // bozulma süresi
  decayLevel: "fresh" | "stale" | "rotten"; // taze | bayat | çürümüş

  foodEffects: Array<FoodEffect>;

  getValue: () => number;
};
// ---------------------- Food ---------------------- //

enum ClothesEffects {
  DamageProtection = "DamageProtection",
  ColdProtection = "ColdProtection",
  HotProtection = "HotProtection",
}

type ClothesEffect = {
  clothesEffect: ClothesEffects;
  description: string;
  effect: Effect;
};

// ---------------------- Clothes ---------------------- //
export type Clothes = {
  name: string; //TODO: Tipi sonradan değişecek.
  itemType: ItemType;
  rarity: Rarity;

  stack: number;
  stackSize: number;
  stackable: boolean;

  abrasion: "light" | "medium" | "heavy"; // yıpranma

  effects: Array<ClothesEffect>;

  getValue: () => number;
};
// ---------------------- Clothes ---------------------- //

// ---------------------- Weapon ---------------------- //
export type Weapon = {
  name: string; // TODO: Tipi sonra değişecek
  itemType: ItemType;
  rarity: Rarity;

  stack: number;
  stackSize: number;
  stackable: boolean;

  abrasion: "light" | "medium" | "heavy"; // yıpranma

  damage: number;
  magazineSize: number;

  bulletType?: "pistol-bullet" | "rifle-bullet" | "sniper-bullet" | "pumpgun-bullet";

  getValue: () => number;
};
// ---------------------- Weapon ---------------------- //

// ---------------------- Container ---------------------- //
export type Container = {
  name: string; // Todo: Tipi sonradan değişecek
  itemType: ItemType;
  rarity: Rarity;

  capacity: number; // depo büyüklüğü
  items: Array<Food | Clothes | Weapon | Bullet | Valuable | Medical>;

  getValue: () => number;
};
// ---------------------- Container ---------------------- //

// ---------------------- Bullet ---------------------- //
export type Bullet = {
  name: string; // TODO: Tipi sonradan değişecek
  itemType: ItemType;
  rarity: Rarity;

  stack: number;
  stackSize: number;
  stackable: boolean;

  damageBoost: number;

  getValue: () => number;
};
// ---------------------- Bullet ---------------------- //

// ---------------------- Valuable ---------------------- //
export type Valuable = {
  name: string;
  itemType: ItemType;
  rarity: Rarity;

  stack: number;
  stackSize: number;
  stackable: boolean;

  getValue: () => number;
};
// ---------------------- Valuable ---------------------- //

// ---------------------- Medical Effects ---------------------- //
enum MedicalEffects {
  Heal = "Heal",
  PainRelief = "PainRelief",
  CureInfection = "CureInfection",
}

type MedicalEffect = {
  medicalEffect: MedicalEffects;
  description: string;
  effect: Effect;
};

// ---------------------- Medical  ---------------------- //
export type Medical = {
  name: string;
  itemType: ItemType;
  rarity: Rarity;

  stack: number;
  stackSize: number;
  stackable: boolean;

  healAmount: "low" | "medium" | "high";

  effects: Array<MedicalEffect>;

  getValue: () => number;
};
// ---------------------- Medical  ---------------------- //

export type Item = Food | Clothes | Weapon | Container | Bullet | Valuable | Medical;
