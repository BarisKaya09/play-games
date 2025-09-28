import express from "express";
import {
  ANY_ERROR,
  DAILY_MARKET_ITEM_NOT_FOUND,
  DAILY_MARKET_NOT_FOUND,
  DIFFERENT_ITEMS,
  INVALID_AMOUNT,
  ITEM_CANNOT_BE_STACKED,
  ITEM_NOT_FOUND_IN_USER_INVENTORY,
  MARKET_IS_EMPTY,
  MARKET_ITEM_NOT_FOUND,
  MISSING_CONTENT,
  NO_STACK_TO_SPLIT,
  NOT_ENOUGH_STOCK,
  SPLIT_SIZE_CANNOT_EXCEED_STACK,
  StatusCode,
  THE_RARITY_OF_THE_ITEMS_TO_BE_STACKED_IS_NOT_THE_SAME,
  THE_TYPES_OF_ITEMS_TO_BE_STACKED_ARE_NOT_THE_SAME,
  USER_INVENTORY_NOT_FOUND,
  USER_NOT_EXIST,
  YOU_CANNOT_BUY_YOUR_OWN_ITEM,
  YOU_DONT_HAVE_ENOUGH_MONEY_FOR_THIS_ITEM,
  YOU_HAVE_EXCEEDED_THE_AMOUNT_SENSITIVITY,
  YOU_HAVE_EXCEEDED_THE_ITEM_STACK,
  YOU_HAVE_EXCEEDED_THE_ITEM_STACK_SIZE,
  type SuccessResponse,
} from "../lib/response";
import { UserRepository } from "../repository/mongodb/user";
import { InventoryRepository, type InventoryItem } from "../repository/mongodb/end-of-the-world/inventory";
import { DailyMarketRepository } from "../repository/mongodb/end-of-the-world/daily-market";
import { v4 as uuidV4 } from "uuid";
import { MarketRepository } from "../repository/mongodb/end-of-the-world/market";
import { ItemType } from "../repository/mongodb/end-of-the-world/data/items";
import { allNorthArea, allSouthArea, allWestArea, type Area } from "../repository/mongodb/end-of-the-world/data/map";

export const getUserInventory = async (req: express.Request, res: express.Response) => {
  try {
    const username: string = req.cookies.username as string;

    const userRepo = new UserRepository();
    const user = await userRepo.findUser({ username: username });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }

    const inventoryRepo = new InventoryRepository();
    const userInventory = await inventoryRepo.findOneInventory({ user_id: user.id });
    if (!userInventory) {
      res.status(USER_INVENTORY_NOT_FOUND.status).json(USER_INVENTORY_NOT_FOUND);
      return;
    }

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: userInventory } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

export const getDailyMarket = async (req: express.Request, res: express.Response) => {
  try {
    const dailyMarketRepo = new DailyMarketRepository();
    const dailyMarket = await dailyMarketRepo.findDailyMarket();
    if (!dailyMarket) {
      res.status(DAILY_MARKET_NOT_FOUND.status).json(DAILY_MARKET_NOT_FOUND);
      return;
    }

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: dailyMarket } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

type BuyItemInDailyMarketBody = {
  itemID: string;
  amount: number;
};
//TODO: Satın alınan itemın stokları tükenmesi kontrol edildi mi? şuan kafam dolu olduğu için hatırlamıyorum. sonra kontrol et. (çalışıyor diye biliyorum ama sonra yine kontrol et)
export const buyItemInDailyMarket = async (req: express.Request, res: express.Response) => {
  try {
    const { itemID, amount } = req.body as BuyItemInDailyMarketBody;

    if (!itemID || !amount) {
      res.status(MISSING_CONTENT.status).json(MISSING_CONTENT);
      return;
    }

    if (amount <= 0) {
      res.status(INVALID_AMOUNT.status).json(INVALID_AMOUNT);
      return;
    }

    const username = req.cookies.username as string;

    const userRepo = new UserRepository();
    const user = await userRepo.findUser({ username: username });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }

    const userInventoryRepo = new InventoryRepository();
    const userInventory = await userInventoryRepo.findOneInventory({ user_id: user.id });
    if (!userInventory) {
      res.status(USER_INVENTORY_NOT_FOUND.status).json(USER_INVENTORY_NOT_FOUND);
      return;
    }

    const dailyMarketRepo = new DailyMarketRepository();
    const dailyMarket = await dailyMarketRepo.findDailyMarket();
    if (!dailyMarket) {
      res.status(DAILY_MARKET_NOT_FOUND.status).json(DAILY_MARKET_NOT_FOUND);
      return;
    }
    const buyingItem = await dailyMarketRepo.findItem(itemID);
    if (!buyingItem) {
      res.status(DAILY_MARKET_ITEM_NOT_FOUND.status).json(DAILY_MARKET_ITEM_NOT_FOUND);
      return;
    }

    if (userInventory.money < buyingItem.value * amount) {
      res.status(YOU_DONT_HAVE_ENOUGH_MONEY_FOR_THIS_ITEM.status).json(YOU_DONT_HAVE_ENOUGH_MONEY_FOR_THIS_ITEM);
      return;
    }

    if (amount > buyingItem.stock) {
      res.status(NOT_ENOUGH_STOCK.status).json(NOT_ENOUGH_STOCK);
      return;
    }

    await userInventoryRepo.updateOneInventory({ user_id: user.id }, { $set: { money: userInventory.money - buyingItem.value } });

    if ("stackable" in buyingItem.item && buyingItem.item.stackable) {
      buyingItem.item.stack += amount;
      userInventory.items.push({ itemID: uuidV4(), item: buyingItem.item, value: buyingItem.value } as InventoryItem);
    } else {
      for (let i = 0; i < amount; i++) {
        userInventory.items.push({ itemID: uuidV4(), item: buyingItem.item, value: buyingItem.value } as InventoryItem);
      }
    }
    await userInventoryRepo.updateOneInventory({ user_id: user.id }, { $set: { items: userInventory.items } });

    const buyingItemIndex = dailyMarket.items.findIndex((item) => item.id == itemID);
    dailyMarket.items[buyingItemIndex].stock -= amount;
    if (dailyMarket.items[buyingItemIndex].stock <= 0) {
      dailyMarket.items = dailyMarket.items.filter((item) => item.id != itemID);
    }
    await dailyMarketRepo.updateOneDailyMarket({ id: dailyMarket.id }, { $set: { items: dailyMarket.items } });

    res.status(StatusCode.OK).json({
      status: StatusCode.OK,
      data: `${amount} adet ${buyingItem.item.name} ${buyingItem.value * amount} tutarına alındı!`,
    } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

type BuyItemInMarketBody = {
  itemID: string;
  amount: number;
};
//TODO: Doğru çalışıyor. ama başka bir kullanıcı oluşturup o kullanıcıyla markete item ekleyip denenmeli.
export const buyItemInMarket = async (req: express.Request, res: express.Response) => {
  try {
    const { itemID, amount } = req.body as BuyItemInMarketBody;
    if (!itemID || !amount) {
      res.status(MISSING_CONTENT.status).json(MISSING_CONTENT);
      return;
    }

    if (amount <= 0) {
      res.status(INVALID_AMOUNT.status).json(INVALID_AMOUNT);
      return;
    }

    const username = req.cookies.username as string;
    const userRepo = new UserRepository();
    const user = await userRepo.findUser({ username: username });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }

    const inventoryRepo = new InventoryRepository();
    const userInventory = await inventoryRepo.findOneInventory({ user_id: user.id });
    if (!userInventory) {
      res.status(USER_INVENTORY_NOT_FOUND.status).json(USER_INVENTORY_NOT_FOUND);
      return;
    }

    const marketRepo = new MarketRepository();
    let marketItems = await marketRepo.findAllItem();
    if (marketItems.length == 0) {
      res.status(MARKET_IS_EMPTY.status).json(MARKET_IS_EMPTY);
      return;
    }

    const buyingItem = marketItems.find((item) => item.itemID == itemID);
    if (!buyingItem) {
      res.status(MARKET_ITEM_NOT_FOUND.status).json(MARKET_ITEM_NOT_FOUND);
      return;
    }

    if (buyingItem.ownerID == user.id) {
      res.status(YOU_CANNOT_BUY_YOUR_OWN_ITEM.status).json(YOU_CANNOT_BUY_YOUR_OWN_ITEM);
      return;
    }

    const itemOwnerInventory = await inventoryRepo.findOneInventory({ user_id: buyingItem.ownerID });
    if (!itemOwnerInventory) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }

    if (amount > buyingItem.sellAmount) {
      res.status(NOT_ENOUGH_STOCK.status).json(NOT_ENOUGH_STOCK);
      return;
    }

    if (userInventory.money < buyingItem.value * amount) {
      res.status(YOU_DONT_HAVE_ENOUGH_MONEY_FOR_THIS_ITEM.status).json(YOU_DONT_HAVE_ENOUGH_MONEY_FOR_THIS_ITEM);
      return;
    }

    if (buyingItem.sellAmount > amount) {
      if ("stack" in buyingItem.item) {
        buyingItem.item.stack -= amount;
      }

      await marketRepo.updateOneItem({ itemID: buyingItem.itemID }, { $set: { sellAmount: buyingItem.sellAmount - amount, item: buyingItem.item } });
    } else if (buyingItem.sellAmount == amount) {
      await marketRepo.deleteOneItem({ itemID: buyingItem.itemID });
    }

    userInventory.items.push({ itemID: buyingItem.itemID, item: buyingItem.item, value: buyingItem.value } as InventoryItem);
    await inventoryRepo.updateOneInventory(
      { user_id: user.id },
      { $set: { items: userInventory.items, money: userInventory.money - buyingItem.value * amount } }
    );

    await inventoryRepo.updateOneInventory(
      { user_id: itemOwnerInventory.user_id },
      { $set: { money: itemOwnerInventory.money + buyingItem.value * amount } }
    );

    res.status(StatusCode.OK).json({
      status: StatusCode.OK,
      data: `${amount} adet ${buyingItem.item.name} ${buyingItem.value * amount} değerine satın alındı!`,
    } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

const MAX_AMOUNT: number = 100;
const MIN_AMOUNT: number = 300;
type SellItemInMarketBody = {
  itemID: string;
  value: number;
  sellAmount: number;
};
export const sellItemInMarket = async (req: express.Request, res: express.Response) => {
  try {
    const { itemID, value, sellAmount } = req.body as SellItemInMarketBody;
    if (!itemID || !value || !sellAmount) {
      res.status(MISSING_CONTENT.status).json(MISSING_CONTENT);
      return;
    }

    const username = req.cookies.username as string;
    const userRepo = new UserRepository();
    const user = await userRepo.findUser({ username: username });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }

    const inventoryRepo = new InventoryRepository();
    const userInventory = await inventoryRepo.findOneInventory({ user_id: user.id });
    if (!userInventory) {
      res.status(USER_INVENTORY_NOT_FOUND.status).json(USER_INVENTORY_NOT_FOUND);
      return;
    }

    const sellingItem = userInventory.items.find((item) => item.itemID == itemID);
    if (!sellingItem) {
      res.status(ITEM_NOT_FOUND_IN_USER_INVENTORY.status).json(ITEM_NOT_FOUND_IN_USER_INVENTORY);
      return;
    }

    if (value / sellAmount > sellingItem.value + MAX_AMOUNT || value / sellAmount < sellingItem.value - MIN_AMOUNT) {
      res.status(YOU_HAVE_EXCEEDED_THE_AMOUNT_SENSITIVITY.status).json(YOU_HAVE_EXCEEDED_THE_AMOUNT_SENSITIVITY);
      return;
    }

    if ("stack" in sellingItem.item && sellingItem.item.stackable && sellAmount > sellingItem.item.stack) {
      res.status(YOU_HAVE_EXCEEDED_THE_ITEM_STACK.status).json(YOU_HAVE_EXCEEDED_THE_ITEM_STACK);
      return;
    }

    const marketRepo = new MarketRepository();

    if ("stack" in sellingItem.item) {
      if (!sellingItem.item.stackable) {
        await marketRepo.insertItem(user.id, sellingItem.item, value, 1);

        const newUserInventory = userInventory.items.filter((item) => item.itemID != itemID);
        await inventoryRepo.updateOneInventory({ user_id: user.id }, { $set: { items: newUserInventory } });
      } else {
        if (sellingItem.item.stack == sellAmount) {
          await marketRepo.insertItem(user.id, sellingItem.item, value, sellAmount);

          const newUserInventory = userInventory.items.filter((item) => item.itemID != itemID);
          await inventoryRepo.updateOneInventory({ user_id: user.id }, { $set: { items: newUserInventory } });
        } else if (sellAmount < sellingItem.item.stack) {
          const itemStackInInventory = sellingItem.item.stack;
          sellingItem.item.stack = sellAmount;
          await marketRepo.insertItem(user.id, sellingItem.item, value, sellAmount);

          const sellingItemIndex = userInventory.items.findIndex((item) => item.itemID == sellingItem.itemID);
          if ("stack" in userInventory.items[sellingItemIndex].item) {
            userInventory.items[sellingItemIndex].item.stack = itemStackInInventory - sellAmount;
            await inventoryRepo.updateOneInventory({ user_id: user.id }, { $set: { items: userInventory.items } });
          }
        }
      }
    } else {
      await marketRepo.insertItem(user.id, sellingItem.item, value, sellAmount);

      const newUserInventory = userInventory.items.filter((item) => item.itemID != itemID);
      await inventoryRepo.updateOneInventory({ user_id: user.id }, { $set: { items: newUserInventory } });
    }

    res.status(StatusCode.OK).json({
      status: StatusCode.OK,
      data: `${sellAmount} adet ${sellingItem.item.name} ${value * sellAmount} değerine satıldı!`,
    } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

export const getMarket = async (req: express.Request, res: express.Response) => {
  try {
    const marketRepo = new MarketRepository();
    const market = await marketRepo.findAllItem();

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: market } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

type DeleteItemInMarket = {
  ownerID: string;
  itemID: string;
};
export const deleteItemInMarket = async (req: express.Request, res: express.Response) => {
  try {
    const { ownerID, itemID } = req.body as DeleteItemInMarket;
    if (!ownerID || !itemID) {
      res.status(MISSING_CONTENT.status).json(MISSING_CONTENT);
      return;
    }

    const userRepo = new UserRepository();
    const user = await userRepo.findUser({ id: ownerID });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }

    const inventoryRepo = new InventoryRepository();
    const userInventory = await inventoryRepo.findOneInventory({ user_id: user.id });
    if (!userInventory) {
      res.status(USER_INVENTORY_NOT_FOUND.status).json(USER_INVENTORY_NOT_FOUND);
      return;
    }

    const marketRepo = new MarketRepository();
    const deletedItem = await marketRepo.findOneItem({ itemID: itemID });
    if (!deletedItem) {
      res.status(MARKET_ITEM_NOT_FOUND.status).json(MARKET_ITEM_NOT_FOUND);
      return;
    }

    await marketRepo.deleteOneItem({ itemID: deletedItem.itemID });

    userInventory.items.push({ itemID: deletedItem.itemID, item: deletedItem.item, value: deletedItem.value } as InventoryItem);
    await inventoryRepo.updateOneInventory({ user_id: user.id }, { $set: { items: userInventory.items } });

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: "Eşya marketten kaldırıldı!" } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

type StackTheItemInInventoryBody = {
  subItemID: string;
  itemID: string;
};
export const stacKTheItemInInventory = async (req: express.Request, res: express.Response) => {
  try {
    const { subItemID, itemID } = req.body as StackTheItemInInventoryBody;
    if (!subItemID || !itemID) {
      res.status(MISSING_CONTENT.status).json(MISSING_CONTENT);
      return;
    }

    const username = req.cookies.username as string;
    const userRepo = new UserRepository();
    const user = await userRepo.findUser({ username: username });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }

    const inventoryRepo = new InventoryRepository();
    const userInventory = await inventoryRepo.findOneInventory({ user_id: user.id });
    if (!userInventory) {
      res.status(USER_INVENTORY_NOT_FOUND.status).json(USER_INVENTORY_NOT_FOUND);
      return;
    }

    const subItem = userInventory.items.find((item) => item.itemID == subItemID);
    if (!subItem) {
      res.status(ITEM_NOT_FOUND_IN_USER_INVENTORY.status).json(ITEM_NOT_FOUND_IN_USER_INVENTORY);
      return;
    }

    const item = userInventory.items.find((item) => item.itemID == itemID);
    if (!item) {
      res.status(ITEM_NOT_FOUND_IN_USER_INVENTORY.status).json(ITEM_NOT_FOUND_IN_USER_INVENTORY);
      return;
    }

    if (subItem.item.name != item.item.name) {
      res.status(DIFFERENT_ITEMS.status).json(DIFFERENT_ITEMS);
      return;
    }

    if (subItem.item.itemType != item.item.itemType) {
      res.status(THE_TYPES_OF_ITEMS_TO_BE_STACKED_ARE_NOT_THE_SAME.status).json(THE_TYPES_OF_ITEMS_TO_BE_STACKED_ARE_NOT_THE_SAME);
      return;
    }

    if (subItem.item.rarity != item.item.rarity) {
      res.status(THE_RARITY_OF_THE_ITEMS_TO_BE_STACKED_IS_NOT_THE_SAME.status).json(THE_RARITY_OF_THE_ITEMS_TO_BE_STACKED_IS_NOT_THE_SAME);
      return;
    }

    if ((!("stack" in subItem.item) && subItem.item.itemType == ItemType.Container) || ("stack" in subItem.item && !subItem.item.stackable)) {
      res.status(ITEM_CANNOT_BE_STACKED.status).json(ITEM_CANNOT_BE_STACKED);
      return;
    }

    if ("stack" in item.item && "stack" in subItem.item && item.item.stack + subItem.item.stack > subItem.item.stackSize) {
      res.status(YOU_HAVE_EXCEEDED_THE_ITEM_STACK_SIZE.status).json(YOU_HAVE_EXCEEDED_THE_ITEM_STACK_SIZE);
      return;
    }

    if ("stack" in subItem.item && "stack" in item.item) {
      subItem.item.stack += item.item.stack;
    }

    await inventoryRepo.updateOneInventory({ user_id: user.id }, { $set: { items: userInventory.items.filter((item) => item.itemID != itemID) } });

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: "Öğeler istiflendi!" } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

type SplitItemStackBody = {
  item: InventoryItem;
  splitSize: number;
};
export const splitItemStack = async (req: express.Request, res: express.Response) => {
  try {
    const { item, splitSize } = req.body as SplitItemStackBody;
    if (!item || !splitSize || splitSize == 0) {
      res.status(MISSING_CONTENT.status).json(MISSING_CONTENT);
      return;
    }

    if (item.item.itemType == ItemType.Container || !("stackable" in item.item)) {
      res.status(ITEM_CANNOT_BE_STACKED.status).json(ITEM_CANNOT_BE_STACKED);
      return;
    }

    if (!item.item.stackable) {
      res.status(ITEM_CANNOT_BE_STACKED.status).json(ITEM_CANNOT_BE_STACKED);
      return;
    }

    if (item.item.stack == 1) {
      res.status(NO_STACK_TO_SPLIT.status).json(NO_STACK_TO_SPLIT);
      return;
    }

    if (splitSize >= item.item.stack) {
      res.status(SPLIT_SIZE_CANNOT_EXCEED_STACK.status).json(SPLIT_SIZE_CANNOT_EXCEED_STACK);
      return;
    }

    item.item.stack -= splitSize;

    const splittedItem = JSON.parse(JSON.stringify(item)) as InventoryItem; //? kopyalama için

    if ("stackable" in splittedItem.item) {
      splittedItem.item.stack = splitSize;
    }
    splittedItem.itemID = uuidV4();

    const userRepo = new UserRepository();
    const username = req.cookies.username as string;
    const user = await userRepo.findUser({ username });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }

    const inventoryRepo = new InventoryRepository();
    const userIventory = await inventoryRepo.findOneInventory({ user_id: user.id });
    if (!userIventory) {
      res.status(USER_INVENTORY_NOT_FOUND.status).json(USER_INVENTORY_NOT_FOUND);
      return;
    }

    if (!userIventory.items.find((_item) => _item.itemID == item.itemID)) {
      res.status(ITEM_NOT_FOUND_IN_USER_INVENTORY.status).json(ITEM_NOT_FOUND_IN_USER_INVENTORY);
      return;
    }

    userIventory.items = userIventory.items.filter((_item) => _item.itemID != item.itemID);
    userIventory.items.push(item, splittedItem);
    await inventoryRepo.updateOneInventory({ user_id: user.id }, { $set: { items: userIventory.items } });

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: "Öge bölündü!" } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

type ConcatItemsBody = {
  subItem: InventoryItem;
  draggedItem: InventoryItem;
};
export const concatItems = async (req: express.Request, res: express.Response) => {
  try {
    const { subItem, draggedItem } = req.body as ConcatItemsBody;
    if (!subItem || !draggedItem) {
      res.status(MISSING_CONTENT.status).json(MISSING_CONTENT);
      return;
    }

    if (subItem.item.name != draggedItem.item.name) {
      res.status(DIFFERENT_ITEMS.status).json(DIFFERENT_ITEMS);
      return;
    }

    if (subItem.item.itemType == ItemType.Container || draggedItem.item.itemType == ItemType.Container) {
      res.status(ITEM_CANNOT_BE_STACKED.status).json(ITEM_CANNOT_BE_STACKED);
      return;
    }

    if ("stackable" in subItem.item && "stackable" in draggedItem.item) {
      if (!subItem.item.stackable && !draggedItem.item.stackable) {
        res.status(ITEM_CANNOT_BE_STACKED.status).json(ITEM_CANNOT_BE_STACKED);
        return;
      }
    }

    const userRepo = new UserRepository();
    const username = req.cookies.username as string;
    const user = await userRepo.findUser({ username });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }

    const inventoryRepo = new InventoryRepository();
    const userInventory = await inventoryRepo.findOneInventory({ user_id: user.id });
    if (!userInventory) {
      res.status(USER_INVENTORY_NOT_FOUND.status).json(USER_INVENTORY_NOT_FOUND);
      return;
    }

    const fsubItem = userInventory.items.find((item) => item.itemID == subItem.itemID);
    if (!fsubItem) {
      res.status(ITEM_NOT_FOUND_IN_USER_INVENTORY.status).json(ITEM_NOT_FOUND_IN_USER_INVENTORY);
      return;
    }

    const fdraggedItem = userInventory.items.find((item) => item.itemID == draggedItem.itemID);
    if (!fdraggedItem) {
      res.status(ITEM_NOT_FOUND_IN_USER_INVENTORY.status).json(ITEM_NOT_FOUND_IN_USER_INVENTORY);
      return;
    }

    if ("stackable" in fsubItem.item && "stackable" in fdraggedItem.item) {
      if (fsubItem.item.stackSize < fsubItem.item.stack + fdraggedItem.item.stack) {
        res.status(YOU_HAVE_EXCEEDED_THE_ITEM_STACK_SIZE.status).json(YOU_HAVE_EXCEEDED_THE_ITEM_STACK_SIZE);
        return;
      }

      fsubItem.item.stack += fdraggedItem.item.stack;
    }

    userInventory.items = userInventory.items.filter((item) => item.itemID != fdraggedItem.itemID);
    await inventoryRepo.updateOneInventory({ user_id: user.id }, { $set: { items: userInventory.items } });

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: "Ögeler istiflendi!" } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

type GetMapResponseBody = {
  region: "north" | "south" | "west" | "east";
  areas: Array<Area>;
};
export const getMap = (req: express.Request, res: express.Response) => {
  try {
    const map: Array<GetMapResponseBody> = [
      { region: "north", areas: allNorthArea } as GetMapResponseBody,
      { region: "south", areas: allSouthArea } as GetMapResponseBody,
      { region: "west", areas: allWestArea } as GetMapResponseBody,
      //TODO: East bölgesi de eklenecek
    ];

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: map } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

//TODO: Eşyaları ayırma

//TODO: Oyuncular arası trade (Ama bunun için websocet gerekecek).
