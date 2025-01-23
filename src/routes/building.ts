import { user } from "../libs/authentication.cognito.ts";
import { endpoint } from "../libs/constant.ts";
import { iLoggerHome } from "../libs/logger.ts";
import { State } from "../libs/type.ts";

export async function buildingView(accessToken?: string) {
  iLoggerHome.verbose("buildingView");
  try {
    const response = await fetch(`${endpoint}/api/building`, {
      headers: {
        Authorization: `${user.access_token || accessToken}`,
      },
    });

    const data = await response.json();
    iLoggerHome.debug(data);
    return data;
  } catch (e: unknown) {
    iLoggerHome.error((e as Error).message);
    throw e;
  }
}

export async function buildingHandler(
  value: string,
  state: State,
  accessToken?: string,
) {
  iLoggerHome.verbose("buildingHandler");
  try {
    const response = await fetch(`${endpoint}/api/building`, {
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
