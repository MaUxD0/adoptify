import { Request, Response, NextFunction } from 'express';
import { chatService, ConversationNotFoundError, ConversationForbiddenError } from './chat.service';

export const chatController = {
  async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const conversations = await chatService.getUserConversations(req.user!.id);
      res.json({ success: true, data: conversations });
    } catch (error) {
      next(error);
    }
  },

  async getConversationById(req: Request, res: Response, next: NextFunction) {
    try {
      const conversation = await chatService.getConversationById(
        req.params.conversationId as string,
        req.user!.id,
      );
      res.json({ success: true, data: conversation });
    } catch (error) {
      if (error instanceof ConversationNotFoundError) {
        return res.status(404).json({ success: false, message: error.message });
      }
      if (error instanceof ConversationForbiddenError) {
        return res.status(403).json({ success: false, message: error.message });
      }
      next(error);
    }
  },

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const conversationId = req.params.conversationId as string;
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 30);

      const result = await chatService.getConversationMessages(
        conversationId,
        req.user!.id,
        page,
        limit,
      );
      res.json({ success: true, ...result });
    } catch (error) {
      if (error instanceof ConversationForbiddenError) {
        return res.status(403).json({ success: false, message: error.message });
      }
      next(error);
    }
  },

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const conversationId = req.params.conversationId as string;
      const message = await chatService.sendMessage(
        conversationId,
        req.user!.id,
        req.body.content,
      );
      res.status(201).json({ success: true, data: message });
    } catch (error) {
      if (error instanceof ConversationForbiddenError) {
        return res.status(403).json({ success: false, message: error.message });
      }
      next(error);
    }
  },
};