import { FC, useEffect, useState } from 'react';
import { PropsType } from './types/props.type.ts';
import styles from './styles.module.css';
import { MdOutlineCancel } from 'react-icons/md';
import { IoSearch } from 'react-icons/io5';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Input: FC<PropsType> = ({ onChange, placeholder, className, value = '', register, isLoading }) => {
    const [ownValue, setOwnValue] = useState<string>(value);
    const [isTexted, setIsTexted] = useState<boolean>(false);

    useEffect(() => {
        if (ownValue !== '') {
            setIsTexted(true);
            onChange(ownValue);
        } else onChange(undefined);
    }, [ownValue]);

    const cancel = () => {
        setOwnValue('');
    };

    return (
        <div id={styles.background}>
            <div id={styles.search_logos}>
                {isLoading ? (
                    <AiOutlineLoading3Quarters id={styles.loading_logo} className={styles.logo} />
                ) : (
                    <IoSearch id={isTexted ? styles.search_logo : ''} className={styles.logo} />
                )}
            </div>
            <input
                className={`${styles.button} ${className ?? ''}`}
                placeholder={placeholder}
                value={ownValue}
                {...register}
                onChange={(val) => setOwnValue(val.target.value)}
            />
            <div id={styles.cancel}>
                {isTexted && (
                    <MdOutlineCancel
                        id={styles.cancel_logo}
                        className={ownValue ? styles.logo_show : styles.logo_hide}
                        onClick={cancel}
                    />
                )}
            </div>
        </div>
    );
};

export default Input;
