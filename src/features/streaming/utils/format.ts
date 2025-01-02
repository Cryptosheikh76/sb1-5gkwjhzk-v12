export function formatBitrate(bitrate: number): string {
  if (bitrate >= 1000) {
    return `${(bitrate / 1000).toFixed(1)} Mbps`;
  }
  return `${bitrate} Kbps`;
}

export function formatResolution(width: number, height: number): string {
  return `${width}x${height}`;
}

export function formatStreamKey(key: string): string {
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}