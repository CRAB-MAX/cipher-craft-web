// Encryption and decryption utilities

export interface EncryptionMethod {
  name: string;
  encrypt: (text: string, key?: string) => string;
  decrypt: (text: string, key?: string) => string;
  requiresKey?: boolean;
  keyPlaceholder?: string;
}

// Caesar Cipher
const caesarCipher = {
  name: "Caesar Cipher",
  requiresKey: true,
  keyPlaceholder: "Enter shift value (1-25)",
  encrypt: (text: string, key: string = "3"): string => {
    const shift = parseInt(key) || 3;
    return text
      .split("")
      .map((char) => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          const base = code >= 65 && code <= 90 ? 65 : 97;
          return String.fromCharCode(((code - base + shift) % 26) + base);
        }
        return char;
      })
      .join("");
  },
  decrypt: (text: string, key: string = "3"): string => {
    const shift = parseInt(key) || 3;
    return text
      .split("")
      .map((char) => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          const base = code >= 65 && code <= 90 ? 65 : 97;
          return String.fromCharCode(((code - base - shift + 26) % 26) + base);
        }
        return char;
      })
      .join("");
  },
};

// Base64 Encoding
const base64 = {
  name: "Base64",
  encrypt: (text: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (error) {
      throw new Error("Failed to encode to Base64");
    }
  },
  decrypt: (text: string): string => {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch (error) {
      throw new Error("Invalid Base64 string");
    }
  },
};

// ROT13
const rot13 = {
  name: "ROT13",
  encrypt: (text: string): string => {
    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= "Z" ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
    });
  },
  decrypt: (text: string): string => {
    // ROT13 is its own inverse
    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= "Z" ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
    });
  },
};

// Reverse Text
const reverse = {
  name: "Reverse Text",
  encrypt: (text: string): string => {
    return text.split("").reverse().join("");
  },
  decrypt: (text: string): string => {
    return text.split("").reverse().join("");
  },
};

// XOR Cipher
const xorCipher = {
  name: "XOR Cipher",
  requiresKey: true,
  keyPlaceholder: "Enter XOR key",
  encrypt: (text: string, key: string = "secret"): string => {
    if (!key) throw new Error("XOR key is required");
    return text
      .split("")
      .map((char, i) => {
        const keyChar = key[i % key.length];
        return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
      })
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("");
  },
  decrypt: (text: string, key: string = "secret"): string => {
    if (!key) throw new Error("XOR key is required");
    try {
      const hexPairs = text.match(/.{2}/g) || [];
      return hexPairs
        .map((hex) => String.fromCharCode(parseInt(hex, 16)))
        .map((char, i) => {
          const keyChar = key[i % key.length];
          return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
        })
        .join("");
    } catch (error) {
      throw new Error("Invalid XOR encrypted text");
    }
  },
};

export const encryptionMethods: EncryptionMethod[] = [
  caesarCipher,
  base64,
  rot13,
  reverse,
  xorCipher,
];

export const getEncryptionMethod = (name: string): EncryptionMethod | undefined => {
  return encryptionMethods.find((method) => method.name === name);
};