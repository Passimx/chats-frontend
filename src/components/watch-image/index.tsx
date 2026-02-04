import { memo } from 'react';
import { PropsType } from './props.type';
import styles from './index.module.css';
import { useDownloadPreview } from '../../common/hooks/use-download-preview.hook';

export const WatchImage = memo(({ file }: PropsType) => {
    const imageSrc = useDownloadPreview(file);

    return (
        <div>
            <img className={styles.image_view} src={imageSrc} alt="image" />
        </div>
    );
});
