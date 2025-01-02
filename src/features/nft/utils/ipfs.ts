const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

export async function uploadToIPFS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to upload to IPFS');
  }

  const { IpfsHash } = await response.json();
  return `${IPFS_GATEWAY}${IpfsHash}`;
}

export async function uploadMetadataToIPFS(metadata: object): Promise<string> {
  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`
    },
    body: JSON.stringify(metadata)
  });

  if (!response.ok) {
    throw new Error('Failed to upload metadata to IPFS');
  }

  const { IpfsHash } = await response.json();
  return `${IPFS_GATEWAY}${IpfsHash}`;
}