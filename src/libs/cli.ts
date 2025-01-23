let sigint = false;
Deno.addSignalListener("SIGINT", () => {
  sigint = true;
});

// Input reading for the game
export async function readInput(): Promise<string> {
  // Add a timeout to prevent process exiting immediately.
  while (true) {
    const val = prompt(">");
    const printHandlerPromise = new Promise((resolve, _reject) => {
      setTimeout(() => {
        if (sigint) {
          console.log("Type 'quit' instead");
          sigint = false;
        }
        resolve(null);
      }, 0);
    });
    await printHandlerPromise;
    return val?.trim() || "";
  }
}
