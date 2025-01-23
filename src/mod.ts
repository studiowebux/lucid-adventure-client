import { AuthenticationServer } from "./libs/authentication.cognito.ts";
import { iLogger, print } from "./libs/logger.ts";
import { createOrLoadAccount } from "./routes/account.ts";

import { AuthenticationState } from "./state/authentication.ts";
import { BuildingState } from "./state/building.ts";
import { ExpeditionState } from "./state/expedition.ts";
import { HomeState } from "./state/home.ts";
import { InventoryState } from "./state/inventory.ts";
import { ResourceState } from "./state/resource.ts";

// Authentication Server
AuthenticationServer();

let isRunning = true;
// Start App
while (isRunning) {
  // Open Browser (automatically) to signin
  await AuthenticationState();
  // Once signed in (through the redirect URI path) change program state to LOGGED_IN
  iLogger.debug("User Authenticated.");

  // Load / Create Account
  const { success } = await createOrLoadAccount();

  if (!success) {
    throw new Error("Unable to create or load your account.");
  }

  // Allow person to play as usual and call all of the authenticated endpoints
  print(`Welcome to Daogora!`);

  // Default State (main menu)
  let state = "home";
  let value: string[] = [];
  // Main game loop (Navigating through each views)
  while (isRunning) {
    try {
      // Main Menu (Home View on Mobile_)
      if (state === "home") {
        const out = await HomeState();
        const [_action, ...args] = out.value.split(" ");
        iLogger.debug("HOME OUT", out);
        state = out.state;
        value = args;
      }

      // Inventory View
      if (state === "inventory") {
        if (!value || !value[0]) {
          value[0] = "not_provided";
        }
        const out = await InventoryState(value[0]);
        iLogger.debug("INVENTORY OUT", out);
        state = out.state;
      }

      // Buildings View
      if (state === "building") {
        const out = await BuildingState();
        iLogger.debug("BUILDING OUT", out);
        const [_action, ...args] = out.value.split(" ");
        state = out.state;
        value = args;
      }

      // Resources View
      if (state === "resource") {
        const out = await ResourceState(value[0]);
        iLogger.debug("RESOURCE OUT", out);
        state = out.state;
      }

      // Expedition View
      if (state === "expedition") {
        const out = await ExpeditionState(value);
        iLogger.debug("EXPEDITION OUT", out);
        state = out.state;
      }

      if (state === "quit") {
        state = "quit";
        isRunning = false;
      }

      if (!state) {
        throw new Error("Oops... You are out of bounds...");
      }
    } catch (e: unknown) {
      throw new Error(`An error occured: ${(e as Error).message}`);
    }
  }

  isRunning = false;
}

iLogger.info("Game closing now...");
Deno.exit(0);
