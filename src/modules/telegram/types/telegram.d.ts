declare global {
    interface Window {
        Telegram: {
            WebApp: {
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
                viewportHeight: number;
                viewportStableHeight: number;
                expand: () => void;
                close: () => void;
            };
        };
    }
}

export {};
