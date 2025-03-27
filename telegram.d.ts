declare global {
    interface Window {
        Telegram: {
            WebApp: {
                initData?: string;
                initDataUnsafe?: {
                    user: {
                        allows_write_to_pm: boolean;
                        first_name: string;
                        id: number;
                        is_premium: boolean;
                        language_code: string;
                        last_name: string;
                        photo_url: string;
                        username: string;
                    };
                };
                version: string;
                platform: string;
                isExpanded: boolean;
                colorScheme: 'light' | 'dark';
                themeParams: any;
                viewportHeight: number;
                viewportStableHeight: number;
                expand: () => void;
                close: () => void;
                isVersionAtLeast: (version: string) => boolean;
                onEvent: (eventType: string, eventHandler: () => void) => void;
                offEvent: (eventType: string, eventHandler: () => void) => void;
                sendData: (data: string) => void;
                MainButton: {
                    text: string;
                    color: string;
                    textColor: string;
                    isVisible: boolean;
                    isProgressVisible: boolean;
                    setText: (text: string) => void;
                    onClick: (callback: () => void) => void;
                    show: () => void;
                    hide: () => void;
                };
            };
        };
    }
}

export {};
