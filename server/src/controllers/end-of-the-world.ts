import express from "express";
import {
  ANY_ERROR,
  DAILY_MARKET_ITEM_NOT_FOUND,
  DAILY_MARKET_NOT_FOUND,
  INVALID_AMOUNT,
  ITEM_NOT_FOUND_IN_USER_INVENTORY,
  MARKET_IS_EMPTY,
  MARKET_ITEM_NOT_FOUND,
  MISSING_CONTENT,
  NOT_ENOUGH_STOCK,
  StatusCode,
  USER_INVENTORY_NOT_FOUND,
  USER_NOT_EXIST,
  YOU_CANNOT_BUY_YOUR_OWN_ITEM,
  YOU_DONT_HAVE_ENOUGH_MONEY_FOR_THIS_ITEM,
  YOU_HAVE_EXCEEDED_THE_AMOUNT_SENSITIVITY,
  YOU_HAVE_EXCEEDED_THE_ITEM_STACK,
  type SuccessResponse,
} from "../lib/response";
import { UserRepository } from "../repository/mongodb/user";
import { InventoryRepository, type InventoryItem } from "../repository/mongodb/end-of-the-world/inventory";
import { DailyMarketRepository } from "../repository/mongodb/end-of-the-world/daily-market";
import { v4 as uuidV4 } from "uuid";
import { MarketRepository } from "../repository/mongodb/end-of-the-world/market";

export const getUserInventory = async (req: express.Request, res: express.Response) => {
  try {
    const username: string = req.cookies.username as string;

    const userRepo = new UserRepository(process.env.MONGODB_URI as string);
    const user = await userRepo.findUser({ username: username });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }
    await userRepo.close();

    const inventoryRepo = new InventoryRepository(process.env.MONGODB_URI as string);
    const userInventory = await inventoryRepo.findOneInventory({ user_id: user.id });
    if (!userInventory) {
      res.status(USER_INVENTORY_NOT_FOUND.status).json(USER_INVENTORY_NOT_FOUND);
      return;
    }
    await inventoryRepo.close();

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: userInventory } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

export const getDailyMarket = async (req: express.Request, res: express.Response) => {
  try {
    const dailyMarketRepo = new DailyMarketRepository(process.env.MONGODB_URI as string);
    const dailyMarket = await dailyMarketRepo.findDailyMarket();
    if (!dailyMarket) {
      res.status(DAILY_MARKET_NOT_FOUND.status).json(DAILY_MARKET_NOT_FOUND);
      return;
    }
    await dailyMarketRepo.close();

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

    const userRepo = new UserRepository(process.env.MONGODB_URI as string);
    const user = await userRepo.findUser({ username: username });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }
    await userRepo.close();

    const userInventoryRepo = new InventoryRepository(process.env.MONGODB_URI as string);
    const userInventory = await userInventoryRepo.findOneInventory({ user_id: user.id });
    if (!userInventory) {
      res.status(USER_INVENTORY_NOT_FOUND.status).json(USER_INVENTORY_NOT_FOUND);
      return;
    }

    const dailyMarketRepo = new DailyMarketRepository(process.env.MONGODB_URI as string);
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
    await userInventoryRepo.close();

    const buyingItemIndex = dailyMarket.items.findIndex((item) => item.id == itemID);
    dailyMarket.items[buyingItemIndex].stock -= amount;
    if (dailyMarket.items[buyingItemIndex].stock <= 0) {
      dailyMarket.items = dailyMarket.items.filter((item) => item.id != itemID);
    }
    await dailyMarketRepo.updateOneDailyMarket({ id: dailyMarket.id }, { $set: { items: dailyMarket.items } });
    await dailyMarketRepo.close();

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
    const userRepo = new UserRepository(process.env.MONGODB_URI as string);
    const user = await userRepo.findUser({ username: username });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }

    const inventoryRepo = new InventoryRepository(process.env.MONGODB_URI as string);
    const userInventory = await inventoryRepo.findOneInventory({ user_id: user.id });
    if (!userInventory) {
      res.status(USER_INVENTORY_NOT_FOUND.status).json(USER_INVENTORY_NOT_FOUND);
      return;
    }

    const marketRepo = new MarketRepository(process.env.MONGODB_URI as string);
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

    await userRepo.close();
    await inventoryRepo.close();
    await marketRepo.close();

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
    const userRepo = new UserRepository(process.env.MONGODB_URI as string);
    const user = await userRepo.findUser({ username: username });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }
    await userRepo.close();

    const inventoryRepo = new InventoryRepository(process.env.MONGODB_URI as string);
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

    const marketRepo = new MarketRepository(process.env.MONGODB_URI as string);

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

    await marketRepo.close();
    await inventoryRepo.close();

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
    const marketRepo = new MarketRepository(process.env.MONGODB_URI as string);
    const market = await marketRepo.findAllItem();
    await marketRepo.close();

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: market } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};
