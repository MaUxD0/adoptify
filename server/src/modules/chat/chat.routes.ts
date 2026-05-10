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

router.get('/conversations', chatController.getConversations);

router.post('/conversations', chatController.findOrCreateConversation);

router.get(
  '/conversations/:conversationId',
  validate({ params: conversationIdParamSchema }),
  chatController.getConversationById,
);

router.get(
  '/conversations/:conversationId/messages',
  validate({ params: conversationIdParamSchema, query: messagesPaginationSchema }),
  chatController.getMessages,
);

router.post(
  '/conversations/:conversationId/messages',
  validate({ params: conversationIdParamSchema, body: sendMessageSchema }),
  chatController.sendMessage,
);

export default router;