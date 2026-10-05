export function connectLocationSocket(token) {
  const ws = new WebSocket(
    `ws://localhost:8000/ws/nearby?token=${encodeURIComponent(token)}`
  );

  return ws;
}
