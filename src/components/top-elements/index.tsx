import { FC, memo } from 'react';
import { CopiedText } from '../copied-text';
import { Page } from '../../pages/page';
import { PreviewMedia } from '../preview-media';

/** Foreground components */
export const TopElements: FC = memo(() => {
    return (
        <>
            <PreviewMedia />
            <Page />
            <CopiedText />
        </>
    );
});
