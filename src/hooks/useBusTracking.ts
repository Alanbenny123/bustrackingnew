import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { BusLocation } from '@/lib/map/types';

export function useBusTracking() {
  const [buses, setBuses] = useState<BusLocation[]>([]);

  useEffect(() => {
    const socket = io('http://localhost:3000', {
      transports: ['websocket'],
      upgrade: false
    });

    socket.on('receiveLocation', (data: { id: string; latitude: number; longitude: number }) => {
      setBuses(prevBuses => {
        const existingBus = prevBuses.find(bus => bus.id === data.id);
        if (existingBus) {
          return prevBuses.map(bus => 
            bus.id === data.id 
              ? { ...bus, position: [data.latitude, data.longitude], lastUpdate: 'Just now' }
              : bus
          );
        }
        return [...prevBuses, {
          id: data.id,
          position: [data.latitude, data.longitude],
          number: `Bus ${data.id}`,
          status: 'Active',
          speed: 'Updating...',
          lastUpdate: 'Just now',
          route: 'Current Route'
        }];
      });
    });

    socket.on('user-disconnected', (userId: string) => {
      setBuses(prevBuses => prevBuses.filter(bus => bus.id !== userId));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return buses;
} 