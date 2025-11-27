import { PartTypeEnum } from './part-type.enum.ts';

type LinkType = {
    type: PartTypeEnum.LINK;
    content: string;
    url: string;
};

type TextType = {
    type: PartTypeEnum.TEXT;
    content: string;
};

type TagType = {
    type: PartTypeEnum.TAG;
    content: string;
};

type NameType = {
    type: PartTypeEnum.NAME;
    content: string;
};

export type ParseMessagePartType = LinkType | TextType | TagType | NameType;
