// actions/getSecret.ts
"use server";

import { accountRpcClient } from "@events-project/grpc-account";

export const getSecret = async (orgId: string): Promise<string> => {
  const result = await accountRpcClient.getSecret({ orgId });
  return result.secretId;
};
