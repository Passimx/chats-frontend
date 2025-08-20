import { MessageType } from '../../../root/types/chat/message.type.ts';
import { MessageTypeEnum } from '../../../root/types/chat/message-type.enum.ts';
import { FileExtensionEnum } from '../../../root/types/files/file.type.ts';
import { TFunction } from 'i18next';

export const getVisibleMessage = (payload: MessageType, t: TFunction): string => {
    let visibleMessage: string = '';

    if (payload.type === MessageTypeEnum.IS_USER) {
        if (payload?.message?.length) visibleMessage = payload.message;
        else {
            const voiceMessage = payload.files?.find((file) => file.fileType === FileExtensionEnum.IS_VOICE);
            if (voiceMessage) {
                visibleMessage = t('voice_message');
            }
        }
    } else visibleMessage = t(payload.message);

    return visibleMessage;
};
