import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  const handleExit = async (_args: string, ctx: any) => {
    if (typeof ctx?.shutdown === "function") {
      ctx.shutdown();
    } else {
      process.exit(0);
    }
  };

  pi.registerCommand("exit", {
    description: "Exit the pi session",
    handler: handleExit,
  });

  pi.registerCommand("q", {
    description: "Exit the pi session (alias for /exit)",
    handler: handleExit,
  });

  pi.registerCommand("exot", {
    description: "Exit the pi session (alias for /exit)",
    handler: handleExit,
  });
}
