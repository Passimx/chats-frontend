import { MessageType } from '../../../root/types/chat/message.type.ts';

export type PropsType = MessageType & { findMessage?: (payload: number) => void };
