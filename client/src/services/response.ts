export type SuccessResponse<T> = {
  success: true;
  status: number;
  data: T;
};

const success = <T>(status: number, data: T): SuccessResponse<T> => {
  return {
    success: true,
    status: status,
    data: data,
  } as SuccessResponse<T>;
};

export type UnsuccessResponse = {
  success: false;
  status: number;
  error: {
    error: any;
    message: string;
  };
};

const unsuccess = (status: number, error: { error: any; message: string }): UnsuccessResponse => {
  return {
    success: false,
    status: status,
    error: error,
  } as UnsuccessResponse;
};

export const response = { success, unsuccess };
