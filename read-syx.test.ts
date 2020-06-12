import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import {
  isValidCartridge,
  getDataChunks,
  cartridgeToJSON,
} from "./read-syx.ts";

const NO_VOICES: number = 32;
const VOICE_LENGTH: number = 128;

const START_SYSEX: number[] = [0xf0, 0x43, 0x00, 0x09, 0x20, 0x00];
const START_SYSEX_ONE_VOICE: number[] = [0xf0, 0x43, 0x00, 0x00, 0x01, 0x1b];
const EMPTY_DATA: number[] = new Array(VOICE_LENGTH * NO_VOICES).fill(0xaa);
const CHECKSUM: number = 0x00; // we should really calculate that ...
const END_SYSEX: number = 0xf7;

const VALID_EMPTY_CARTRIDGE = new Uint8Array(
  START_SYSEX.concat(EMPTY_DATA).concat([CHECKSUM]).concat([END_SYSEX]),
);
const CARTRIDGE_WITH_WRONG_END = new Uint8Array(
  START_SYSEX.concat(EMPTY_DATA).concat([CHECKSUM]).concat([0x00]),
);
const CARTRIDGE_WITH_ONE_VOICE_DATA = new Uint8Array(
  START_SYSEX_ONE_VOICE.concat(EMPTY_DATA).concat([CHECKSUM]).concat([0x00]),
);

Deno.test(
  "isValidCartridge: No bytes => not a valid cartridge",
  function (): void {
    assertEquals(isValidCartridge(new Uint8Array([])), false);
  },
);

Deno.test(
  "isValidCartridge: An initialized cartridge is valid",
  function (): void {
    assertEquals(isValidCartridge(VALID_EMPTY_CARTRIDGE), true);
  },
);

Deno.test(
  "isValidCartridge: A cartridge with an incorrect end marker is not valid",
  function (): void {
    assertEquals(isValidCartridge(CARTRIDGE_WITH_WRONG_END), false);
  },
);

Deno.test(
  "isValidCartridge: A cartridge with a one voice header is not valid",
  function (): void {
    assertEquals(isValidCartridge(CARTRIDGE_WITH_ONE_VOICE_DATA), false);
  },
);

Deno.test("getDataChunks: whoopla temp", function (): void {
  const lChunks = getDataChunks(VALID_EMPTY_CARTRIDGE);
  assertEquals(lChunks.length, 32);
  assertEquals(lChunks[0].length, 128);
});

Deno.test("getDataChunks: whoopla temp", function (): void {
  const lChunks = cartridgeToJSON(VALID_EMPTY_CARTRIDGE);
  assertEquals(lChunks.length, 32);
  assertEquals(lChunks[0].length, 128);
});
