import { readInput } from "../libs/cli.ts";
import { iLoggerHome, print } from "../libs/logger.ts";
import { State } from "../libs/type.ts";
import { homeHandler, homeView } from "../routes/home.ts";

export async function HomeState(): Promise<{ state: State; value: string }> {
  let isHome = true;
  let newState: State = "home";
  let localValue = "";
  while (isHome) {
    // Fetch menu and state from backend
    const output = await homeView();

    iLoggerHome.verbose(output);

    if (output.state !== "home") {
      isHome = false;
      newState = output.state;
      return { state: output.state, value: localValue };
    }

    // Print Menu on screen
    print(output.view.join("\n"));

    // Collect input from user
    const value = await readInput();
    localValue = value;

    if (value === "quit" || value === "7") {
      isHome = false;
      newState = "quit";
      return { state: newState, value: localValue };
    }

    // Call Backend with user decision
    const feedback = await homeHandler(value, output.state);

    iLoggerHome.verbose(feedback);
    // Print Feedback on screen
    print(feedback.view.join("\n") + "\n");

    if (feedback.state !== "home") {
      isHome = false;
      newState = feedback.state;
    }
  }

  return { state: newState, value: localValue };
}
