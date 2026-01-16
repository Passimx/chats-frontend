import { useEffect, useState } from 'react';
import { Types } from '../../root/types/files/types.ts';
import { DownloadFilePreview } from '../../root/api/files';

export const useDownloadPreview = (file: Types) => {
    const [url, setUrl] = useState<string>();

    const downloadPreview = async () => {
        const blob = await DownloadFilePreview(file);
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        setUrl(file?.metadata?.lossless ? `url(${url})` : url);
    };

    useEffect(() => {
        downloadPreview();
    }, [file?.metadata?.previewId]);

    return url;
};
