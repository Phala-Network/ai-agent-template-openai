/* DO NOT MODIFY THIS FILE */
import main from "../src";
import * as blake from 'blakejs';
import * as CryptoJS from 'crypto-js';
import { keccak256 } from 'js-sha3';
import { wyhash } from 'wyhash';

// Mock function to simulate getting JavaScript code
function getJsCode(): string[] {
  // Replace this with actual code fetching logic
  return [
    "console.log('Hello, world!');",
    "function add(a, b) { return a + b; }"
  ];
}

// Function to hash a message using Blake2x256
function hashBlake2x256(message: Uint8Array): Uint8Array {
  return blake.blake2b(message, undefined, 32);
}

// Function to get the hash of the JavaScript code
function getJsCodeHash(): Uint8Array {
  const codes = getJsCode();
  const output = new Uint8Array(32 * codes.length);
  let offset = 0;

  for (const code of codes) {
    const codeHash = hashBlake2x256(new TextEncoder().encode(code));
    output.set(codeHash, offset);
    offset += 32;
  }

  return hashBlake2x256(output);
}

// @ts-ignore
globalThis.Wapo = {
  deriveSecret(salt: Uint8Array | string): Uint8Array {
    let saltBytes: Uint8Array;

    // Convert string salt to Uint8Array
    if (typeof salt === 'string') {
      saltBytes = new TextEncoder().encode(salt);
    } else {
      saltBytes = salt;
    }

    const prefix = new TextEncoder().encode('JavaScript:');
    const jsCodeHash = getJsCodeHash();
    const seed = new Uint8Array(prefix.length + jsCodeHash.length + saltBytes.length);

    seed.set(prefix, 0);
    seed.set(jsCodeHash, prefix.length);
    seed.set(saltBytes, prefix.length + jsCodeHash.length);

    // Derive a secret using Blake2x256
    return hashBlake2x256(seed);
  },
  hash(algorithm: 'blake2b128' | 'blake2b256' | 'blake2b512' | 'sha256' | 'keccak256', message: Uint8Array | string): Uint8Array {
    let messageBytes: Uint8Array;

    // Convert string message to Uint8Array
    if (typeof message === 'string') {
      messageBytes = new TextEncoder().encode(message);
    } else {
      messageBytes = message;
    }

    switch (algorithm) {
      case 'blake2b128':
        return blake.blake2b(messageBytes, undefined, 16);
      case 'blake2b256':
        return blake.blake2b(messageBytes, undefined, 32);
      case 'blake2b512':
        return blake.blake2b(messageBytes, undefined, 64);
      case 'sha256':
        return Uint8Array.from(CryptoJS.SHA256(CryptoJS.lib.WordArray.create(messageBytes)).words.map((word: number) => [
          (word >> 24) & 0xff,
          (word >> 16) & 0xff,
          (word >> 8) & 0xff,
          word & 0xff
        ]).flat());
      case 'keccak256':
        return Uint8Array.from(keccak256.array(messageBytes));
      default:
        throw new Error(`Unsupported algorithm: ${algorithm}`);
    }
  },
  nonCryptographicHash(algorithm: 'wyhash64', message: Uint8Array | string): Uint8Array {
    let messageBytes: Uint8Array;

    // Convert string message to Uint8Array
    if (typeof message === 'string') {
      messageBytes = new TextEncoder().encode(message);
    } else {
      messageBytes = message;
    }

    switch (algorithm) {
      case 'wyhash64':
        const seed = BigInt(0); // You can use any seed value
        const hash = wyhash(messageBytes, seed);
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);
        view.setBigUint64(0, hash, true);
        return new Uint8Array(buffer);
      default:
        throw new Error(`Unsupported algorithm: ${algorithm}`);
    }
  },
  concatU8a(arrays: Uint8Array[]): Uint8Array {
    const totalSize = arrays.reduce((acc, e) => acc + e.length, 0);
    const merged = new Uint8Array(totalSize);
    arrays.forEach((array, i, arrays) => {
      const offset = arrays.slice(0, i).reduce((acc, e) => acc + e.length, 0);
      merged.set(array, offset);
    });
    return merged;
  }
}

export async function execute(inputObj: any) {
  const inputJson = JSON.stringify(inputObj)
  console.log('INPUT:', inputJson)
  return await main(inputJson)
}
