import { cartridgeToJSON } from "./read-syx.ts";

function thingulate(pString: string): void {
  Deno.writeAllSync(Deno.stdout, new TextEncoder().encode(pString));
}
function toMarkDownTable(
  pCartridgeAsJSON: any,
  pNoRows: number = 8,
  pNoVoices: number = 32,
): string {
  let lReturnValue =
    `${"|#  | name       ".repeat(Math.ceil(pNoVoices / pNoRows))}|\n` +
    `${"|---|------------".repeat(Math.ceil(pNoVoices / pNoRows))}|\n`;

  for (let lRow = 0; lRow < pNoRows; lRow++) {
    lReturnValue += "|";
    for (let lVoice of pCartridgeAsJSON) {
      if (lVoice.number % pNoRows === lRow) {
        lReturnValue += `${
          (lVoice.number + 1).toString(10)
        } | ${lVoice.name} |`;
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

if (import.meta.main) {
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
          "\n",
      )
      .forEach(thingulate);

    thingulate(
      "> generate this README with `deno run --allow-read main.ts > README.md`\n",
    );
  } catch (pError) {
    console.error(pError);
  }
}
