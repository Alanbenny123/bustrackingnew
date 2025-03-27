import { WebSocketServer, WebSocket } from 'ws';
import { NextApiRequest } from 'next';
import { Server as HTTPServer } from 'http';

const clients = new Map<string, Set<WebSocket>>();

const initWebSocket = (server: HTTPServer) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket, req: NextApiRequest) => {
    const busId = req.query.busId as string;
    
    if (!busId) {
      ws.close();
      return;
    }

    // Add client to the bus's client set
    if (!clients.has(busId)) {
      clients.set(busId, new Set());
    }
    clients.get(busId)?.add(ws);

    // Send initial location
    const initialLocation = {
      latitude: 10.0261,
      longitude: 76.3125,
      timestamp: Date.now(),
    };
    ws.send(JSON.stringify(initialLocation));

    // Simulate location updates every 5 seconds
    const interval = setInterval(() => {
      const location = {
        latitude: 10.0261 + (Math.random() - 0.5) * 0.01,
        longitude: 76.3125 + (Math.random() - 0.5) * 0.01,
        timestamp: Date.now(),
      };
      ws.send(JSON.stringify(location));
    }, 5000);

    ws.on('close', () => {
      clearInterval(interval);
      clients.get(busId)?.delete(ws);
      if (clients.get(busId)?.size === 0) {
        clients.delete(busId);
      }
    });
  });
};

export default initWebSocket; 