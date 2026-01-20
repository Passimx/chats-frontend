import { useEffect } from 'react';
import { useAppAction } from '../../../store';
import { EnvironmentEnum, Envs } from '../../../../common/config/envs/envs.ts';

export const useCatchLogs = () => {
    const { addLog } = useAppAction();

    useEffect(() => {
        if (Envs.environment !== EnvironmentEnum.STAGING) return;

        const methods: (keyof Console)[] = ['log', 'warn', 'error', 'info', 'debug'];
        const originals: Partial<Record<keyof Console, unknown>> = {};

        const serializeArg = (arg: any): string => {
            if (arg instanceof Blob) {
                return `[Blob size=${arg.size}, type=${arg.type || 'unknown'}]`;
            }
            if (arg instanceof File) {
                return `[File name="${arg.name}", size=${arg.size}, type=${arg.type}]`;
            }
            if (arg instanceof Error) {
                return `[Error ${arg.name}: ${arg.message}\n${arg.stack}]`;
            }
            if (arg instanceof ArrayBuffer) {
                return `[ArrayBuffer byteLength=${arg.byteLength}]`;
            }
            if (arg instanceof Map) {
                return `[Map ${JSON.stringify(Object.fromEntries(arg))}]`;
            }
            if (arg instanceof Set) {
                return `[Set ${JSON.stringify(Array.from(arg))}]`;
            }

            if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg, null, 2);
                } catch {
                    return '[Circular Object]';
                }
            }

            return String(arg);
        };

        for (const method of methods) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const original = console[method].bind(console);
            originals[method] = original;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            console[method] = (...args: any[]) => {
                const serialized = args.map(serializeArg).join(' ');

                window.dispatchEvent(
                    new CustomEvent('console', {
                        detail: { level: method, args, time: new Date() },
                    }),
                );

                addLog(serialized);
                original(...args);
            };
        }

        return () => {
            for (const method of methods) {
                if (originals[method]) {
                    // //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // //@ts-expect-error                    console[method] = originals[method] as any;
                }
            }
        };
    }, []);
};
