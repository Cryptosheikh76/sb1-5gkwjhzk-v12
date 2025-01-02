import { Client } from 'xrpl';

const XRPL_NODE = 'wss://s.altnet.rippletest.net:51233';

export async function getXrplClient() {
  const client = new Client(XRPL_NODE);
  await client.connect();
  return client;
}