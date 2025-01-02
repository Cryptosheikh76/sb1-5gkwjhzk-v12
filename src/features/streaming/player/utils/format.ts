export function formatBitrate(bitrate: number): string {
  return bitrate >= 1000 ? 
    `${(bitrate / 1000).toFixed(1)} Mbps` : 
    `${bitrate} Kbps`;
}

export function formatBufferHealth(seconds: number): string {
  return seconds < 1 ? 
    `${(seconds * 1000).toFixed(0)}ms` : 
    `${seconds.toFixed(1)}s`;
}

export function formatLatency(ms: number): string {
  return ms < 1000 ? 
    `${ms.toFixed(0)}ms` : 
    `${(ms / 1000).toFixed(1)}s`;
}