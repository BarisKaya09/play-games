// ---------------------- Rarity ---------------------- //
export enum Rarity {
  Common = "Yaygın", // Yaygın
  Uncommon = "Yaygın Değil", // Yaygın değil
  Rare = "Nadir", // Nadir
  Epic = "Epik", // Epik
  Legendary = "Efsane", // Efsane
}

export type RarityColor =
  | "border-b-5 border-b-zinc-700 shadow-md shadow-zinc-500/50 hover:shadow-2xl inset-shadow-sm inset-shadow-zinc-500/50"
  | "border-b-5 border-b-slate-700 shadow-md shadow-slate-500/50 hover:shadow-2xl inset-shadow-sm inset-shadow-slate-500/50"
  | "border-b-5 border-b-fuchsia-700 shadow-md shadow-fuchsia-500/50 hover:shadow-2xl inset-shadow-sm inset-shadow-fuchsia-500/50"
  | "border-b-5 border-b-violet-700 shadow-md shadow-violet-500/50 hover:shadow-2xl inset-shadow-sm inset-shadow-violet-500/50"
  | "border-b-5 border-b-pink-700 shadow-md shadow-pink-500/50 hover:shadow-2xl inset-shadow-sm inset-shadow-pink-500/50";
export const CommonColor: RarityColor =
  "border-b-5 border-b-zinc-700 shadow-md shadow-zinc-500/50 hover:shadow-2xl inset-shadow-sm inset-shadow-zinc-500/50";
export const UncommonColor: RarityColor =
  "border-b-5 border-b-slate-700 shadow-md shadow-slate-500/50 hover:shadow-2xl inset-shadow-sm inset-shadow-slate-500/50";
export const RareColor: RarityColor =
  "border-b-5 border-b-fuchsia-700 shadow-md shadow-fuchsia-500/50 hover:shadow-2xl inset-shadow-sm inset-shadow-fuchsia-500/50";
export const EpicColor: RarityColor =
  "border-b-5 border-b-violet-700 shadow-md shadow-violet-500/50 hover:shadow-2xl inset-shadow-sm inset-shadow-violet-500/50";
export const LegendaryColor: RarityColor =
  "border-b-5 border-b-pink-700 shadow-md shadow-pink-500/50 hover:shadow-2xl inset-shadow-sm inset-shadow-pink-500/50";

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

export type Effect = "very-low" | "low" | "medium" | "high" | "very-high";
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
  img: string;

  stack: number;
  stackSize: number;
  stackable: boolean;

  hungerRestoration: "low" | "medium" | "high" | "very-high"; // Açlık giderme miktarı. //? foodEffects'deki ReduceHunger efektinden dolayı bu fielda gerek kalmaya bilir.
  decayTime: number; // bozulma süresi
  decayLevel: "fresh" | "stale" | "rotten"; // taze | bayat | çürümüş

  effects: Array<FoodEffect>;

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
  img: string;

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
  img: string;

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
  img: string;

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
  img: string;

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
  img: string;

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
  img: string;

  stack: number;
  stackSize: number;
  stackable: boolean;

  healAmount: "low" | "medium" | "high";

  effects: Array<MedicalEffect>;

  getValue: () => number;
};
// ---------------------- Medical  ---------------------- //

export type Item = Food | Clothes | Weapon | Container | Bullet | Valuable | Medical;

export enum ItemNames {
  CannedBeans = "Konserve Fasulye",
  SurvivalBiscuits = "Hayatta Kalma Bisküvileri",
  AncientChocolateBar = "Eski Çikolata",
  Somon = "Somon",
  Water = "Su",
  Meat = "Et",
  RottenMeat = "Çürük Et",
  SmallTrout = "Küçük Alabalık",
  Perch = "Sarı Levrek",
  ArcticChar = "Kutup Balığı",
  NorthernPike = "Turna Balığı",
  Whitefish = "Beyaz Balık",
  IceSalmon = "Buz Somonu",
  CrystalCarp = "Kristal Sazan",
  AncientIcefish = "Antik Buz Balığı",
  TShirt = "Tişört",
  Shorts = "Şort",
  Sweater = "Kazak",
  Jacket = "Mont",
  MilitaryJacket = "Askeri Mont",
  Pants = "Pantolon",
  CargoPants = "Kargo Pantolon",
  Sneakers = "Spor Ayakkabı",
  MilitaryBoots = "Askeri Ayakkabı",
  MotorcycleHelmet = "Motosiklet Kaskı",
  LightMilitaryHelmet = "Hafif Askeri Kask",
  HeavyMilitaryHelmet = "Ağır Askeri Kask",
  Glock18 = "Glock18 (Yarı otomatik tabanca)",
  Colt1911 = "Colt M1911 (Klasik tabanca)",
  AK47 = "AK-47 (Taarruz tüfeği)",
  M4A1 = "M4A1 (Modern Amerikan tüfeği)",
  Remington870 = "Remington 870 (Pompalı av tüfeği)",
  BarrettM82 = "Barrett M82 (Ağır keskin nişancı tüfeği)",
  KaBarKnife = "KA-BAR Knife (Askeri bıçak)",
  Machete = "Pala",
  LouisvilleSlugger = "Louisville Slugger (Markalı beyzbol sopası)",
  StanleyCrowbar = "Stanley Crowbar (Levye)",
  Backpack = "Sırt Çantası",
  SmallContainer = "Küçük Konteyner",
  BigContainer = "Büyük Konteyner",
  PistolBullet = "Tabanca Mermisi",
  RifleBullet = "Tüfek Mermisi",
  SniperBullet = "Sniper Mermisi",
  PumpgunBullet = "Pompalı Tüfek Mermisi",
  GoldRing = "Altın Yüzük",
  SilverNecklace = "Gümüş Kolye",
  DiamondEarring = "Elmas Küpe",
  LuxuryWatch = "Lüks Saat",
  OldPainting = "Eski Tablo",
  Bandage = "Bandaj",
  Medkit = "İlk Yardım Çantası",
  Painkiller = "Ağrı Kesici",
  AntibioticPills = "Antibiyotik Haplar",
}
