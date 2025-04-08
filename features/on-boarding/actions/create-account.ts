"use server";

import {
    accountRpcClient,
    CreateAccountRequest,
    GetAccountRequest,
} from "@events-project/grpc-account";


export const createAccount = async (params: CreateAccountRequest) => {
  const result = await accountRpcClient.createAccount({ id: params.id });
  return result
};

//TODO: move to diff file of action
export const getAccountId = async (params: GetAccountRequest) => {
    const result = await accountRpcClient.getAccount({ id: params.id });
    return result
};
