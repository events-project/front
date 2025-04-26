"use server";

import { accountRpcClient } from "@events-project/grpc-account";

interface RevealApiKeyParams {
  orgId: string;
  secretId: string;
}

export const revealApiKey = async ({ orgId, secretId }: RevealApiKeyParams) => {
  const result = await accountRpcClient.revealApiKey({
    appId: orgId, // ✅ explicitly pass org/app ID
    accountId: secretId, // ✅ pass the actual secret ID
  });

  return result.apiKey;
};
