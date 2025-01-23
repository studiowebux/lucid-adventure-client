import { user } from "../libs/authentication.cognito.ts";
import { endpoint } from "../libs/constant.ts";
import { iLoggerAccount } from "../libs/logger.ts";

export async function createOrLoadAccount(accessToken?: string) {
  iLoggerAccount.verbose("createOrLoadAccount");
  try {
    const response = await fetch(`${endpoint}/api/account`, {
      headers: {
        Authorization: `${user.access_token || accessToken}`,
      },
    });

    const data = await response.json();
    iLoggerAccount.debug(data);
    return data;
  } catch (e: unknown) {
    iLoggerAccount.error((e as Error).message);
    throw e;
  }
}
