import { readInput } from "../libs/cli.ts";
import { iLoggerExpedition, print } from "../libs/logger.ts";
import { expeditionHandler, expeditionView } from "../routes/expedition.ts";

export async function ExpeditionState(
  characterIds: string[],
): Promise<{ state: State }> {
  let isExpedition = true;
  let newState: State = "expedition";
  while (isExpedition) {
    // Fetch menu and state from backend
    const output = await expeditionView(characterIds);

    iLoggerExpedition.verbose(output);
    if (!output?.state) {
      console.error(output.message);
      Deno.exit(1);
    }
    if (output.state !== "expedition") {
      isExpedition = false;
      newState = output.state;
      return { state: output.state };
    }

    // Print Menu on screen
    print(output.view.join("\n"));

    // Collect input from user
    const value = await readInput();

    if (value === "quit" || value === "7") {
      iLoggerExpedition.verbose("quit or 7");
      isExpedition = false;
      newState = "quit";
      return { state: newState };
    }

    // Call Backend with user decision
    const feedback = await expeditionHandler(value, output.state);

    iLoggerExpedition.verbose(feedback);
    // Print Feedback on screen
    print(feedback.view.join("\n") + "\n");

    if (feedback.state !== "expedition") {
      isExpedition = false;
      newState = feedback.state;
    }
  }

  return { state: newState };
}
