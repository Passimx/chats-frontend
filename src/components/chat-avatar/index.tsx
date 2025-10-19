import styles from './index.module.css';
import { FC, useEffect, useState } from 'react';

import { PropsType } from './types/props.type.ts';
import setVisibilityCss from '../../common/hooks/set-visibility-css.ts';
import { IconEnum } from './types/icon.enum.ts';
import { FaUsers } from 'react-icons/fa';
import { HiTrendingUp } from 'react-icons/hi';
import { useAppSelector } from '../../root/store';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { RiWifiOffLine } from 'react-icons/ri';
import imageIcon from '../../../public/assets/icons/192.png';

const ChatAvatar: FC<PropsType> = ({ onlineCount, maxUsersOnline, iconType, isChange = false, isSystem = false }) => {
    const { isListening, isOnline } = useAppSelector((state) => state.app);
    const [isShow, setIsShow] = useState<boolean>();

    useEffect(() => {
        if (isSystem) setIsShow(undefined);
    }, [isSystem]);

    return (
        <div
            className={`${styles.background} ${setVisibilityCss(styles.from_online_to_record, styles.from_record_to_online, isShow)}`}
            onClick={() => isChange && setIsShow(!isShow)}
            style={{ transform: iconType === IconEnum.RECORD ? 'rotateY(-180deg)' : 'rotateY(0deg)' }}
        >
            <div className={styles.cube}>
                <div className={`${styles.icon_number} ${styles.front}`}>
                    {isSystem ? (
                        <img src={imageIcon} className={styles.img_icon} alt={'icon'} />
                    ) : isListening && onlineCount ? (
                        onlineCount
                    ) : (
                        <div id={styles.logos_block}>
                            <AiOutlineLoading3Quarters className={styles.loading_logo} />
                            {isChange && !isOnline && (
                                <RiWifiOffLine className={`${styles.logo} ${styles.no_wifi_logo}`} />
                            )}
                        </div>
                    )}
                </div>
                <div className={`${styles.icon_number} ${styles.back}`}>{maxUsersOnline}</div>
                <div className={styles.look}>
                    <FaUsers
                        className={`${styles.look_svg_green} ${styles.look_svg} ${isShow !== undefined && setVisibilityCss(styles.hide_slowly, styles.show_slowly, isShow)}`}
                        style={{
                            color: 'green',
                            visibility: isShow === undefined && iconType === IconEnum.ONLINE ? 'visible' : 'hidden',
                        }}
                    />
                    <HiTrendingUp
                        className={`${styles.look_svg} ${isShow !== undefined && setVisibilityCss(styles.hide_slowly, styles.show_slowly, !isShow)}`}
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
