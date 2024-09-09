import { useState } from 'react';
import { useAppRouter, useAppStore } from '../../AppStore'
import './Setting.css'
import NotifContext from '../../Tools/Notification';
import { useUserStore } from '../Profile/UserStore';
import { _L } from '../../Tools/_L';


export function Setting() {
    const {user} = useUserStore()
    const { current, navBack } = useAppRouter();
    const [setting, setSetting] = useState<any>({
        notif_push:!!localStorage.getItem('setting.notif_push'),
        share_data:!!localStorage.getItem('setting.share_data'),
        enable_location:!!localStorage.getItem('setting.enable_location'),
    })
    const { setLang } = useAppStore()
    return current('setting') && (
        <div className="setting">
            <div className="ctn">
                <h3 className="title">
                    <span onClick={() => navBack()}></span>
                    {'Settings'}</h3>
                <h2>Setting Manager</h2>
                <h3>Preferences</h3>
                <div className='pref pref-disable'>
                    <div className="text">
                        <div className="name">Email Notifications</div>
                        <p>Receive updates via email</p>
                    </div>
                    <SwitchBtn value={setting.notif_email} setValue={(_value)=>{
                        // setSetting({...setting,notif_email:value});
                    }}/>
                </div>
                <div className='pref'>
                    <div className="text">
                        <div className="name">Push Notifications</div>
                        <p>Get alertson your device</p>
                    </div>
                    <SwitchBtn value={setting.notif_push} setValue={(value)=>{
                        setSetting({...setting,notif_push:value});
                        localStorage.setItem('setting.notif_push',value?'true':'')
                        if(value){
                            user &&  NotifContext.enable({
                                target:'all',
                                user,
                            });
                        }else{
                            user &&  NotifContext.disable({
                                target:'all',
                                user,
                            });
                        }
                    }}/>
                </div>
                <div className='pref pref-disable'>
                    <div className="text">
                        <div className="name">Dark Theme</div>
                        <p>Change theme to the dark theme</p>
                    </div>
                    <SwitchBtn value={setting.dark_theme} setValue={(_value)=>{
                        // setSetting({...setting,dark_theme:value});
                    }}/>
                </div>
                <h3>Language</h3>

                <select name="language" id="language" value={setting.lang} onChange={(e)=>{
                        const lang = e.currentTarget.value;
                        setLang(lang as any);
                    }}>
                    <option value="en" selected={_L.lang == 'en'}>English</option>
                    <option value="ru" selected={_L.lang == 'ru'}>Русский</option>
                    <option value="fr" selected={_L.lang == 'fr'}>Français</option>
                </select>

                <h2>Privacy Options</h2>
                <div className='pref'>
                    <div className="text">
                        <div className="name">Share Data With Third Parties</div>
                        <p>Allows sharing of your data</p>
                    </div>
                    <SwitchBtn value={setting.share_data} setValue={(value)=>{
                        setSetting({...setting,share_data:value});
                        localStorage.setItem('setting.share_data',value?'true':'')
                    }}/>
                </div>
                <div className='pref'>
                    <div className="text">
                        <div className="name">Enable Location Tracking</div>
                        <p>Allow Tracking of your location</p>
                    </div>
                    <SwitchBtn value={setting.enable_location} setValue={(value)=>{
                        setSetting({...setting,enable_location:value});
                        localStorage.setItem('setting.enable_location',value?'true':'')
                        if(value){
                            NotifContext.required()
                        }
                    }}/>
                </div>
            </div>
        </div>
    )
}

function SwitchBtn({value, setValue}:{value?:boolean,setValue?:(value:boolean)=>any}) {
    

    return <div className={"switch-btn "+(value?'ok':'')} onClick={()=>setValue?.(!value)}>
        <span></span>
    </div>
}


