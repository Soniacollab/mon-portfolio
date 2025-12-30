// src/utils/asset.ts
export const asset = (path: string) => {
  try {
   
    const isDev = typeof import.meta !== "undefined" && Boolean((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV);
    return isDev ? `${path}?_=${Date.now()}` : path;
  } catch (e) {
    return path;
  }
};
