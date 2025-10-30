import { FC, useState } from 'react';
import styles from './index.module.css';
import { MenuTitle } from '../menu-title';
import { RiShieldKeyholeLine } from 'react-icons/ri';
import { useAppSelector } from '../../root/store';
// import { QRCodeSVG } from 'qrcode.react';
// import image from '../../../public/assets/icons/512.png';
import { Scanner } from '@yudiel/react-qr-scanner';
import QRGenerator from './delete.tsx';

export const Privacy: FC = () => {
    const RASKeysString = useAppSelector((state) => state.app.RASKeysString);
    const [key, setKey] = useState<string>();
    // const isCheckVerified = useAppSelector((state) => state.app.settings?.isCheckVerified);
    // const { changeSettings } = useAppAction();

    if (RASKeysString)
        return (
            <div className={styles.background}>
                <MenuTitle icon={<RiShieldKeyholeLine />} title={'privacy_policy'} />
                <div style={{ overflow: 'auto' }}>
                    <QRGenerator value={RASKeysString.publicKey} />
                    {!key && (
                        <Scanner
                            onScan={(result) => {
                                if (result?.length > 0) {
                                    setKey(result[0].rawValue);
                                    console.log(result);
                                    console.log('✅ QR detected:', result[0].rawValue);
                                }
                            }}
                            onError={(err) => console.error('❌ Error:', err)}
                            styles={{ container: { width: '300px', height: '300px' } }}
                        />
                    )}
                    {/*<QRCodeSVG*/}
                    {/*    value={'Hello world!'}*/}
                    {/*    // value={RASKeysString.publicKey}*/}
                    {/*    // style={{ width: 'calc(100% - 16px)', height: 'auto', padding: 8 }}*/}
                    {/*    // imageSettings={{*/}
                    {/*    //     src: image,*/}
                    {/*    //     height: 100,*/}
                    {/*    //     width: 100,*/}
                    {/*    //     excavate: false,*/}
                    {/*    //     opacity: 0.6,*/}
                    {/*    // }}*/}
                    {/*    // fgColor={'var(--menu-color)'}*/}
                    {/*    // bgColor={'white'}*/}
                    {/*/>*/}
                    {key && (
                        <div
                            style={{
                                color: 'white',
                                padding: 8,
                                whiteSpace: 'normal',
                                overflowWrap: 'break-word',
                            }}
                        >
                            <div>QR Другого пользователя:</div>
                            <div style={{ color: 'red' }}>{key}</div>
                        </div>
                    )}
                </div>

                {/*<div>Добавить пароль при входе в приложение</div>*/}
                {/*<Checkbox*/}
                {/*    checked={!!isCheckVerified}*/}
                {/*    onChange={() => changeSettings({ isCheckVerified: !isCheckVerified })}*/}
                {/*/>*/}
            </div>
        );
};
