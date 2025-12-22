import { createContext, ReactNode, useState } from 'react';

export type CallContextType = {
    isCameraOn: boolean;
    setIsCameraOn: (value: boolean) => void;
    isMicrophoneOn: boolean;
    setIsMicrophoneOn: (value: boolean) => void;
    isCallActive: boolean;
    setIsCallActive: (value: boolean)=>void;
};

export const CallContext = createContext<Partial<CallContextType>>({});

export  const CallProvider = ({ children }: { children: ReactNode }) => {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const value: CallContextType = {
        isCameraOn,
        setIsCameraOn,
        isMicrophoneOn,
        setIsMicrophoneOn,
        isCallActive,
        setIsCallActive,
    };
    return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};
