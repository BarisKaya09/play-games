export enum StatusCode {
  OK = 200,

  NotFound = 404,
  BadRequest = 400,
  Unauthorized = 401,
  Forbiden = 403, // Yetersiz yetki hatasi

  InternalServerError = 500,
}

export enum Error {
  ANY_ERROR = "ANY_ERROR",

  MISSING_CONTENT = "MISSING_CONTENT",
  INVALID_MAIL_ADDR = "INVALID_MAIL_ADDR",
  INVALID_PASSWORD_LEN = "INVALID_PASSWORD_LEN",

  USER_EXIST = "USER_EXIST",
  USER_NOT_EXIST = "USER_NOT_EXIST",

  WRONG_PASSWORD = "WRONG_PASSWORD",

  UNAUTHORIZED = "UNAUTHORIZED",

  SAME_USERNAME = "SAME_USERNAME",
  SAME_EMAIL = "SAME_EMAIL",

  ITEM_NOT_FOUND = "ITEM_NOT_FOUND",
  ITEM_TYPE_NOT_FOUND = "ITEM_TYPE_NOT_FOUND",
  ITEM_CANNOT_BE_STACKED = "ITEM_CANNOT_BE_STACKED",
  DIFFERENT_ITEMS = "DIFFERENT_ITEMS",
  THE_TYPES_OF_ITEMS_TO_BE_STACKED_ARE_NOT_THE_SAME = "THE_TYPES_OF_ITEMS_TO_BE_STACKED_ARE_NOT_THE_SAME",
  YOU_HAVE_EXCEEDED_THE_ITEM_STACK_SIZE = "YOU_HAVE_EXCEEDED_THE_ITEM_STACK_SIZE",
  THE_RARITY_OF_THE_ITEMS_TO_BE_STACKED_IS_NOT_THE_SAME = "THE_RARITY_OF_THE_ITEMS_TO_BE_STACKED_IS_NOT_THE_SAME",

  USER_INVENTORY_NOT_FOUND = "USER_INVENTORY_NOT_FOUND",

  DAILY_MARKET_NOT_FOUND = "DAILY_MARKET_NOT_FOUND",
  DAILY_MARKET_ITEM_NOT_FOUND = "DAILY_MARKET_ITEM_NOT_FOUND",

  YOU_DONT_HAVE_ENOUGH_MONEY_FOR_THIS_ITEM = "YOU_DONT_HAVE_ENOUGH_MONEY_FOR_THIS_ITEM",
  NOT_ENOUGH_STOCK = "NOT_ENOUGH_STOCK",
  INVALID_AMOUNT = "INVALID_AMOUNT",

  ITEM_NOT_FOUND_IN_USER_INVENTORY = "ITEM_NOT_FOUND_IN_USER_INVENTORY",
  YOU_HAVE_EXCEEDED_THE_AMOUNT_SENSITIVITY = "YOU_HAVE_EXCEEDED_THE_AMOUNT_SENSITIVITY",
  YOU_HAVE_EXCEEDED_THE_ITEM_STACK = "YOU_HAVE_EXCEEDED_THE_ITEM_STACK",

  MARKET_IS_EMPTY = "MARKET_IS_EMPTY",
  MARKET_ITEM_NOT_FOUND = "MARKET_ITEM_NOT_FOUND",
  YOU_CANNOT_BUY_YOUR_OWN_ITEM = "YOU_CANNOT_BUY_YOUR_OWN_ITEM",
}

export enum ErrorMessage {
  ANY_ERROR = "Bir hata oluştu!",

  MISSING_CONTENT = "Eksik içerik gönderildi!",

  INVALID_MAIL_ADDR = "Geçersiz mail adresi!",
  INVALID_PASSWORD_LEN = "Şifreniz 7 karakterden küçük veya 50 karakterden büyük olamaz!",

  USER_EXIST = "Kullanıcı mevcut!",
  USER_NOT_EXIST = "Kullanıcı mevcut değil!",

  WRONG_PASSWORD = "Yanlış şifre!",

  UNAUTHORIZED = "Giriş yapmalısın!",

  SAME_USERNAME = "Yeni girdiğiniz kullanıcı adı eskisiyle aynı!",
  SAME_EMAIL = "Yeni girdiğiniz email adresi eskisiyle aynı!",

  ITEM_NOT_FOUND = "İtem bulunamadı!",
  ITEM_TYPE_NOT_FOUND = "Böyle bir item tipi yok!",
  ITEM_CANNOT_BE_STACKED = "İtem İstiflenemez!",
  DIFFERENT_ITEMS = "İtemler farklı!",
  THE_TYPES_OF_ITEMS_TO_BE_STACKED_ARE_NOT_THE_SAME = "İstiflenmek istenilen öğelerin tipleri aynı değil!",
  YOU_HAVE_EXCEEDED_THE_ITEM_STACK_SIZE = "Öğe istif sınırını aştınız!",
  THE_RARITY_OF_THE_ITEMS_TO_BE_STACKED_IS_NOT_THE_SAME = "İstiflenmek istenen öğelerin nadirlikleri aynı değil!",

  USER_INVENTORY_NOT_FOUND = "Kullanıcı envanteri bulunamadı!",

  DAILY_MARKET_NOT_FOUND = "Günlük market bulunamadı!",
  DAILY_MARKET_ITEM_NOT_FOUND = "Günlük markette bu item bulunamadı!",

  YOU_DONT_HAVE_ENOUGH_MONEY_FOR_THIS_ITEM = "Bu ürün için yeterli paranız yok!",
  NOT_ENOUGH_STOCK = "Yeterli stok yok!",
  INVALID_AMOUNT = "Geçersiz adet!",

  ITEM_NOT_FOUND_IN_USER_INVENTORY = "Envanterinizde bu item bulunamadı!",
  YOU_HAVE_EXCEEDED_THE_AMOUNT_SENSITIVITY = "Tutar hassasiyetini aştınız!",
  YOU_HAVE_EXCEEDED_THE_ITEM_STACK = "Bu kadar ürünu stoğunuz yok!",

  MARKET_IS_EMPTY = "Market Boş!",
  MARKET_ITEM_NOT_FOUND = "Markette bu item bulunamadı!",
  YOU_CANNOT_BUY_YOUR_OWN_ITEM = "Kendi ürününüzü satın alamazsınız!",
}

export type SuccessResponse = {
  status: StatusCode;
  data: any;
};

type UnsuccessResponse = {
  status: StatusCode;
  error: {
    error: Error;
    message: ErrorMessage;
  };
};

export const ANY_ERROR: UnsuccessResponse = {
  status: StatusCode.InternalServerError,
  error: {
    error: Error.ANY_ERROR,
    message: ErrorMessage.ANY_ERROR,
  },
};

export const MISSING_CONTENT: UnsuccessResponse = {
  status: StatusCode.BadRequest,
  error: {
    error: Error.MISSING_CONTENT,
    message: ErrorMessage.MISSING_CONTENT,
  },
};

export const INVALID_MAIL_ADDR: UnsuccessResponse = {
  status: StatusCode.BadRequest,
  error: {
    error: Error.INVALID_MAIL_ADDR,
    message: ErrorMessage.INVALID_MAIL_ADDR,
  },
};

export const INVALID_PASSWORD_LEN: UnsuccessResponse = {
  status: StatusCode.BadRequest,
  error: {
    error: Error.INVALID_PASSWORD_LEN,
    message: ErrorMessage.INVALID_PASSWORD_LEN,
  },
};

export const USER_EXIST: UnsuccessResponse = {
  status: StatusCode.BadRequest,
  error: {
    error: Error.USER_EXIST,
    message: ErrorMessage.USER_EXIST,
  },
};

export const USER_NOT_EXIST: UnsuccessResponse = {
  status: StatusCode.NotFound,
  error: {
    error: Error.USER_NOT_EXIST,
    message: ErrorMessage.USER_NOT_EXIST,
  },
};

export const WRONG_PASSWORD: UnsuccessResponse = {
  status: StatusCode.BadRequest,
  error: {
    error: Error.WRONG_PASSWORD,
    message: ErrorMessage.WRONG_PASSWORD,
  },
};

export const UNAUTHORIZED: UnsuccessResponse = {
  status: StatusCode.Unauthorized,
  error: {
    error: Error.UNAUTHORIZED,
    message: ErrorMessage.UNAUTHORIZED,
  },
};

export const SAME_USERNAME: UnsuccessResponse = {
  status: StatusCode.BadRequest,
  error: {
    error: Error.SAME_USERNAME,
    message: ErrorMessage.SAME_USERNAME,
  },
};

export const SAME_EMAIL: UnsuccessResponse = {
  status: StatusCode.BadRequest,
  error: {
    error: Error.SAME_EMAIL,
    message: ErrorMessage.SAME_EMAIL,
  },
};

export const ITEM_NOT_FOUND: UnsuccessResponse = {
  status: StatusCode.NotFound,
  error: {
    error: Error.ITEM_NOT_FOUND,
    message: ErrorMessage.ITEM_NOT_FOUND,
  },
} as UnsuccessResponse;

export const ITEM_TYPE_NOT_FOUND: UnsuccessResponse = {
  status: StatusCode.NotFound,
  error: {
    error: Error.ITEM_TYPE_NOT_FOUND,
    message: ErrorMessage.ITEM_TYPE_NOT_FOUND,
  },
} as UnsuccessResponse;

export const USER_INVENTORY_NOT_FOUND: UnsuccessResponse = {
  status: StatusCode.NotFound,
  error: {
    error: Error.USER_INVENTORY_NOT_FOUND,
    message: ErrorMessage.USER_INVENTORY_NOT_FOUND,
  },
} as UnsuccessResponse;

export const DAILY_MARKET_NOT_FOUND: UnsuccessResponse = {
  status: StatusCode.NotFound,
  error: {
    error: Error.DAILY_MARKET_NOT_FOUND,
    message: ErrorMessage.DAILY_MARKET_NOT_FOUND,
  },
} as UnsuccessResponse;

export const DAILY_MARKET_ITEM_NOT_FOUND: UnsuccessResponse = {
  status: StatusCode.NotFound,
  error: {
    error: Error.DAILY_MARKET_ITEM_NOT_FOUND,
    message: ErrorMessage.DAILY_MARKET_ITEM_NOT_FOUND,
  },
} as UnsuccessResponse;

export const YOU_DONT_HAVE_ENOUGH_MONEY_FOR_THIS_ITEM: UnsuccessResponse = {
  status: StatusCode.BadRequest,
  error: {
    error: Error.YOU_DONT_HAVE_ENOUGH_MONEY_FOR_THIS_ITEM,
    message: ErrorMessage.YOU_DONT_HAVE_ENOUGH_MONEY_FOR_THIS_ITEM,
  },
} as UnsuccessResponse;

export const NOT_ENOUGH_STOCK: UnsuccessResponse = {
  status: StatusCode.BadRequest,
  error: {
    error: Error.NOT_ENOUGH_STOCK,
    message: ErrorMessage.NOT_ENOUGH_STOCK,
  },
} as UnsuccessResponse;

export const INVALID_AMOUNT: UnsuccessResponse = {
  status: StatusCode.BadRequest,
  error: {
    error: Error.INVALID_AMOUNT,
    message: ErrorMessage.INVALID_AMOUNT,
  },
} as UnsuccessResponse;

export const ITEM_NOT_FOUND_IN_USER_INVENTORY: UnsuccessResponse = {
  status: StatusCode.NotFound,
  error: {
    error: Error.ITEM_NOT_FOUND_IN_USER_INVENTORY,
    message: ErrorMessage.ITEM_NOT_FOUND_IN_USER_INVENTORY,
  },
} as UnsuccessResponse;

export const YOU_HAVE_EXCEEDED_THE_AMOUNT_SENSITIVITY: UnsuccessResponse = {
  status: StatusCode.BadRequest,
  error: {
    error: Error.YOU_HAVE_EXCEEDED_THE_AMOUNT_SENSITIVITY,
    message: ErrorMessage.YOU_HAVE_EXCEEDED_THE_AMOUNT_SENSITIVITY,
  },
} as UnsuccessResponse;

export const YOU_HAVE_EXCEEDED_THE_ITEM_STACK: UnsuccessResponse = {
  status: StatusCode.BadRequest,
  error: {
    error: Error.YOU_HAVE_EXCEEDED_THE_ITEM_STACK,
    message: ErrorMessage.YOU_HAVE_EXCEEDED_THE_ITEM_STACK,
  },
} as UnsuccessResponse;

export const MARKET_IS_EMPTY: UnsuccessResponse = {
  status: StatusCode.NotFound,
  error: {
    error: Error.MARKET_IS_EMPTY,
    message: ErrorMessage.MARKET_IS_EMPTY,
  },
} as UnsuccessResponse;

export const MARKET_ITEM_NOT_FOUND: UnsuccessResponse = {
  status: StatusCode.NotFound,
  error: {
    error: Error.MARKET_ITEM_NOT_FOUND,
    message: ErrorMessage.MARKET_ITEM_NOT_FOUND,
  },
} as UnsuccessResponse;

export const YOU_CANNOT_BUY_YOUR_OWN_ITEM: UnsuccessResponse = {
  status: StatusCode.BadRequest,
  error: {
    error: Error.YOU_CANNOT_BUY_YOUR_OWN_ITEM,
    message: ErrorMessage.YOU_CANNOT_BUY_YOUR_OWN_ITEM,
  },
} as UnsuccessResponse;

export const ITEM_CANNOT_BE_STACKED: UnsuccessResponse = {
  status: StatusCode.BadRequest,
  error: {
    error: Error.ITEM_CANNOT_BE_STACKED,
    message: ErrorMessage.ITEM_CANNOT_BE_STACKED,
  },
} as UnsuccessResponse;

export const YOU_HAVE_EXCEEDED_THE_ITEM_STACK_SIZE: UnsuccessResponse = {
  status: StatusCode.BadRequest,
  error: {
    error: Error.YOU_HAVE_EXCEEDED_THE_ITEM_STACK_SIZE,
    message: ErrorMessage.YOU_HAVE_EXCEEDED_THE_ITEM_STACK_SIZE,
  },
} as UnsuccessResponse;

export const THE_RARITY_OF_THE_ITEMS_TO_BE_STACKED_IS_NOT_THE_SAME: UnsuccessResponse = {
  status: StatusCode.BadRequest,
  error: {
    error: Error.THE_RARITY_OF_THE_ITEMS_TO_BE_STACKED_IS_NOT_THE_SAME,
    message: ErrorMessage.THE_RARITY_OF_THE_ITEMS_TO_BE_STACKED_IS_NOT_THE_SAME,
  },
} as UnsuccessResponse;

export const THE_TYPES_OF_ITEMS_TO_BE_STACKED_ARE_NOT_THE_SAME: UnsuccessResponse = {
  status: StatusCode.BadRequest,
  error: {
    error: Error.THE_TYPES_OF_ITEMS_TO_BE_STACKED_ARE_NOT_THE_SAME,
    message: ErrorMessage.THE_TYPES_OF_ITEMS_TO_BE_STACKED_ARE_NOT_THE_SAME,
  },
} as UnsuccessResponse;

export const DIFFERENT_ITEMS: UnsuccessResponse = {
  status: StatusCode.BadRequest,
  error: {
    error: Error.DIFFERENT_ITEMS,
    message: ErrorMessage.DIFFERENT_ITEMS,
  },
} as UnsuccessResponse;
