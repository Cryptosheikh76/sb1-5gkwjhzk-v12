import { StreamConnection } from '../types';

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' }
];

export async function setupWebRTC(mediaStream: MediaStream): Promise<StreamConnection> {
  const peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });
  
  // Add tracks to peer connection
  mediaStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, mediaStream);
  });
  
  // Create data channel
  const dataChannel = peerConnection.createDataChannel('chat');
  
  return { peerConnection, dataChannel };
}

export async function connectToStream(streamId: string): Promise<StreamConnection> {
  const peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });
  
  // Set up data channel handler
  const dataChannel = await new Promise<RTCDataChannel>((resolve) => {
    peerConnection.ondatachannel = (event) => {
      resolve(event.channel);
    };
  });
  
  return { peerConnection, dataChannel };
}