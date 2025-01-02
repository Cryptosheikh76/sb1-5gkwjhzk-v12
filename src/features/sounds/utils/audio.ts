export async function generateWaveform(file: File): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const audioData = await audioContext.decodeAudioData(reader.result as ArrayBuffer);
        const channelData = audioData.getChannelData(0);
        const samples = 100; // Number of data points in waveform
        const blockSize = Math.floor(channelData.length / samples);
        const waveform = [];

        for (let i = 0; i < samples; i++) {
          const start = blockSize * i;
          let sum = 0;
          
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(channelData[start + j]);
          }
          
          waveform.push(Math.min(100, (sum / blockSize) * 100));
        }

        resolve(waveform);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}