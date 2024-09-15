import { useEffect, useState } from 'react';
import { useAppRouter, useAppStore } from '../../AppStore'
import './Setting.css'
import NotifContext from '../../Tools/Notification';
import { useUserStore } from '../Profile/UserStore';
import { _L } from '../../Tools/_L';


export function Setting() {
    const { user } = useUserStore()
    const { current, navBack } = useAppRouter();
    const [setting, setSetting] = useState<any>({
        notif_push: !!localStorage.getItem('setting.notif_push'),
        share_data: !!localStorage.getItem('setting.share_data'),
        enable_location: !!localStorage.getItem('setting.enable_location'),
    })
    const [s] = useState<any>({});

    s.setting = setting;
    useEffect(() => {
        try {
            navigator.permissions.query({ name: 'notifications' }).then(result => {
                setSetting({ ...s.setting, notif_push: result?.state == 'granted' });
                result.addEventListener('change', () => {
                    setSetting({ ...s.setting, notif_push: result?.state == 'granted' });
                    localStorage.setItem('setting.notif_push', result?.state == 'granted' ? 'true':'')
                })

            })
        } catch (error) {
            console.log(error);
        }
    })
    const { setLang } = useAppStore()
    return current('setting') && (
        <div className="setting">
            <div className="ctn">
                <h3 className="title">
                    <span onClick={() => navBack()}></span>
                    {_L('settings')}</h3>
                <h2>{_L('setting_title')}</h2>
                <h3>{_L('preferences')}</h3>
                <div className='pref pref-disable'>
                    <div className="text">
                        <div className="name">{_L('email_notifications')}</div>
                        <p>{_L('receive_email')}</p>
                    </div>
                    <SwitchBtn value={setting.notif_email} setValue={(_value) => {
                        // setSetting({...setting,notif_email:value});
                    }} />
                </div>
                <div className='pref'>
                    <div className="text">
                        <div className="name">{_L('push_notification')}</div>
                        <p>{_L('push_notification_2')}</p>
                    </div>
                    <SwitchBtn value={setting.notif_push} setValue={async (value) => {
                        setSetting({ ...setting, notif_push: value });
                        localStorage.setItem('setting.notif_push', value ? 'true' : '')
                        if (value) {
                            await NotifContext.required();

                            user && await NotifContext.sendData(user);
                            user && NotifContext.enable({
                                target: 'all',
                            });
                        } else {
                            user && NotifContext.disable({
                                target: 'all',
                            });
                        }
                    }} />
                </div>
                <div className='pref pref-disable'>
                    <div className="text">
                        <div className="name">{_L('dark_mode')}</div>
                        <p>{_L('dark_mode_2')}</p>
                    </div>
                    <SwitchBtn value={setting.dark_theme} setValue={(_value) => {
                        // setSetting({...setting,dark_theme:value});
                    }} />
                </div>
                <h3>{_L('language')}</h3>

                <select name="language" id="language" value={setting.lang} onChange={(e) => {
                    const lang = e.currentTarget.value;
                    setLang(lang as any);
                }}>
                    <option value="en" selected={_L.lang == 'en'}>English</option>
                    <option value="ru" selected={_L.lang == 'ru'}>Русский</option>
                    <option value="fr" selected={_L.lang == 'fr'}>Français</option>
                </select>

                <h2>{_L('privacy_options')}</h2>
                <div className='pref'>
                    <div className="text">
                        <div className="name">{_L('share_data')}</div>
                        <p>{_L('share_data_2')}</p>
                    </div>
                    <SwitchBtn value={setting.share_data} setValue={(value) => {
                        setSetting({ ...setting, share_data: value });
                        localStorage.setItem('setting.share_data', value ? 'true' : '')
                    }} />
                </div>
                <div className='pref'>
                    <div className="text">
                        <div className="name">{_L('enable_location')}</div>
                        <p>{_L('enable_location_2')}</p>
                    </div>
                    <SwitchBtn value={setting.enable_location} setValue={(value) => {
                        setSetting({ ...setting, enable_location: value });
                        localStorage.setItem('setting.enable_location', value ? 'true' : '')
                        if (value) {
                            NotifContext.required()
                        }
                    }} />
                </div>
            </div>
        </div>
    )
}

function SwitchBtn({ value, setValue }: { value?: boolean, setValue?: (value: boolean) => any }) {


    return <div className={"switch-btn " + (value ? 'ok' : '')} onClick={() => setValue?.(!value)}>
        <span></span>
    </div>
}


