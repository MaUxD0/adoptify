import { z } from 'zod';

export const sendMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message too long'),
});

export const conversationIdParamSchema = z.object({
  conversationId: z.string().uuid({ message: 'Invalid conversation ID' }),
});

export const messagesPaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(30),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;