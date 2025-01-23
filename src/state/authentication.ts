import { authenticate, server, user } from "../libs/authentication.cognito.ts";
import { iLoggerAuth } from "../libs/logger.ts";
import { timeout } from "../libs/sleep.ts";

export async function AuthenticationState() {
  let isAuthenticated = false;

  // Open Browser
  await authenticate();

  // Wait until the user authentication (Sign in or Sign up)
  // this loop is stopped using the callback /redirect_uri
  while (!isAuthenticated) {
    if (user?.access_token) {
      isAuthenticated = true;
      // Shutting down the authentication server
      await server.shutdown();
    }
    // Check every 1 seconds until the user has done what is required.
    iLoggerAuth.verbose("Waiting for user authentication...");
    await timeout(1000);
  }
}
