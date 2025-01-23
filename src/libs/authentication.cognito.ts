// https://docs.aws.amazon.com/cognito/latest/developerguide/logout-endpoint.html
// https://docs.aws.amazon.com/cognito/latest/developerguide/login-endpoint.html

import { type Context, Hono } from "hono";
import { logger } from "hono/logger";
import { ContentfulStatusCode } from "hono/utils/http-status";
import open from "open";
import {
  client_id,
  domain,
  redirect_uri,
  response_type,
  scope,
} from "./constant.ts";
import { iLoggerAuth } from "./logger.ts";

export async function authenticate(): Promise<void> {
  const loginUrl = `${domain}/login?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=${response_type}&scope=${scope}`;

  iLoggerAuth.verbose("Login URL", loginUrl);
  await open(loginUrl);
}

export async function getUserInfo(accessToken?: string): Promise<{
  sub: string;
  email_verified: string;
  email: string;
  username: string;
}> {
  const userInfo = await fetch(`${domain}/oauth2/userInfo`, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${accessToken || user.access_token}`,
    },
  });

  if (userInfo.ok) {
    const response = await userInfo.json();
    iLoggerAuth.verbose(response);
    return response;
  }

  throw new Error("Unable to retrieve user information.");
}

export let user!: {
  token_type: "bearer";
  expires_in: number;
  refresh_token: string;
  access_token: string;
  id_token: string;
};

export let server: Deno.HttpServer;

export function AuthenticationServer() {
  const app = new Hono();

  app.use(logger());

  app.get("/redirect_uri", async (c: Context) => {
    iLoggerAuth.verbose("received", c.req.url);
    const { code } = c.req.query();

    const tokens = await fetch(
      `${domain}/oauth2/token?grant_type=authorization_code&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&code=${code}&scope=${scope}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    if (tokens.ok) {
      user = await tokens.json();
      return c.text(
        "Authentication completed, you can close this window and go back to the CLI.",
      );
    }

    return c.text(
      `Failed to authenticate, ${tokens.body}`,
      (tokens.status as ContentfulStatusCode) || 500,
    );
  });

  app.onError((err: Error, c: Context) => {
    iLoggerAuth.error("GLOBAL ERROR HANDLING", err);
    return c.text(`Failed to authenticate, ${err.message}`, 500);
  });

  const ac = new AbortController();
  server = Deno.serve(
    { signal: ac.signal, port: 13567, hostname: "0.0.0.0" },
    app.fetch,
  );
  server.finished.then(() => iLoggerAuth.debug("Server closed"));
}

// export { app };
