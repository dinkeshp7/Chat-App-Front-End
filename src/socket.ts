let socket: WebSocket;

/** Connect to WebSocket server */
export const connectSocket = (url: string): WebSocket => {
  socket = new WebSocket(url);
  return socket;
};

/** Send a JSON message */
export const sendMessage = (data: any) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
};

/** Register incoming messages */
export const onMessage = (callback: (data: any) => void) => {
  socket.onmessage = (event) => {
    callback(JSON.parse(event.data));
  };
};