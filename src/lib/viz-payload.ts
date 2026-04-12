// src/lib/viz-payload.ts
// URL-safe base64 encoding for /visualize/[payload] route

import { z } from 'zod';
import { VisualizationStepSchema } from './schemas';

export const VizPayloadSchema = z.object({
  steps: z.array(VisualizationStepSchema).min(1).max(20),
  returnTo: z.string().max(200),
  title: z.string().max(100).optional(),
});

export type VizPayload = z.infer<typeof VizPayloadSchema>;

export function encodeVizPayload(payload: VizPayload): string {
  const json = JSON.stringify(payload);
  // btoa works with ASCII; use encodeURIComponent round-trip for Unicode safety
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decodeVizPayload(encoded: string): VizPayload {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  let json: string;
  try {
    json = decodeURIComponent(escape(atob(base64)));
  } catch {
    throw new Error('invalid_payload_encoding');
  }
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    throw new Error('invalid_payload_json');
  }
  const result = VizPayloadSchema.safeParse(raw);
  if (!result.success) {
    throw new Error('invalid_payload_schema');
  }
  return result.data;
}
