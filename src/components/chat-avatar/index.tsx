import styles from './index.module.css';
import logo from '/assets/images/icon512_rounded.png';
import { ChatEnum } from '../../root/types/chat/chat.enum.ts';
import { AiOutlineGlobal } from 'react-icons/ai';
import { LiaEyeSolid } from 'react-icons/lia';
import { RxLockClosed, RxLockOpen1 } from 'react-icons/rx';
import { FC } from 'react';

import { PropsType } from './types/props.type.ts';

const ChatAvatar: FC<PropsType> = ({ type }) => {
    return (
        <div className={styles.background}>
            <img className={`${styles.icon_avatar} ${styles.icon_public_or_private_chat}`} src={logo} alt={'icon'} />
            <div className={styles.look}>
                {type === ChatEnum.IS_OPEN && <AiOutlineGlobal className={styles.look_svg} color="green" />}
                {type === ChatEnum.IS_SHARED && <LiaEyeSolid className={styles.look_svg} color="green" />}
                {type === ChatEnum.IS_PUBLIC && <RxLockOpen1 className={styles.look_svg} color="green" />}
                {type === ChatEnum.IS_PRIVATE && <RxLockClosed className={styles.look_svg} color="red" />}
            </div>
        </div>
    );
};

export default ChatAvatar;
