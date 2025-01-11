import styles from './index.module.css';
import { FC, useState } from 'react';

import { PropsType } from './types/props.type.ts';
import useVisibility from '../../common/hooks/use-visibility.ts';
import { IconEnum } from './types/icon.enum.ts';
import { FaUsers } from 'react-icons/fa';
import { HiTrendingUp } from 'react-icons/hi';
import { useAppSelector } from '../../root/store';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const ChatAvatar: FC<PropsType> = ({ onlineCount, recordCount, iconType, isChange = false }) => {
    const { isListening } = useAppSelector((state) => state.app);
    const setClass = useVisibility;
    const [isShow, setIsShow] = useState<boolean>();

    return (
        <div
            className={`${styles.background} ${useVisibility(styles.from_online_to_record, styles.from_record_to_online, isShow)}`}
            onClick={() => isChange && setIsShow(!isShow)}
            style={{ transform: iconType === IconEnum.RECORD ? 'rotateY(-180deg)' : 'rotateY(0deg)' }}
        >
            <div className={styles.cube}>
                <div className={`${styles.icon_number} ${styles.front}`}>
                    {isListening ? onlineCount : <AiOutlineLoading3Quarters className={styles.loading_logo} />}
                </div>
                <div className={`${styles.icon_number} ${styles.back}`}>{recordCount}</div>
                <div className={styles.look}>
                    <FaUsers
                        className={`${styles.look_svg} ${isShow !== undefined && setClass(styles.hide_slowly, styles.show_slowly, isShow)}`}
                        style={{
                            color: 'green',
                            visibility: isShow === undefined && iconType === IconEnum.ONLINE ? 'visible' : 'hidden',
                        }}
                    />
                    <HiTrendingUp
                        className={`${styles.look_svg} ${isShow !== undefined && setClass(styles.hide_slowly, styles.show_slowly, !isShow)}`}
                        style={{
                            color: 'goldenrod',
                            visibility: isShow === undefined && iconType === IconEnum.RECORD ? 'visible' : 'hidden',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatAvatar;
