import { readInput } from "../libs/cli.ts";
import { iLoggerBuilding, print } from "../libs/logger.ts";
import { State } from "../libs/type.ts";
import { buildingHandler, buildingView } from "../routes/building.ts";

export async function BuildingState(): Promise<{
  state: State;
  value: string;
}> {
  let isBuilding = true;
  let newState: State = "building";
  let localValue = "";
  while (isBuilding) {
    // Fetch menu and state from backend
    const output = await buildingView();

    if (output.state !== "building") {
      isBuilding = false;
      newState = output.state;
      return { state: output.state, value: localValue };
    }

    // Print Menu on screen
    print(output.view.join("\n"));

    // Collect input from user
    const value = await readInput();
    localValue = value;

    if (value === "quit" || value === "7") {
      isBuilding = false;
      newState = "quit";
      return { state: newState, value };
    }

    if (value === "done" || value === "6") {
      isBuilding = false;
      newState = "home";
      return { state: newState, value };
    }

    // Call Backend with user decision
    const feedback = await buildingHandler(value, output.state);

    // Print Feedback on screen
    print(feedback.view.join("\n") + "\n");

    iLoggerBuilding.debug("Building", feedback);
    if (feedback.state !== "building") {
      isBuilding = false;
      newState = feedback.state;
    }
  }

  return { state: newState, value: localValue };
}
