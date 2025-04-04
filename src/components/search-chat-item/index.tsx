import { FC, useEffect } from 'react';
import styles from './index.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import ChatAvatar from '../chat-avatar';
import { IconEnum } from '../chat-avatar/types/icon.enum.ts';
import { PropsType } from './types/props.type.ts';

const ChatItem: FC<PropsType> = ({ chat }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const elementId = `chat-${chat.id}`;

    useEffect(() => {
        const element = document.getElementById(elementId)!;
        element.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
    }, []);

    return (
        <div
            id={elementId}
            className={`${styles.chat_item} ${id === `${chat.id}` && styles.selected_chat}`}
            onClick={() => {
                document.documentElement.style.setProperty('--menu-margin', 'var(--menu-width)');
                navigate(`${chat.id}`, { state: chat });
            }}
        >
            <ChatAvatar onlineCount={undefined} maxUsersOnline={chat.maxUsersOnline} iconType={IconEnum.RECORD} />
            <div className={styles.main_inf}>
                <div className={styles.title_block}>
                    <div className={styles.title}>{chat.title}</div>
                    {/*<div className={styles.look}>*/}
                    {/*    {chat.type === ChatEnum.IS_OPEN && (*/}
                    {/*        <AiOutlineGlobal className={styles.look_svg} color="green" />*/}
                    {/*    )}*/}
                    {/*    {chat.type === ChatEnum.IS_SHARED && <LiaEyeSolid className={styles.look_svg} color="green" />}*/}
                    {/*    {chat.type === ChatEnum.IS_PUBLIC && <RxLockOpen1 className={styles.look_svg} color="green" />}*/}
                    {/*    {chat.type === ChatEnum.IS_PRIVATE && <RxLockClosed className={styles.look_svg} color="red" />}*/}
                    {/*</div>*/}
                </div>
                <div className={styles.count_message_block}>
                    <div className={styles.count_message}>{chat.countMessages}</div>
                </div>
            </div>
        </div>
    );
};

export default ChatItem;
