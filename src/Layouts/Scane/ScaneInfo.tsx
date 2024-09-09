import { useEffect } from 'react';
import { useAppRouter, useAppStore } from '../../AppStore'
// import { useCodeStore } from '../Code/CodeStore'
import './ScaneInfo.css'
import { AnimalInterface, FromApiLocation, /* CodeInterface, */ ScaneInterface, UserInterface } from '../../Database';
import { _L } from '../../Tools/_L';
import QRCode from 'react-qr-code';
import { getImg } from '../../Tools/StringFormater';
import { Host } from '../../Config';
import MapView from '../MapView/MapView';
import { useScaneStore } from './ScaneStore';


export function ScaneInfo() {

    const { json, current, navBack } = useAppRouter();
    const { setLang } = useAppStore()
    const j = json as { owner: UserInterface, animal: AnimalInterface, scane: ScaneInterface }
    const { setScaneById, updateScane, scane } = useScaneStore()

    useEffect(() => {
        json?.scane?.id && setScaneById(j.scane.id || json.scane_id)

    }, [json])

    const isOwner = current('owner_open_scane')
    useEffect(() => {
        if (!isOwner && scane && !scane?.address) {

            fetch(`http://ip-api.com/json/24.48.0.1`).then(async (response) => {
                try {
                    const a = await response.json() as FromApiLocation;
                    if (a && a.city && a.country && a.lat && a.lon) {
                        updateScane({
                            id: scane?.id || scane?.id || '',
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
    }, [scane])
    return (
        <div className={"scane-info " + (isOwner ? 'owner' : '')}>
            <div className="ctn">
                <h3 className="title">
                    {
                        isOwner && <span onClick={() => navBack()}></span>
                    }
                    {_L('aminal_page_title_1')}
                    <select name="language" id="language" value={localStorage.getItem('setting.lang') || 'en'} onChange={(e) => {
                        const lang = e.currentTarget.value;
                        setLang(lang as any);
                    }}>
                        <option value="en">English</option>
                        <option value="ru">Русский</option>
                        <option value="fr">Français</option>
                    </select>
                </h3>
                <h2>{_L('aminal_page_title_2')}</h2>
                <div className="animal-info">
                    <div className="image" style={{ background: getImg(j.animal.images[0]) }}></div>
                    <div className="info">
                        <div className='t'>{_L('name')} : <span>{j.animal.name}</span></div>
                        <div className='t'>{_L('species')} : <span>{j.animal.species}</span></div>
                        <div className='t'>{_L('breed')} : <span>{j.animal.breed}</span></div>
                        <div className='t'>{_L('age')} : <span>{j.animal.age} years</span></div>
                        <div className='t'>{_L('sex')} : <span>{j.animal.sex}</span></div>
                        <div className='t'>{_L('color')} : <span>{j.animal.color}</span></div>
                    </div>
                </div>
                <h2>{_L('owner_info_title')}</h2>
                <div className="info">
                    <div className='t'>{_L('owner')} : <span>{j.owner.full_name}</span></div>
                    <div className='t'>{_L('email')} : <span>{j.owner.email}</span></div>
                    <div className='t'>{_L('phone')} : <span>{j.owner.phone?.phone && (() => {
                        const f = j.owner.phone?.format || '';
                        const n = j.owner.phone?.phone || '';
                        let cn = 0;
                        let p = ''
                        for (let i = 0; i < f.length; i++) {
                            const c = f[i];
                            p += c == '.' ? n[cn++] : c
                        }
                        j.owner.phone && ((j.owner.phone as any).p = p);
                        return p
                    })()}</span></div>
                    {
                        j.owner.phone?.phone && <div className="soscial">
                            <div onClick={() => {
                                window.open(`tel:+` + (j.owner.phone?.phone || ''))
                            }} className="call"><span></span> {_L('call_owner')}</div>
                            <div onClick={() => {
                                window.open(`https://wa.me/` + (j.owner.phone?.phone || ''))
                            }} className="whatsapp"><span></span> {_L('whatsapp')}</div>
                            <div onClick={() => {
                                window.open(` https://t.me/+` + (j.owner.phone?.phone || ''))
                            }} className="telegram"><span></span> {_L('telegram')}</div>
                        </div>
                    }
                </div>

                <h2>{_L('current_location')}</h2>
                <p>{scane?.address?.address}</p>
                <div className="map">
                    <MapView home={j.owner.address} canChange={!isOwner} address={scane?.address} setAddress={(address) => {
                        !isOwner && scane && updateScane({
                            id: scane?.id || '',
                            address
                        })
                    }} />
                    <div className="hover">
                        <div className="required-permission"></div>
                    </div>
                </div>
                <h2>{_L('medical_info')}</h2>
                <div className="infos">
                    <div className='t'>{_L('medications')} : <span>{j.animal.medication}</span></div>
                    <div className='t'>{_L('vaccines')} : <span>{j.animal.vaccines}</span></div>
                    <div className='t'>{_L('allergies')} : <span>{j.animal.allergies}</span></div>
                    <div className='t'>{_L('conditions')} : <span>{j.animal.conditions}</span></div>
                </div>
                <h2>Veterinarian Infomations</h2>
                <div className="infos">
                    <div className='t'>{_L('animal_veto_name')} : <span>{j.animal.veto_name}</span></div>
                    <div className='t'>{_L('animal_veto_phone')} : <span>{j.animal.veto_phone}</span></div>
                    <div className='t'>{_L('animal_veto_address')} : <span>{j.animal.veto_address}</span></div>
                    <div className='t'>{_L('animal_veto_clinic')} : <span>{j.animal.veto_clinic}</span></div>
                </div>
                <h2>{_L('aminal_page_title_4')}</h2>
                <p>{j.animal.about}</p>
                <h2>{_L('qr_code_info_title')}</h2>
                <div className="_flex">
                    <div className="qr">
                        <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={`${Host}/s_c/${'123456' || ''}`}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                    <span>{_L('qr_code_prompt')}</span>
                </div>
                {/* <pre>
                    {
                        JSON.stringify(json, undefined, 4)
                    }
                </pre> */}
            </div>
        </div>
    )
} 