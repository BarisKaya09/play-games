export enum Regions {
  North = "Kuzey",
  South = "Güney",
  West = "Batı",
  East = "Doğu",
}

type Effect = "very-low" | "low" | "medium" | "high" | "very-high";

enum AreaEffects {}

type AreaEffect = {
  areaEffect: AreaEffects;
  description: string;
  effect: Effect;
};

export type Area = {
  region: Regions;
  locations: Array<Location>;
  effects: any;
};

export type Location = {};
