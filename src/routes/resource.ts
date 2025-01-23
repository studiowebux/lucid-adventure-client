import { user } from "../libs/authentication.cognito.ts";
import { endpoint } from "../libs/constant.ts";
import { iLoggerResource } from "../libs/logger.ts";
import { State } from "../libs/type.ts";

export async function resourceView(
  selectedBuildingId: string,
  accessToken?: string,
) {
  iLoggerResource.verbose("resourceView");
  try {
    const response = await fetch(
      `${endpoint}/api/resource/${selectedBuildingId}`,
      {
        headers: {
          Authorization: `${user.access_token || accessToken}`,
        },
      },
    );

    const data = await response.json();
    iLoggerResource.debug(data);
    return data;
  } catch (e: unknown) {
    iLoggerResource.error((e as Error).message);
    throw e;
  }
}

export async function resourceHandler(
  value: string,
  state: State,
  selectedBuildingId: string,
  accessToken?: string,
) {
  iLoggerResource.verbose("resourceHandler");
  try {
    const response = await fetch(
      `${endpoint}/api/resource/${selectedBuildingId}`,
      {
        method: "POST",
        headers: {
          Authorization: `${user.access_token || accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value,
          state,
        }),
      },
    );

    const data = await response.json();
    iLoggerResource.debug(data);
    return data;
  } catch (e: unknown) {
    iLoggerResource.error((e as Error).message);
    throw e;
  }
}
