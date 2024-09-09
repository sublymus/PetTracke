import { useEffect, useState } from 'react'
import { _L } from '../../Tools/_L'
import './Profile.css'
import { FromApiLocation, UserInterface } from '../../Database'
import { ConfirmPopup } from "../../ConfirmPopup/ConfirmPopup";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useUserStore } from './UserStore'
import { useAppRouter, useAppStore } from '../../AppStore';
import { getImg, limit } from '../../Tools/StringFormater'
export function Profile() {

    const { user, updateUser, disconnection, getAccess, deleteUserAccount } = useUserStore()
    const [collected, setCollected] = useState<Partial<UserInterface>>(user || {});
    const { navBack, qs } = useAppRouter();
    const { lang, openChild } = useAppStore();

    const [open_info, setOpen_info] = useState(false);
    useEffect(() => {
        setCollected({
            ...user
        })
    }, [user])

    useEffect(() => {
        if (user && !user?.address) {

            fetch(`http://ip-api.com/json/24.48.0.1`).then(async (response) => {
                try {
                    const a = await response.json() as FromApiLocation;
                    if (a && a.city && a.country && a.lat && a.lon) {
                        updateUser({
                            address: {
                                id: '',
                                address: `${a.city}, ${a.regionName || ''}, ${a.country}`,
                                latitude: a.lat + '',
                                longitude: a.lon + ''
                            }
                        })
                    }
                } catch (error) { }
            }).catch((error) => {
                console.log(error);
            })
        }
    }, [user])

    return (
        <div className={"profile "}>
            <div className="top">
                <div className="return" onClick={() => navBack()}></div>
                <h3 className="title">{_L('profile_title')}</h3>
            </div>
            {
                !user && <div className="connexion" onClick={() => getAccess()}><span className="icon"></span> <span className="name">Google</span>{_L('connexion')}</div>
            }
            {
                user && <>
                    <div className="photo" style={{ background: (collected?.photos?.[0] as any) instanceof Blob ? collected?.photos?.[0] && getImg(URL.createObjectURL(collected.photos[0] as any)) : getImg(collected?.photos?.[0] || '/src/res/user-fill.png') }}>
                    {/* <div className="photo"> */}
                        <label htmlFor='user-photos' className="edit" >
                            <input id='user-photos' style={{ display: 'none' }} type="file" onChange={(e) => {
                                const files = e.currentTarget.files as any;
                                setCollected({ ...collected, photos: files })
                                updateUser({
                                    photos: files
                                });
                            }
                            } />
                        </label>
                    </div>
                    <h2 className="name">{collected.full_name}</h2>
                    <div className="address">{limit(collected.address?.address, 50)}</div>
                    <div className={"open-info " + (open_info ? 'open' : 'hide')} onClick={() => setOpen_info(!open_info)}>
                        <div><h4>Update Account</h4>
                            {!open_info && <div className="email">{collected.email}</div>}</div>
                        <div className="icon"></div>
                    </div>

                    {
                        open_info && <>
                            <label htmlFor="profile-input-email">
                                <div className="label">{_L('email')}</div>
                                <div className="_flex">
                                    <input id='profile-input-email' placeholder='Email' contentEditable={false} value={user?.email} type="text"
                                        onChange={e => e.currentTarget.value = user?.email || ''}
                                    />
                                </div>
                            </label>
                            <label htmlFor="profile-input-name">
                                <div className="label">{_L('name', lang)}</div>
                                <div className="_flex">
                                    <input id='profile-input-name' value={collected.full_name || ''} placeholder='Name' type="text"
                                        onChange={e => setCollected({ ...collected, full_name: e.currentTarget.value })}
                                        onKeyUp={e => {
                                            if (e.code == 'Enter') {
                                                e.currentTarget.blur();
                                            }
                                        }}
                                        onBlur={() => {
                                            console.log(collected.full_name);

                                            updateUser({
                                                full_name: collected.full_name
                                            });
                                        }}
                                    />
                                    <div className="icon"></div>
                                </div>
                            </label>
                            <label htmlFor="profile-input-phone">
                                <div className="label">{_L('phone')}</div>
                                <div className="_flex">
                                    <PhoneInput
                                        country={'us'}
                                        value={collected.phone?.phone || ''}
                                        onChange={(phone, data: any) => setCollected({
                                            ...collected, phone: {
                                                id: '',
                                                countryCode: data.countryCode,
                                                dialCode: data.dialCode || '',
                                                format: data.format || '',
                                                name: data.name || '',
                                                phone: data.phone || phone
                                            }
                                        })}
                                        onKeyDown={e => {
                                            if (e.code == 'Enter') {
                                                e.currentTarget.blur();
                                            }
                                        }}
                                        onBlur={() => {
                                            updateUser({
                                                phone: collected.phone
                                            });
                                        }} />
                                    <div className="icon"></div>
                                </div>
                            </label>
                            <label htmlFor="profile-input-address">
                                <div className="label">{_L('address')}</div>
                                <div className="_flex">
                                    <input id='profile-input-address' placeholder='Adress' type="text"
                                        value={collected.address?.address || ''}
                                        onChange={() => undefined}
                                        onClick={() => qs().setAbsPath(['choise_address'])}
                                    />
                                    <div className="icon"></div>
                                </div>
                            </label>
                        </>
                    }
                </>

            }
            <div className="_page _setting" onClick={() => {
                qs().setAbsPath(['setting']);
            }}>{_L('setting')} <span></span></div>
            <div className="_page _about" onClick={() => {
                qs().setAbsPath(['about']);
            }}>{_L('about')} <span></span></div>
            <div className="_page _about" onClick={() => {
                qs().setAbsPath(['about']);
            }}>{_L('faq')} <span></span></div>
            <div className="_page _about" onClick={() => {
                qs().setAbsPath(['pricing']);
            }}>{_L('pricing')} <span></span></div>
            <div className="version"><span className="app-name">{_L('app_name')}</span> {_L('version')}:1.0.1</div>
            <div className="disconnection" onClick={() =>{
                const rating = localStorage.getItem('user.rating');
                if(rating){

                }else{
                    
                }
                openChild(
                    <ConfirmPopup
                        title='Are you sure to Logout'
                        confirmText='logout'
                        onCancel={() => openChild(undefined)}
                        onConfirm={() => disconnection()}
                    />, undefined, '#3455'
                )}}
            >{_L('disconnection')} <span></span></div>
            <div className="disconnection delete" onClick={() =>
                openChild(
                    <ConfirmPopup
                        title='Are you sure to delete your accounct'
                        confirmText='Delete'
                        onCancel={()=>openChild(undefined)}
                        onConfirm={()=>deleteUserAccount()}
                    />, undefined, '#3455'
                )}>{_L('delete_account')} <span></span></div>
        </div >
    )
}

