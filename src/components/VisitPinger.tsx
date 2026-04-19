'use client';
import { useEffect } from 'react';

export function VisitPinger() {
  useEffect(() => {
    const ping = () => fetch('/api/stats/ping', { method: 'POST' }).catch(() => {});
    ping();
    const t = setInterval(ping, 2 * 60 * 1000);
    return () => clearInterval(t);
  }, []);
  return null;
}
