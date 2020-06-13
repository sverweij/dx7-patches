import { cartridgeToJSON } from "./read-syx.ts";

const NO_ROWS = 8;
const NO_VOICES = 32;

function thingulate(pString: string): void {
  Deno.writeAllSync(Deno.stdout, new TextEncoder().encode(pString));
}
function toMarkDownTable(pCartridgeAsJSON: any): string {
  let lReturnValue =
    `${"|#  | name       ".repeat(Math.ceil(NO_VOICES / NO_ROWS))}|\n` +
    `${"|---|------------".repeat(Math.ceil(NO_VOICES / NO_ROWS))}|\n`;

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

function getFileNames(pDirName: string): string[] {
  let lReturnValue = [];
  for (let { name } of Deno.readDirSync(pDirName)) {
    lReturnValue.push(name);
  }
  return lReturnValue;
}

try {
  thingulate("# DX7 cartridge dumps\n\n");
  thingulate("sysx dumps of my DX7 cartridges\n\n");
  getFileNames(".")
    .filter((pName) => pName.endsWith(".syx"))
    .sort()
    .map(
      (pName) =>
        `\n## [${pName.split(".").shift()}](${pName})\n\n` +
        toMarkDownTable(cartridgeToJSON(Deno.readFileSync(pName))) +
        "\n"
    )
    .forEach(thingulate);

  thingulate(
    "> generate this README with `deno run --allow-read main.ts > README.md`\n"
  );
} catch (pError) {
  console.error(pError);
}
