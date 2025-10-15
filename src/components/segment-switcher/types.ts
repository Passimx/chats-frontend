export type OptionType = [string | number, number | undefined];

export type PropsType = {
    options: OptionType[];
    value: number | undefined;
    onChange: (v?: number) => void;
};
