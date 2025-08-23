import {
  AK47,
  Bandage,
  bulletItems,
  CargoPants,
  Colt1911,
  containerItems,
  DiamondEarring,
  foodItems,
  GoldRing,
  HeavyMilitaryHelmet,
  Jacket,
  LightMilitaryHelmet,
  LouisvilleSlugger,
  LuxuryWatch,
  M4A1,
  Machete,
  Meat,
  medicalItems,
  MilitaryBoots,
  MilitaryJacket,
  MotorcycleHelmet,
  OldPainting,
  Pants,
  PistolBullet,
  PumpgunBullet,
  Remington870,
  RifleBullet,
  RottenMeat,
  Shorts,
  SilverNecklace,
  Sneakers,
  StanleyCrowbar,
  Sweater,
  TShirt,
  Water,
  weaponItems,
  type Item,
} from "./items";

type Effect = "very-low" | "low" | "medium" | "high" | "very-high";

// *************************** Region ***************************
export enum Regions {
  North = "Kuzey",
  South = "Güney",
  West = "Batı",
  East = "Doğu",
}

enum RegionEffects {
  Cold = "Cold",
  Hot = "Hot",
  Normal = "Normal",
  HuntingOpportunity = "HuntingOpportunity", // av fırsatı
  WildAnimalThreat = "WildAnimalThreat",
}

export type RegionEffect = {
  regionEffect: RegionEffects;
  description: string;
  effect: Effect;
};

const Cold = (effect: Effect): RegionEffect => {
  return {
    regionEffect: RegionEffects.Cold,
    description: "Soğuk",
    effect: effect,
  } as RegionEffect;
};

const Hot = (effect: Effect): RegionEffect => {
  return {
    regionEffect: RegionEffects.Hot,
    description: "Sıcak",
    effect: effect,
  } as RegionEffect;
};

const Normal = (effect: Effect): RegionEffect => {
  return {
    regionEffect: RegionEffects.Normal,
    description: "Normal",
    effect: effect,
  } as RegionEffect;
};

const HuntingOpportunity = (effect: Effect): RegionEffect => {
  return {
    regionEffect: RegionEffects.HuntingOpportunity,
    description: "Av Fırsatı",
    effect: effect,
  } as RegionEffect;
};

const WildAnimalThreat = (effect: Effect): RegionEffect => {
  return {
    regionEffect: RegionEffects.WildAnimalThreat,
    description: "Vahşi Hayvan Tehdidi",
  } as RegionEffect;
};

export type Region = {
  region: Regions;
  difficulty: "easy" | "medium" | "hard";
  items: Array<Item>;
  effects: Array<RegionEffect>;
};

export const North: Region = {
  region: Regions.North,
  difficulty: "hard",
  items: [
    ...foodItems,
    Sweater,
    Jacket,
    MilitaryJacket,
    Pants,
    CargoPants,
    MilitaryBoots,
    LightMilitaryHelmet,
    HeavyMilitaryHelmet,
    ...weaponItems,
    ...containerItems,
    ...bulletItems,
    ...medicalItems,
  ],
  effects: [Cold("very-high"), HuntingOpportunity("high"), WildAnimalThreat("high")],
} as Region;

export const South: Region = {
  region: Regions.South,
  difficulty: "medium",
  items: [
    Water,
    Meat,
    RottenMeat,
    TShirt,
    Shorts,
    MotorcycleHelmet,
    Colt1911,
    AK47,
    Remington870,
    Machete,
    LouisvilleSlugger,
    StanleyCrowbar,
    ...containerItems,
    PistolBullet,
    RifleBullet,
    PumpgunBullet,
    GoldRing,
    SilverNecklace,
    DiamondEarring,
    Bandage,
  ],
  effects: [Hot("very-high"), HuntingOpportunity("medium"), WildAnimalThreat("high")],
} as Region;

export const West: Region = {
  region: Regions.West,
  difficulty: "medium",
  items: [
    ...foodItems,
    TShirt,
    Shorts,
    Pants,
    Sneakers,
    Colt1911,
    M4A1,
    Remington870,
    Machete,
    LouisvilleSlugger,
    StanleyCrowbar,
    ...containerItems,
    PistolBullet,
    RifleBullet,
    PumpgunBullet,
    LuxuryWatch,
    OldPainting,
    ...medicalItems,
  ],
  effects: [Normal("very-high"), HuntingOpportunity("low")],
} as Region;

export const East: Region = {
  region: Regions.East,
  difficulty: "medium",
  items: [
    Water,
    Meat,
    RottenMeat,
    TShirt,
    Shorts,
    Pants,
    Sneakers,
    MotorcycleHelmet,
    Colt1911,
    AK47,
    Remington870,
    Machete,
    LouisvilleSlugger,
    StanleyCrowbar,
    ...containerItems,
    PistolBullet,
    RifleBullet,
    PumpgunBullet,
    Bandage,
  ],
  effects: [Hot("medium"), HuntingOpportunity("medium"), WildAnimalThreat("high")],
} as Region;

// *************************** Region ***************************

// *************************** Area ***************************
enum AreaEffects {}

type AreaEffect = {
  areaEffect: AreaEffects;
  description: string;
  effect: Effect;
};

export type Area = {
  region: Region;
  locations: Array<Location>;
  effects: AreaEffect;
};

// *************************** Area ***************************

export type Location = {};
