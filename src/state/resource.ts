import { readInput } from "../libs/cli.ts";
import { print } from "../libs/logger.ts";
import { State } from "../libs/type.ts";
import { resourceHandler, resourceView } from "../routes/resource.ts";

export async function ResourceState(
  selectedBuildingId: string,
): Promise<{ state: State; value: string }> {
  let isResource = true;
  let newState: State = "resource";
  let localValue = "";
  while (isResource) {
    // Fetch menu and state from backend
    const output = await resourceView(selectedBuildingId);

    if (output.state !== "resource") {
      isResource = false;
      newState = output.state;
      print(output.view.join("\n"));
      return { state: output.state, value: localValue };
    }

    // Print Menu on screen
    print(output.view.join("\n"));

    // Collect input from user
    const value = await readInput();
    localValue = value;

    if (value === "quit" || value === "3") {
      isResource = false;
      newState = "quit";
      return { state: newState, value: localValue };
    }

    if (value === "done" || value === "2") {
      isResource = false;
      newState = "building";
      return { state: newState, value: localValue };
    }

    // Call Backend with user decision
    const [action, ...values] = value.split(" ");
    const feedback = await resourceHandler(
      `${action} ${selectedBuildingId} ${values.join(" ")}`,
      output.state,
      selectedBuildingId,
    );

    // Print Feedback on screen
    print(feedback.view.join("\n") + "\n");

    if (output.state !== "resource") {
      isResource = false;
      newState = output.state;
    }
  }

  return { state: newState, value: localValue };
}
