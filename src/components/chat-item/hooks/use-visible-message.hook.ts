import { MessageType } from '../../../root/types/chat/message.type.ts';
import { MessageTypeEnum } from '../../../root/types/chat/message-type.enum.ts';
import { TFunction } from 'i18next';
import { FileExtensionEnum } from '../../../root/types/files/types.ts';
import { getStringDuration } from '../../../common/hooks/get-string-duration.hook.ts';

export const getVisibleMessage = (payload: MessageType, t: TFunction): string => {
    let visibleMessage: string = '';

    if (payload.type === MessageTypeEnum.IS_USER) {
        if (payload?.message?.length) visibleMessage = payload.message;
        else {
            const voiceMessage = payload.files?.find((file) => file.fileType === FileExtensionEnum.IS_VOICE);
            const fileName = payload?.files?.find((file) => file.fileType === FileExtensionEnum.IS_MEDIA)?.originalName;
            if (voiceMessage)
                visibleMessage = `${t('voice_message')} (${getStringDuration(voiceMessage?.metadata?.duration)})`;
            if (fileName) visibleMessage = fileName;
        }
    } else visibleMessage = t(payload.message);

    return visibleMessage;
};
