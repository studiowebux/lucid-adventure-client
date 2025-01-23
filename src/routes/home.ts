import { user } from "../libs/authentication.cognito.ts";
import { endpoint } from "../libs/constant.ts";
import { iLoggerHome } from "../libs/logger.ts";
import { State } from "../libs/type.ts";

export async function homeView(accessToken?: string) {
  iLoggerHome.verbose("homeView");
  try {
    const response = await fetch(`${endpoint}/api/home`, {
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

export async function homeHandler(
  value: string,
  state: State,
  accessToken?: string,
) {
  iLoggerHome.verbose("homeHandler");
  try {
    const response = await fetch(`${endpoint}/api/home`, {
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
