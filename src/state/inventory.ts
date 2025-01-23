import { readInput } from "../libs/cli.ts";
import { iLoggerInventory, print } from "../libs/logger.ts";
import { State } from "../libs/type.ts";
import { inventoryHandler, inventoryView } from "../routes/inventory.ts";

export async function InventoryState(characterId: string) {
  let isInventory = true;
  let newState: State = "inventory";
  while (isInventory) {
    iLoggerInventory.debug("InventoryState: ", characterId);
    // Fetch menu and state from backend
    const output = await inventoryView(characterId);

    iLoggerInventory.verbose(output);

    if (output.state !== "inventory") {
      isInventory = false;
      newState = output.state;
      print(output.view.join("\n"));
      return { state: output.state };
    }

    // Print Menu on screen
    print(output.view.join("\n"));

    // Collect input from user
    const value = await readInput();

    if (value === "quit" || value === "4") {
      isInventory = false;
      newState = "quit";
      return { state: newState };
    }

    if (value === "done" || value === "3") {
      isInventory = false;
      newState = "home";
      return { state: newState };
    }

    // Call Backend with user decision

    const [action, ...values] = value.split(" ");
    const feedback = await inventoryHandler(
      `${action} ${characterId} ${values.join(" ")}`,
      output.state,
      characterId,
    );
    // Print Feedback on screen
    print(feedback.view.join("\n") + "\n");

    if (output.state !== "inventory") {
      isInventory = false;
      newState = output.state;
      return output;
    }
  }

  return { state: newState };
}
