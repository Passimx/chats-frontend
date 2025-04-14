import { ChatItemIndexDb } from '../../../types/chat/chat.type.ts';

export type UpdateChat = { id: string } & Partial<ChatItemIndexDb>;
