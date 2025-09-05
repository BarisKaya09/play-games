import {
  AK47,
  AncientIcefish,
  ArcticChar,
  Bandage,
  bulletItems,
  CargoPants,
  Colt1911,
  containerItems,
  CrystalCarp,
  DiamondEarring,
  foodItems,
  GoldRing,
  HeavyMilitaryHelmet,
  IceSalmon,
  ItemType,
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
  NorthernPike,
  OldPainting,
  Pants,
  Perch,
  PistolBullet,
  PumpgunBullet,
  Remington870,
  RifleBullet,
  RottenMeat,
  Shorts,
  SilverNecklace,
  SmallTrout,
  Sneakers,
  StanleyCrowbar,
  Sweater,
  TShirt,
  Water,
  weaponItems,
  Whitefish,
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
  name: string;
  difficulty: "easy" | "medium" | "hard";
  items: Array<Item>;
  effects: Array<RegionEffect>;
};

export const North: Region = {
  region: Regions.North,
  name: "Kuzey",
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
  name: "Güney",
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
  name: "Batı",
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
  name: "Doğu",
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
enum AreaEffects {
  AmbushRisk = "AmbushRisk",
  TrapHazard = "TrapHazard",
  ThinIceDanger = "ThinIceDanger",
  BanditThreat = "BanditThreat",
}

type AreaEffect = {
  areaEffect: AreaEffects;
  description: string;
  effect: Effect;
};

const AmbushRisk = (effect: Effect): AreaEffect => {
  return {
    areaEffect: AreaEffects.AmbushRisk,
    description: "Yağmacı çeteler pusuda olabilir.",
    effect: effect,
  } as AreaEffect;
};

const TrapHazard = (effect: Effect): AreaEffect => {
  return {
    areaEffect: AreaEffects.TrapHazard,
    description: "Eski mayınlar veya patlayıcılar olabilir.",
    effect: effect,
  } as AreaEffect;
};

const ThinIceDanger = (effect: Effect): AreaEffect => {
  return {
    areaEffect: AreaEffects.ThinIceDanger,
    description: "Buz kırılırsa hasar veya ölüm riski.",
    effect: effect,
  } as AreaEffect;
};

const BanditThreat = (effect: Effect): AreaEffect => {
  return {
    areaEffect: AreaEffects.BanditThreat,
    description: "BanditThreat",
    effect: effect,
  } as AreaEffect;
};

export type Area = {
  region: Region;
  name: string;
  description: string;
  items: Array<Item>;
  effects: Array<AreaEffect>;
};

// *************************** North Areas ***************************

export const MilitaryBase: Area = {
  region: North,
  name: "Askeri Üs",
  description:
    "Eski bir askeri üs. Çevrede terk edilmiş barakalar, mühimmat sandıkları ve ilaç depoları bulunur. Burada genellikle silahlar, cephaneler ve tıbbi malzemeler bulunabilir. Ayrıca askeri teçhizat ve zırh parçaları da keşfedilebilir. Ancak üs, geçmiş savaşın izlerini taşır; tehlikeli olabilir",
  items: [
    ...North.items.filter(
      (item) =>
        item.itemType == ItemType.Weapon ||
        item.itemType == ItemType.Bullet ||
        item.itemType == ItemType.Medical ||
        (item.itemType == ItemType.Clothes &&
          (item.name == MilitaryJacket.name ||
            item.name == CargoPants.name ||
            item.name == LightMilitaryHelmet.name ||
            item.name == HeavyMilitaryHelmet.name))
    ),
  ],
  effects: [AmbushRisk("high"), TrapHazard("medium")],
} as Area;

export const FrozenLakeArea: Area = {
  region: North,
  name: "Donmuş Göl",
  description:
    "Donmuş bir göl. Buz tabakasının altında yaşam hâlâ devam ediyor. Burada oltayla veya basit araçlarla balık tutulabilir. Çoğunlukla küçük alabalık (Small Trout), levrek (Perch), kutup balığı (Arctic Char), turna (Northern Pike) ve beyaz balık (Whitefish) bulunur. Daha nadir olarak buz somonu (Ice Salmon), kristal sazan (Crystal Carp) ve efsanevi eski buz balığı (Ancient Icefish) yakalanabilir. Ancak buzun kırılma tehlikesi her zaman vardır.",
  items: [
    ...North.items.filter(
      (item) =>
        item.itemType == ItemType.Food &&
        (item.name == SmallTrout.name ||
          item.name == Perch.name ||
          item.name == ArcticChar.name ||
          item.name == NorthernPike.name ||
          item.name == Whitefish.name ||
          item.name == IceSalmon.name ||
          item.name == CrystalCarp.name ||
          item.name == AncientIcefish.name)
    ),
  ],
  effects: [ThinIceDanger("medium")],
} as Area;

export const AbandonedVillageArea: Area = {
  region: North,
  name: "Terk Edilmiş Köy",
  description:
    "Yıllar önce terk edilmiş, yıkık dökük bir köy. Harabelerde yiyecek kalıntıları, eski sandıklar ve bazı tıbbi malzemeler bulunabilir. Ayrıca köylülerden kalma giysiler (kazak, mont, pantolon) de ele geçirilebilir. Ancak köy, yağmacıların uğrak noktası olabilir ve yapıların çökme tehlikesi vardır.",
  items: [
    ...North.items.filter(
      (item) =>
        item.itemType == ItemType.Food ||
        item.itemType == ItemType.Container ||
        item.itemType == ItemType.Medical ||
        item.name == Sweater.name ||
        item.name == Jacket.name ||
        item.name == Pants.name
    ),
  ],
  effects: [BanditThreat("high")],
} as Area;

// *************************** North Areas ***************************

// *************************** Area ***************************
