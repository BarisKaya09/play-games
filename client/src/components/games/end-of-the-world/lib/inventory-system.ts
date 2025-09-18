import type { InventoryItem } from "../../../../services/EndOfTheWorldService";

const MAX_INVENTORY_GRID = 100;

export type InvGrid = {
  index: number;
  inventoryItem?: InventoryItem;
  empty: boolean;
};

export class InventorySystem {
  private invGrids: Array<InvGrid> = [];
  private user_id: string = ""; //? gerek olmayabilir
  private money: number = 0;

  constructor(cachedInvGrids?: Array<InvGrid>) {
    if (cachedInvGrids) {
      this.invGrids = cachedInvGrids;
      return;
    }

    for (let i = 0; i < MAX_INVENTORY_GRID; i++) {
      this.invGrids.push({
        index: i,
        empty: true,
      } as InvGrid);
    }
  }

  public setUserID(user_id: string) {
    this.user_id = user_id;
  }

  public getUserID(): string {
    return this.user_id;
  }

  public setMoney(money: number) {
    this.money = money;
  }

  public getMoney(): number {
    return this.money;
  }

  public getInvGrids(): Array<InvGrid> {
    return this.invGrids;
  }

  public getInvGrid(index: number): InvGrid {
    return this.invGrids.find((_, i) => i == index) || ({} as InvGrid);
  }

  public placeItem(index: number, item: InventoryItem) {
    this.invGrids[index].inventoryItem = item;
    this.invGrids[index].empty = false;
  }

  public chnageItemPlace(currentPlace: InvGrid, targetPlace: InvGrid) {
    if (currentPlace.empty) return;

    let cp = this.getInvGrid(currentPlace.index);
    let tp = this.getInvGrid(targetPlace.index);

    if (targetPlace.empty) {
      tp.inventoryItem = cp.inventoryItem;
      tp.empty = false;

      cp.inventoryItem = undefined;
      cp.empty = true;
    } else {
      const cpCopy = { ...cp };
      const tpCopy = { ...tp };

      cp.empty = tpCopy.empty;
      cp.inventoryItem = tpCopy.inventoryItem;

      tp.empty = cpCopy.empty;
      tp.inventoryItem = cpCopy.inventoryItem;
    }
  }

  public getAllItems(): Array<InventoryItem> {
    return this.invGrids.filter((grid) => !grid.empty).map((grid) => grid.inventoryItem || ({} as InventoryItem));
  }
}
