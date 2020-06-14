import { hasPrefix } from "./deps.ts";

const SYSEX_BULK_DATA_32_VOICES_HEADER: Uint8Array = new Uint8Array([
  0xf0,
  0x43,
  0x00,
  0x09,
  0x20,
  0x00,
]);
const SYSEX_BULK_DATA_LENGTH = 4104;
const END_SYSEX = 0xf7;
const NO_VOICES = 32;
const VOICE_LENGTH = 128;

export function isValidCartridge(pSysexMessage: Uint8Array): boolean {
  return (
    pSysexMessage.length === SYSEX_BULK_DATA_LENGTH &&
    hasPrefix(pSysexMessage, SYSEX_BULK_DATA_32_VOICES_HEADER) &&
    pSysexMessage[pSysexMessage.length - 1] === END_SYSEX
    // TODO: check against the checksum that is in pBytes[pBytes.length -2]
  );
}

export function getDataChunks(pSysexMessage: Uint8Array): Uint8Array[] {
  const lPayload = pSysexMessage.subarray(
    SYSEX_BULK_DATA_32_VOICES_HEADER.length,
    SYSEX_BULK_DATA_32_VOICES_HEADER.length + NO_VOICES * VOICE_LENGTH,
  );
  const lRetval = [];

  for (let i = 0; i < NO_VOICES; i++) {
    lRetval.push(
      lPayload.subarray(i * VOICE_LENGTH, i * VOICE_LENGTH + VOICE_LENGTH),
    );
  }
  return lRetval;
}

export function cartridgeToJSON(pSysexMessage: Uint8Array): any[] {
// see https://github.com/asb2m10/dexed/blob/master/Documentation/sysex-format.txt
  if (isValidCartridge(pSysexMessage)) {
    return getDataChunks(pSysexMessage).map((pVoiceBytes, pNumber) => ({
      // LFO: {
      //   waveForm: pVoiceBytes.slice(115, 116)[0],
      // },
      // pitchModSensitivity: pVoiceBytes.slice(116, 117)[0],
      number: pNumber,
      transpose: pVoiceBytes.slice(117, 118)[0],
      name: new TextDecoder().decode(pVoiceBytes.slice(118, 128)),
    }));
  } else {
    throw new Error("That doesn't look like a valid cartridge ...");
  }
}
