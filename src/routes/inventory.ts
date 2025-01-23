import { user } from "../libs/authentication.cognito.ts";
import { endpoint } from "../libs/constant.ts";
import { iLoggerInventory } from "../libs/logger.ts";
import { State } from "../libs/type.ts";

export async function inventoryView(characterId: string, accessToken?: string) {
  iLoggerInventory.verbose("inventoryView");
  try {
    const response = await fetch(`${endpoint}/api/inventory/${characterId}`, {
      headers: {
        Authorization: `${user.access_token || accessToken}`,
      },
    });

    const data = await response.json();
    iLoggerInventory.debug(data);
    return data;
  } catch (e: unknown) {
    iLoggerInventory.error((e as Error).message);
    throw e;
  }
}

export async function inventoryHandler(
  value: string,
  state: State,
  characterId: string,
  accessToken?: string,
) {
  iLoggerInventory.verbose("inventoryHandler");
  try {
    const response = await fetch(`${endpoint}/api/inventory/${characterId}`, {
      method: "POST",
      headers: {
        Authorization: `${user.access_token || accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value,
        state,
      }),
    });

    const data = await response.json();
    iLoggerInventory.debug(data);
    return data;
  } catch (e: unknown) {
    iLoggerInventory.error((e as Error).message);
    throw e;
  }
}
