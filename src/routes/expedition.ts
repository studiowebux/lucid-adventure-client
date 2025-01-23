import { user } from "../libs/authentication.cognito.ts";
import { endpoint } from "../libs/constant.ts";
import { iLoggerHome } from "../libs/logger.ts";
import { State } from "../libs/type.ts";

export async function expeditionView(
  characterIds: string[],
  accessToken?: string,
) {
  iLoggerHome.verbose("expeditionView");
  try {
    const response = await fetch(`${endpoint}/api/expedition/start`, {
      method: "POST",
      headers: {
        Authorization: `${user.access_token || accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        characterIds,
      }),
    });

    const data = await response.json();
    iLoggerHome.debug(data);
    return data;
  } catch (e: unknown) {
    iLoggerHome.error((e as Error).message);
    throw e;
  }
}

export async function expeditionHandler(
  value: string,
  state: State,
  accessToken?: string,
) {
  iLoggerHome.verbose("expeditionHandler");
  try {
    const response = await fetch(`${endpoint}/api/expedition`, {
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
    iLoggerHome.debug(data);
    return data;
  } catch (e: unknown) {
    iLoggerHome.error((e as Error).message);
    throw e;
  }
}
