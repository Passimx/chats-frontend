export type PropsType = {
    value?: string;
    register?: any;
    isLoading?: boolean;
    placeholder?: string;
    className?: string;
    onChange: (value: string | undefined) => void;
};
