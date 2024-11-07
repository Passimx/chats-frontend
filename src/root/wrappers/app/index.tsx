import { FC, useEffect, useState } from 'react';
import styles from './index.module.css';
import translationEN from '../../../../languages/en/translation.json';
import translationRU from '../../../../languages/ru/translation.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import moment from 'moment/min/moment-with-locales';
import Chats from '../../../modules/chats';
import { EventDataType } from '../../types/events/event-data.type.ts';
import { EventsEnum } from '../../types/events/events.enum.ts';
import { Envs } from '../../../common/config/envs/envs.ts';
import { useAppAction } from '../../store';

const resources = {
    en: {
        translation: translationEN,
    },
    ru: {
        translation: translationRU,
    },
};

const AppWrapper: FC<{ children: any }> = ({ children }) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const { addChat } = useAppAction();

    useEffect(() => {
        const lang = navigator.language ?? 'en';

        i18n.use(initReactI18next).init({
            resources,
            lng: lang,
            fallbackLng: lang,
            interpolation: {
                escapeValue: false,
            },
        });
        moment.locale(lang);
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        const sharedWorker = new SharedWorker('worker.js');
        sharedWorker.port.start();

        // Обработка сообщений от SharedWorker
        sharedWorker.port.onmessage = ({ data }: EventDataType) => {
            switch (data.event) {
                case EventsEnum.GET_SOCKET_ID:
                    Envs.socketId = data.data;
                    break;
                case EventsEnum.CREATE_CHAT:
                    if (data.data.success) addChat(data.data.data);
                    break;
                default:
                    break;
            }
        };

        return () => sharedWorker.port.close();
    }, []);

    if (isLoaded)
        return (
            <div id={styles.background}>
                <div id={styles.menu}>
                    <Chats />
                </div>
                <div id={styles.chat}>{children}</div>
            </div>
        );
};

export default AppWrapper;
