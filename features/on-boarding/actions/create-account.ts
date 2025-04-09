"use server";

import {
  accountRpcClient,
  CreateAccountRequest,
} from "@events-project/grpc-account";
export const createAccount = async (params: CreateAccountRequest) => {
  const result = await accountRpcClient.createAccount({ id: params.id });
  return result
};
