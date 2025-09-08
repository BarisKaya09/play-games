// ---------------------- Rarity ---------------------- //
export enum Rarity {
  Common = "Yaygın", // Yaygın
  Uncommon = "Yaygın Değil", // Yaygın değil
  Rare = "Nadir", // Nadir
  Epic = "Epik", // Epik
  Legendary = "Efsane", // Efsane
}
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

const getItemValue = (rarity: Rarity): number => {
  switch (rarity) {
    case Rarity.Common:
      return Math.floor(Math.random() * (100 - 10 + 1)) + 10;
    case Rarity.Uncommon:
      return Math.floor(Math.random() * (150 - 100 + 1)) + 100;
    case Rarity.Rare:
      return Math.floor(Math.random() * (300 - 200 + 1)) + 200;
    case Rarity.Epic:
      return Math.floor(Math.random() * (700 - 500 + 1)) + 500;
    case Rarity.Legendary:
      return Math.floor(Math.random() * (2500 - 2000 + 1)) + 2000;
    default:
      return 0;
  }
};

type Effect = "very-low" | "low" | "medium" | "high" | "very-high";
export type FoodEffect = {
  foodEffect: FoodEffects;
  description: string;
  effect: Effect;
};

const IncreaseThirst = (effect: Effect): FoodEffect => {
  return {
    foodEffect: FoodEffects.IncreaseThirst,
    description: "Karakterin susuzluğunu artırır (kötü etki)",
    effect: effect,
  } as FoodEffect;
};

const ReduceThirst = (effect: Effect): FoodEffect => {
  return {
    foodEffect: FoodEffects.ReduceThirst,
    description: "Karakterin susuzluğunu azaltır (iyi etki)",
    effect: effect,
  } as FoodEffect;
};

const IncreaseHunger = (effect: Effect): FoodEffect => {
  return {
    foodEffect: FoodEffects.IncreaseHunger,
    description: "Karakteri daha aç yapar (kötü etki)",
    effect: effect,
  } as FoodEffect;
};

const ReduceHunger = (effect: Effect): FoodEffect => {
  return {
    foodEffect: FoodEffects.IncreaseHunger,
    description: "Açlığı azaltır (iyi etki)",
    effect,
  } as FoodEffect;
};

const IncreaseEnergy = (effect: Effect): FoodEffect => {
  return {
    foodEffect: FoodEffects.IncreaseEnergy,
    description: "Enerji seviyesini artırır",
    effect: effect,
  } as FoodEffect;
};

const ReduceEnergy = (effect: Effect): FoodEffect => {
  return {
    foodEffect: FoodEffects.ReduceEnergy,
    description: "Enerji seviyesini düşürür",
    effect: effect,
  } as FoodEffect;
};

const CauseIllness = (effect: Effect): FoodEffect => {
  return {
    foodEffect: FoodEffects.CauseIllness,
    description: "Karakteri hasta edebilir",
    effect: effect,
  } as FoodEffect;
};

const CureIllness = (effect: Effect): FoodEffect => {
  return {
    foodEffect: FoodEffects.CureIllness,
    description: "Hastalığı tedavi eder",
    effect: effect,
  } as FoodEffect;
};
// ---------------------- Food Effects ---------------------- //

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

// ---------------------- Clothes Effects ---------------------- //
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

const protectionToString = (effect: Effect): string => {
  switch (effect) {
    case "low":
      return "düşük";
    case "medium":
      return "orta derece";
    case "high":
      return "yüksek";
    case "very-high":
      return "çok yüksek";
    default:
      return "";
  }
};

const DamageProtection = (effect: Effect): ClothesEffect => {
  return {
    clothesEffect: ClothesEffects.DamageProtection,
    description: `Hasarlardan ${protectionToString(effect)} koruma sağlar.`,
    effect: effect,
  } as ClothesEffect;
};

const ColdProtection = (effect: Effect): ClothesEffect => {
  return {
    clothesEffect: ClothesEffects.ColdProtection,
    description: `Soğuktan ${protectionToString(effect)} koruma sağlar.`,
    effect: effect,
  } as ClothesEffect;
};

const HotProtection = (effect: Effect): ClothesEffect => {
  return {
    clothesEffect: ClothesEffects.HotProtection,
    description: `Sıcaktan ${protectionToString(effect)} koruma sağlar.`,
    effect: effect,
  } as ClothesEffect;
};
// ---------------------- Clothes Effects ---------------------- //

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

const Heal = (effect: Effect): MedicalEffect => {
  return {
    medicalEffect: MedicalEffects.Heal,
    description: "Can Yenileme",
    effect: effect,
  } as MedicalEffect;
};

const PainRelief = (effect: Effect): MedicalEffect => {
  return {
    medicalEffect: MedicalEffects.PainRelief,
    description: "Ağrı Kesici",
    effect: effect,
  } as MedicalEffect;
};

const CureInfection = (effect: Effect): MedicalEffect => {
  return {
    medicalEffect: MedicalEffects.CureInfection,
    description: "Enfoksiyona iyi gelir.",
    effect: effect,
  } as MedicalEffect;
};

// ---------------------- Medical Effects ---------------------- //

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

const hour: number = 1000 * 60 * 60;
// ---------------------- Food items ---------------------- //
export const CannedBeans: Food = {
  name: "Konserve Fasulye",
  itemType: ItemType.Food,
  rarity: Rarity.Common,

  stack: 0,
  stackSize: 10,
  stackable: true,

  hungerRestoration: "medium",
  decayTime: hour * 24 * 2, // 2 gün
  decayLevel: "fresh",

  foodEffects: [ReduceHunger("low"), IncreaseThirst("low"), IncreaseEnergy("low")],

  getValue: (): number => getItemValue(Rarity.Common),
} as Food;

export const SurvivalBiscuits: Food = {
  name: "Hayatta Kalma Bisküvileri",
  itemType: ItemType.Food,
  rarity: Rarity.Common,

  stack: 0,
  stackSize: 10,
  stackable: true,

  hungerRestoration: "medium",
  decayTime: hour * 24,
  decayLevel: "fresh",

  foodEffects: [ReduceHunger("low"), IncreaseThirst("low")],

  getValue: (): number => getItemValue(Rarity.Common),
} as Food;

export const AncientChocolateBar: Food = {
  name: "Eski Çikolata",
  itemType: ItemType.Food,
  rarity: Rarity.Rare,

  stack: 0,
  stackSize: 5,
  stackable: true,

  hungerRestoration: "high",
  decayTime: hour * 24 * 5, // 5 gün
  decayLevel: "fresh",

  foodEffects: [IncreaseThirst("low"), ReduceHunger("medium"), IncreaseEnergy("medium")],

  getValue: (): number => getItemValue(Rarity.Rare),
} as Food;

export const Somon: Food = {
  name: "Somon",
  itemType: ItemType.Food,
  rarity: Rarity.Epic,

  stack: 0,
  stackSize: 5,
  stackable: true,

  hungerRestoration: "very-high",
  decayTime: hour * 24,
  decayLevel: "fresh",

  foodEffects: [ReduceHunger("high"), IncreaseEnergy("low")],

  getValue: (): number => getItemValue(Rarity.Epic),
} as Food;

export const Water: Food = {
  name: "Su",
  itemType: ItemType.Food,
  rarity: Rarity.Uncommon,

  stack: 0,
  stackSize: 10,
  stackable: true,

  hungerRestoration: "low",
  decayTime: hour * 24 * 30,
  decayLevel: "fresh",

  foodEffects: [ReduceThirst("high"), IncreaseEnergy("low")],

  getValue: (): number => getItemValue(Rarity.Uncommon),
} as Food;

export const Meat: Food = {
  name: "Et",
  itemType: ItemType.Food,
  rarity: Rarity.Rare,

  stack: 0,
  stackSize: 5,
  stackable: true,

  hungerRestoration: "high",
  decayTime: hour * 24 * 2,
  decayLevel: "fresh",

  foodEffects: [IncreaseThirst("low"), ReduceHunger("high")],

  getValue: (): number => getItemValue(Rarity.Rare),
} as Food;

export const RottenMeat: Food = {
  name: "Çürük Et",
  itemType: ItemType.Food,
  rarity: Rarity.Common,

  stack: 0,
  stackSize: 5,
  stackable: true,

  hungerRestoration: "low",
  decayTime: 0,
  decayLevel: "rotten",

  foodEffects: [IncreaseThirst("medium"), IncreaseHunger("very-high"), ReduceEnergy("high"), CauseIllness("very-high")],

  getValue: (): number => getItemValue(Rarity.Common),
} as Food;

export const SmallTrout: Food = {
  name: "Küçük Alabalık",
  itemType: ItemType.Food,
  rarity: Rarity.Common,

  stack: 0,
  stackSize: 10,
  stackable: true,

  hungerRestoration: "low",
  decayLevel: "fresh",

  foodEffects: [IncreaseThirst("low"), ReduceHunger("medium"), IncreaseEnergy("medium")],

  getValue: (): number => getItemValue(Rarity.Common),
} as Food;

export const Perch: Food = {
  name: "Sarı Levrek",
  itemType: ItemType.Food,
  rarity: Rarity.Common,

  stack: 0,
  stackSize: 10,
  stackable: true,

  hungerRestoration: "low",
  decayLevel: "fresh",

  foodEffects: [IncreaseThirst("low"), ReduceHunger("medium"), IncreaseEnergy("medium")],

  getValue: (): number => getItemValue(Rarity.Common),
} as Food;

export const ArcticChar: Food = {
  name: "Kutup Balığı",
  itemType: ItemType.Food,
  rarity: Rarity.Uncommon,

  stack: 0,
  stackSize: 5,
  stackable: true,

  hungerRestoration: "medium",
  decayLevel: "fresh",

  foodEffects: [IncreaseThirst("very-low"), ReduceHunger("high"), IncreaseEnergy("medium")],

  getValue: (): number => getItemValue(Rarity.Uncommon),
} as Food;

export const NorthernPike: Food = {
  name: "Turna Balığı",
  itemType: ItemType.Food,
  rarity: Rarity.Uncommon,

  stack: 0,
  stackSize: 5,
  stackable: true,

  hungerRestoration: "medium",
  decayLevel: "fresh",

  foodEffects: [IncreaseThirst("very-low"), ReduceHunger("high"), IncreaseEnergy("medium")],

  getValue: (): number => getItemValue(Rarity.Uncommon),
} as Food;

export const Whitefish: Food = {
  name: "Beyaz Balık",
  itemType: ItemType.Food,
  rarity: Rarity.Uncommon,

  stack: 0,
  stackSize: 5,
  stackable: true,

  hungerRestoration: "medium",
  decayLevel: "fresh",

  foodEffects: [IncreaseThirst("very-low"), ReduceHunger("high"), IncreaseEnergy("medium")],

  getValue: (): number => getItemValue(Rarity.Uncommon),
} as Food;

export const IceSalmon: Food = {
  name: "Buz Somonu",
  itemType: ItemType.Food,
  rarity: Rarity.Rare,

  stack: 0,
  stackSize: 3,
  stackable: true,

  hungerRestoration: "high",
  decayLevel: "fresh",

  foodEffects: [ReduceHunger("high"), IncreaseEnergy("high")],

  getValue: (): number => getItemValue(Rarity.Rare),
} as Food;

export const CrystalCarp: Food = {
  name: "Kristal Sazan",
  itemType: ItemType.Food,
  rarity: Rarity.Rare,

  stack: 0,
  stackSize: 3,
  stackable: true,

  hungerRestoration: "high",
  decayLevel: "fresh",

  foodEffects: [ReduceHunger("high"), IncreaseEnergy("high")],

  getValue: (): number => getItemValue(Rarity.Rare),
} as Food;

export const AncientIcefish: Food = {
  name: "Antik Buz Balığı",
  itemType: ItemType.Food,
  rarity: Rarity.Legendary,

  stack: 0,
  stackSize: 0,
  stackable: false,

  hungerRestoration: "very-high",
  decayLevel: "fresh",

  foodEffects: [ReduceThirst("very-high"), ReduceHunger("very-high"), IncreaseEnergy("very-high")],

  getValue: (): number => getItemValue(Rarity.Rare),
} as Food;

export const foodItems: Array<Food> = [
  CannedBeans,
  SurvivalBiscuits,
  AncientChocolateBar,
  Somon,
  Water,
  Meat,
  RottenMeat,
  SmallTrout,
  Perch,
  ArcticChar,
  NorthernPike,
  Whitefish,
  IceSalmon,
  CrystalCarp,
  AncientIcefish,
];

// ---------------------- Food items ---------------------- //

// ---------------------- Clothes items ---------------------- //

export const TShirt: Clothes = {
  name: "Tişört",
  itemType: ItemType.Clothes,
  rarity: Rarity.Common,

  stack: 0,
  stackSize: 5,
  stackable: true,

  abrasion: "light",

  effects: [DamageProtection("very-low"), ColdProtection("very-low"), HotProtection("very-high")],

  getValue: (): number => getItemValue(Rarity.Common),
} as Clothes;

export const Shorts: Clothes = {
  name: "Şort",
  itemType: ItemType.Clothes,
  rarity: Rarity.Common,

  stack: 0,
  stackSize: 5,
  stackable: true,

  abrasion: "light",

  effects: [DamageProtection("very-low"), ColdProtection("very-low"), HotProtection("very-high")],

  getValue: (): number => getItemValue(Rarity.Common),
} as Clothes;

export const Sweater: Clothes = {
  name: "Kazak",
  itemType: ItemType.Clothes,
  rarity: Rarity.Rare,

  stack: 0,
  stackSize: 5,
  stackable: true,

  abrasion: "light",

  effects: [DamageProtection("low"), ColdProtection("medium"), HotProtection("very-low")],

  getValue: (): number => getItemValue(Rarity.Rare),
} as Clothes;

export const Jacket: Clothes = {
  name: "Mont",
  itemType: ItemType.Clothes,
  rarity: Rarity.Epic,

  stack: 0,
  stackSize: 0,
  stackable: false,

  abrasion: "light",

  effects: [DamageProtection("medium"), ColdProtection("high"), HotProtection("very-low")],

  getValue: (): number => getItemValue(Rarity.Epic),
} as Clothes;

export const MilitaryJacket: Clothes = {
  name: "Askeri Mont",
  itemType: ItemType.Clothes,
  rarity: Rarity.Legendary,

  stack: 0,
  stackSize: 0,
  stackable: false,

  abrasion: "light",

  effects: [DamageProtection("very-high"), ColdProtection("very-high"), HotProtection("very-low")],

  getValue: (): number => getItemValue(Rarity.Legendary),
} as Clothes;

export const Pants: Clothes = {
  name: "Pantolon",
  itemType: ItemType.Clothes,
  rarity: Rarity.Uncommon,

  stack: 0,
  stackSize: 5,
  stackable: true,

  abrasion: "light",

  effects: [DamageProtection("medium"), ColdProtection("medium"), HotProtection("very-low")],

  getValue: (): number => getItemValue(Rarity.Uncommon),
} as Clothes;

export const CargoPants: Clothes = {
  name: "Kargo Pantolon",
  itemType: ItemType.Clothes,
  rarity: Rarity.Rare,

  stack: 0,
  stackSize: 0,
  stackable: false,

  abrasion: "light",

  effects: [DamageProtection("high"), ColdProtection("high"), HotProtection("very-low")],

  getValue: (): number => getItemValue(Rarity.Rare),
} as Clothes;

export const Sneakers: Clothes = {
  name: "Spor Ayakkabı",
  itemType: ItemType.Clothes,
  rarity: Rarity.Uncommon,

  stack: 0,
  stackSize: 5,
  stackable: true,

  abrasion: "light",

  effects: [DamageProtection("low"), ColdProtection("low"), HotProtection("medium")],

  getValue: (): number => getItemValue(Rarity.Uncommon),
} as Clothes;

export const MilitaryBoots: Clothes = {
  name: "Askeri Ayakkabı",
  itemType: ItemType.Clothes,
  rarity: Rarity.Epic,

  stack: 0,
  stackSize: 0,
  stackable: false,

  abrasion: "light",

  effects: [DamageProtection("very-high"), ColdProtection("high"), HotProtection("low")],

  getValue: (): number => getItemValue(Rarity.Epic),
} as Clothes;

export const MotorcycleHelmet: Clothes = {
  name: "Motosiklet Kaskı",
  itemType: ItemType.Clothes,
  rarity: Rarity.Rare,

  stack: 0,
  stackSize: 0,
  stackable: false,

  abrasion: "light",

  effects: [DamageProtection("medium"), ColdProtection("medium"), HotProtection("very-low")],

  getValue: (): number => getItemValue(Rarity.Epic),
} as Clothes;

export const LightMilitaryHelmet: Clothes = {
  name: "Hafif Askeri Kask",
  itemType: ItemType.Clothes,
  rarity: Rarity.Epic,

  stack: 0,
  stackSize: 0,
  stackable: false,

  abrasion: "light",

  effects: [DamageProtection("high"), ColdProtection("medium"), HotProtection("very-low")],

  getValue: (): number => getItemValue(Rarity.Epic),
} as Clothes;

export const HeavyMilitaryHelmet: Clothes = {
  name: "Ağır Askeri Kask",
  itemType: ItemType.Clothes,
  rarity: Rarity.Legendary,

  stack: 0,
  stackSize: 0,
  stackable: false,

  abrasion: "light",

  effects: [DamageProtection("very-high"), ColdProtection("medium"), HotProtection("very-low")],

  getValue: (): number => getItemValue(Rarity.Legendary),
} as Clothes;

export const clothesItems: Array<Clothes> = [
  TShirt,
  Shorts,
  Sweater,
  Jacket,
  MilitaryJacket,
  Pants,
  CargoPants,
  Sneakers,
  MilitaryBoots,
  MotorcycleHelmet,
  LightMilitaryHelmet,
  HeavyMilitaryHelmet,
];

// ---------------------- Clothes items ---------------------- //

// ---------------------- Weapon Items ---------------------- //
export const Glock18: Weapon = {
  name: "Glock18 (Yarı otomatik tabanca)",
  itemType: ItemType.Weapon,
  rarity: Rarity.Epic,

  stack: 0,
  stackSize: 0,
  stackable: false,

  abrasion: "light",

  damage: 20,
  magazineSize: 25,

  bulletType: "pistol-bullet",

  getValue: (): number => getItemValue(Rarity.Epic),
} as Weapon;

export const Colt1911: Weapon = {
  name: "Colt M1911 (Klasik tabanca)",
  itemType: ItemType.Weapon,
  rarity: Rarity.Rare,

  stack: 0,
  stackSize: 0,
  stackable: false,

  abrasion: "light",

  damage: 20,
  magazineSize: 10,

  bulletType: "pistol-bullet",

  getValue: (): number => getItemValue(Rarity.Rare),
} as Weapon;

export const AK47: Weapon = {
  name: "AK-47 (Taarruz tüfeği)",
  itemType: ItemType.Weapon,
  rarity: Rarity.Legendary,

  stack: 0,
  stackSize: 0,
  stackable: false,

  abrasion: "light",

  damage: 40,
  magazineSize: 30,

  bulletType: "rifle-bullet",

  getValue: (): number => getItemValue(Rarity.Legendary),
} as Weapon;

export const M4A1: Weapon = {
  name: "M4A1 (Modern Amerikan tüfeği)",
  itemType: ItemType.Weapon,
  rarity: Rarity.Legendary,

  stack: 0,
  stackSize: 0,
  stackable: false,

  abrasion: "light",

  damage: 40,
  magazineSize: 35,

  bulletType: "rifle-bullet",

  getValue: (): number => getItemValue(Rarity.Legendary),
} as Weapon;

export const Remington870: Weapon = {
  name: "Remington 870 (Pompalı av tüfeği)",
  itemType: ItemType.Weapon,
  rarity: Rarity.Rare,

  stack: 0,
  stackSize: 0,
  stackable: false,

  abrasion: "light",

  damage: 35,
  magazineSize: 7,

  bulletType: "pumpgun-bullet",

  getValue: (): number => getItemValue(Rarity.Rare),
} as Weapon;

export const BarrettM82: Weapon = {
  name: "Barrett M82 (Ağır keskin nişancı tüfeği)",
  itemType: ItemType.Weapon,
  rarity: Rarity.Legendary,

  stack: 0,
  stackSize: 0,
  stackable: false,

  abrasion: "light",

  damage: 60,
  magazineSize: 5,

  bulletType: "sniper-bullet",

  getValue: (): number => getItemValue(Rarity.Legendary),
} as Weapon;

export const KaBarKnife: Weapon = {
  name: "KA-BAR Knife (Askeri bıçak)",
  itemType: ItemType.Weapon,
  rarity: Rarity.Uncommon,

  stack: 0,
  stackSize: 0,
  stackable: false,

  abrasion: "light",

  damage: 15,
  magazineSize: 0,

  getValue: (): number => getItemValue(Rarity.Uncommon),
} as Weapon;

export const Machete: Weapon = {
  name: "Pala",
  itemType: ItemType.Weapon,
  rarity: Rarity.Uncommon,

  stack: 0,
  stackSize: 0,
  stackable: false,

  abrasion: "light",

  damage: 15,
  magazineSize: 0,

  getValue: (): number => getItemValue(Rarity.Uncommon),
} as Weapon;

export const LouisvilleSlugger: Weapon = {
  name: "Louisville Slugger (Markalı beyzbol sopası)",
  itemType: ItemType.Weapon,
  rarity: Rarity.Rare,

  stack: 0,
  stackSize: 0,
  stackable: false,

  abrasion: "light",

  damage: 20,
  magazineSize: 0,

  getValue: (): number => getItemValue(Rarity.Rare),
} as Weapon;

export const StanleyCrowbar: Weapon = {
  name: "Stanley Crowbar (Levye)",
  itemType: ItemType.Weapon,
  rarity: Rarity.Rare,

  stack: 0,
  stackSize: 0,
  stackable: false,

  abrasion: "light",

  damage: 20,
  magazineSize: 0,

  getValue: (): number => getItemValue(Rarity.Rare),
} as Weapon;

export const weaponItems: Array<Weapon> = [
  Glock18,
  Colt1911,
  AK47,
  M4A1,
  Remington870,
  BarrettM82,
  KaBarKnife,
  Machete,
  LouisvilleSlugger,
  StanleyCrowbar,
];

// ---------------------- Weapon Items ---------------------- //

// ---------------------- Container Item ---------------------- //
export const Backpack: Container = {
  name: "Sırt Çantası",
  itemType: ItemType.Container,
  rarity: Rarity.Uncommon,

  capacity: 5,
  items: [],

  getValue: (): number => getItemValue(Rarity.Uncommon),
} as Container;

export const SmallContainer: Container = {
  name: "Küçük Konteyner",
  itemType: ItemType.Container,
  rarity: Rarity.Rare,

  capacity: 15,
  items: [],

  getValue: (): number => getItemValue(Rarity.Rare),
} as Container;

export const BigContainer: Container = {
  name: "Büyük Konteyner",
  itemType: ItemType.Container,
  rarity: Rarity.Epic,

  capacity: 30,
  items: [],

  getValue: (): number => getItemValue(Rarity.Epic),
} as Container;

export const containerItems: Array<Container> = [Backpack, SmallContainer, BigContainer];

// ---------------------- Container Item ---------------------- //

// ---------------------- Bullet Item ---------------------- //
export const PistolBullet: Bullet = {
  name: "Tabanca Mermisi",
  itemType: ItemType.Bullet,
  rarity: Rarity.Rare,

  stack: 0,
  stackSize: 64,
  stackable: true,

  damageBoost: 5,

  getValue: (): number => getItemValue(Rarity.Rare),
} as Bullet;

export const RifleBullet: Bullet = {
  name: "Tüfek Mermisi",
  itemType: ItemType.Bullet,
  rarity: Rarity.Epic,

  stack: 0,
  stackSize: 64,
  stackable: true,

  damageBoost: 10,

  getValue: (): number => getItemValue(Rarity.Epic),
} as Bullet;

export const SniperBullet: Bullet = {
  name: "Sniper Mermisi",
  itemType: ItemType.Bullet,
  rarity: Rarity.Legendary,

  stack: 0,
  stackSize: 64,
  stackable: true,

  damageBoost: 15,

  getValue: (): number => getItemValue(Rarity.Legendary),
} as Bullet;

export const PumpgunBullet: Bullet = {
  name: "Pompalı Tüfek Mermisi",
  itemType: ItemType.Bullet,
  rarity: Rarity.Rare,

  stack: 0,
  stackSize: 64,
  stackable: true,

  damageBoost: 15,

  getValue: (): number => getItemValue(Rarity.Rare),
} as Bullet;

export const bulletItems: Array<Bullet> = [PistolBullet, RifleBullet, SniperBullet, PumpgunBullet];

// ---------------------- Bullet Item ---------------------- //

// ---------------------- Valuable Item ---------------------- //
export const GoldRing: Valuable = {
  name: "Altın Yüzük",
  itemType: ItemType.Valuable,
  rarity: Rarity.Legendary,

  stack: 0,
  stackSize: 0,
  stackable: false,

  getValue: (): number => getItemValue(Rarity.Legendary),
} as Valuable;

export const SilverNecklace: Valuable = {
  name: "Gümüş Kolye",
  itemType: ItemType.Valuable,
  rarity: Rarity.Legendary,

  stack: 0,
  stackSize: 0,
  stackable: false,

  getValue: (): number => getItemValue(Rarity.Legendary),
} as Valuable;

export const DiamondEarring: Valuable = {
  name: "Elmas Küpe",
  itemType: ItemType.Valuable,
  rarity: Rarity.Legendary,

  stack: 0,
  stackSize: 0,
  stackable: false,

  getValue: (): number => getItemValue(Rarity.Legendary),
} as Valuable;

export const LuxuryWatch: Valuable = {
  name: "Lüks Saat",
  itemType: ItemType.Valuable,
  rarity: Rarity.Legendary,

  stack: 0,
  stackSize: 0,
  stackable: false,

  getValue: (): number => getItemValue(Rarity.Legendary),
} as Valuable;

export const OldPainting: Valuable = {
  name: "Eski Tablo",
  itemType: ItemType.Valuable,
  rarity: Rarity.Legendary,

  stack: 0,
  stackSize: 0,
  stackable: false,

  getValue: (): number => getItemValue(Rarity.Legendary),
} as Valuable;

export const valuableItems: Array<Valuable> = [GoldRing, SilverNecklace, DiamondEarring, LuxuryWatch, OldPainting];

// ---------------------- Valuable Item ---------------------- //

// ---------------------- Medical Item ---------------------- //
export const Bandage: Medical = {
  name: "Bandaj",
  itemType: ItemType.Medical,
  rarity: Rarity.Uncommon,

  stack: 0,
  stackSize: 10,
  stackable: true,

  healAmount: "low",

  effects: [Heal("low")],

  getValue: (): number => getItemValue(Rarity.Uncommon),
} as Medical;

export const Medkit: Medical = {
  name: "İlk Yardım Çantası",
  itemType: ItemType.Medical,
  rarity: Rarity.Epic,

  stack: 0,
  stackSize: 0,
  stackable: false,

  healAmount: "high",

  effects: [Heal("high"), PainRelief("high"), CureInfection("high")],

  getValue: (): number => getItemValue(Rarity.Epic),
} as Medical;

export const Painkiller: Medical = {
  name: "Ağrı Kesici",
  itemType: ItemType.Medical,
  rarity: Rarity.Rare,

  stack: 0,
  stackSize: 10,
  stackable: true,

  healAmount: "medium",

  effects: [Heal("low"), PainRelief("very-high"), CureInfection("low")],

  getValue: (): number => getItemValue(Rarity.Rare),
} as Medical;

export const AntibioticPills: Medical = {
  name: "Antibiyotik Haplar",
  itemType: ItemType.Medical,
  rarity: Rarity.Rare,

  stack: 0,
  stackSize: 10,
  stackable: true,

  healAmount: "medium",

  effects: [Heal("medium"), PainRelief("low"), CureInfection("very-high")],

  getValue: (): number => getItemValue(Rarity.Rare),
} as Medical;

export const medicalItems: Array<Medical> = [Bandage, Medkit, Painkiller, AntibioticPills];

// ---------------------- Medical Item ---------------------- //

export const allItems: Array<Food | Clothes | Weapon | Container | Bullet | Valuable | Medical> = [
  ...foodItems,
  ...clothesItems,
  ...weaponItems,
  ...containerItems,
  ...bulletItems,
  ...valuableItems,
  ...medicalItems,
];
