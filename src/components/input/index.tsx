import { FC, useEffect, useMemo, useState } from 'react';
import { PropsType } from './types/props.type.ts';
import styles from './index.module.css';
import { MdOutlineCancel } from 'react-icons/md';
import { useFormContext } from 'react-hook-form';
import { FormType } from '../create-chat/types/form.type.ts';

const Input: FC<Partial<PropsType>> = ({ placeholder, register, value = '' }) => {
    const [ownValue, setOwnValue] = useState<string>(value);
    const [isTexted, setIsTexted] = useState<boolean>(false);
    const {
        formState: { errors },
    } = useFormContext<FormType>();
    const fieldName = useMemo(() => {
        return register?.name as keyof FormType;
    }, []);

    const error = useMemo(() => {
        return errors[fieldName]?.message;
    }, [errors[fieldName]]);

    useEffect(() => {
        if (ownValue?.length > 0) setIsTexted(true);
    }, [ownValue]);

    const cancel = () => {
        setOwnValue('');
    };

    return (
        <div id={styles.background} className={`${error ? styles.error_border : ''}`}>
            <input
                className={`${styles.button} text_translate`}
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

            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
};

export default Input;
