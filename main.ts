import { cartridgeToJSON } from "./read-syx.ts";

const NO_ROWS = 8;

function thingulate(pString: string): void {
  Deno.writeAllSync(Deno.stdout, new TextEncoder().encode(pString));
}
function toMarkDownTable(pCartridgeAsJSON: any): string {
  let lReturnValue =
    "|# | name       |#  | name       |#  | name       |#  | name       |\n" +
    "|--|------------|---|------------|---|------------|---|------------|\n";

  for (let lRow = 0; lRow < NO_ROWS; lRow++) {
    lReturnValue += "|";
    for (let lVoice of pCartridgeAsJSON) {
      if (lVoice.number % NO_ROWS === lRow) {
        lReturnValue += `${(lVoice.number + 1).toString(10)} | ${
          lVoice.name
        } |`;
      }
    }
    lReturnValue += "\n";
  }
  return lReturnValue;
}

try {
  thingulate("# DX7 cartridge dumps\n\n");
  thingulate("sysx dumps of my DX7 cartridges\n\n");
  for (let { name } of Deno.readDirSync(".")) {
    if (name.endsWith(".syx")) {
      let lSysexDump = Deno.readFileSync(name);
      thingulate(`## [${name.split(".").shift()}](${name})\n`);
      thingulate(toMarkDownTable(cartridgeToJSON(lSysexDump)));
      thingulate("\n");
    }
  }

  thingulate(
    "> generate this README with `deno run --allow-read main.ts > README.md`"
  );
} catch (pError) {
  console.error(pError);
}
