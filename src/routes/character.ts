import { user } from "../libs/authentication.cognito.ts";
import { endpoint } from "../libs/constant.ts";
import { iLoggerCharacter } from "../libs/logger.ts";

export async function characterInventoryView(id: string, accessToken?: string) {
  iLoggerCharacter.verbose("characterInventoryView", user, id, accessToken);
  try {
    const response = await fetch(`${endpoint}/api/character/inventory/${id}`, {
      headers: {
        Authorization: `${user.access_token || accessToken}`,
      },
    });

    const data = await response.json();
    iLoggerCharacter.debug(data);
    return data;
  } catch (e: unknown) {
    iLoggerCharacter.error((e as Error).message);
    throw e;
  }
}
