import { Router } from 'express';
import { chatController } from './chat.controller';
import { validate } from '../../middlewares/validate.middleware';
import {
  sendMessageSchema,
  conversationIdParamSchema,
  messagesPaginationSchema,
} from './chat.validators';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

/**
 * GET /api/chat/conversations
 * List all conversations for the authenticated user
 */
router.get('/conversations', chatController.getConversations);

/**
 * POST /api/chat/conversations
 * Find or create a conversation between adopter + shelter + pet
 */
router.post('/conversations', chatController.findOrCreateConversation);

/**
 * GET /api/chat/conversations/:conversationId
 * Get a single conversation with metadata
 */
router.get(
  '/conversations/:conversationId',
  validate({ params: conversationIdParamSchema }),
  chatController.getConversationById,
);

/**
 * GET /api/chat/conversations/:conversationId/messages
 * Paginated messages for a conversation
 */
router.get(
  '/conversations/:conversationId/messages',
  validate({ params: conversationIdParamSchema, query: messagesPaginationSchema }),
  chatController.getMessages,
);

/**
 * POST /api/chat/conversations/:conversationId/messages
 * Send a message in a conversation
 */
router.post(
  '/conversations/:conversationId/messages',
  validate({ params: conversationIdParamSchema, body: sendMessageSchema }),
  chatController.sendMessage,
);

export default router;