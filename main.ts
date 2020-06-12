import { cartridgeToJSON } from "./read-syx.ts";

const MEADOWS_01 = Deno.readFileSync("./Meadows_01_keys.syx");
const MEADOWS_02 = Deno.readFileSync("./Meadows_02_pads.syx");

function thingulate(pString: string): void {
  Deno.writeAllSync(Deno.stdout, new TextEncoder().encode(pString));
}
function toMarkDownTable(pCartridgeAsJSON: any): string {
  let lRetval =
    "|# | name       |#  | name       |#  | name       |#  | name       |\n" +
    "|--|------------|---|------------|---|------------|---|------------|\n";

  for (let n = 0; n < 8; n++) {
    lRetval += "|";
    for (let lVoice of pCartridgeAsJSON) {
      if (lVoice.number % 8 === n) {
        lRetval += `${(lVoice.number + 1).toString(10)} | ${lVoice.name} |`;
      }
    }
    lRetval += "\n";
  }
  return lRetval;
}

try {
  thingulate("# DX7 cartridge dumps\n\n");
  thingulate("sysx dumps of my DX7 cartridges\n");
  thingulate("## [Meadows_01_keys](Meadows_01_keys)\n");
  thingulate(toMarkDownTable(cartridgeToJSON(MEADOWS_01)));
  thingulate("\n");
  thingulate("## [Meadows_02_pads](Meadows_02_pads)\n");
  thingulate(toMarkDownTable(cartridgeToJSON(MEADOWS_02)));
  thingulate("\n");
  thingulate(
    "> generate this README with `deno run --allow-read main.ts > README.md`"
  );
} catch (pError) {
  console.error(pError);
}
