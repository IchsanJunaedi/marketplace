import midtransClient from 'midtrans-client';

export function getSnap() {
  return new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY || 'dummy_server_key',
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'dummy_client_key',
  });
}

export function getCoreApi() {
  return new midtransClient.CoreApi({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY || 'dummy_server_key',
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'dummy_client_key',
  });
}