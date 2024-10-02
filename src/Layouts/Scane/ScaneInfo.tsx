import { useEffect, useState } from 'react';
import { useAppRouter, useAppStore } from '../../AppStore'
// import { useCodeStore } from '../Code/CodeStore'
import './ScaneInfo.css'
import { AnimalInterface, CodeInterface, FromApiLocation, ListType, /* CodeInterface, */ ScaneInterface, UserInterface } from '../../Database';
import { _L } from '../../Tools/_L';
import QRCode from 'react-qr-code';
import { PhoneFormater, getImg } from '../../Tools/StringFormater';
import { Host } from '../../Config';
import MapView from '../MapView/MapView';
import { useScaneStore } from './ScaneStore';
import { RatingPage } from '../RatingPage/RatingPage';
import { useCodeStore } from '../Code/CodeStore';
import { CodeItem } from '../../Components/CodeItem/CodeItem';
import { useAnimalStore } from '../Animal/AnimalStore';
import { useUserStore } from '../Profile/UserStore';


export function ScaneInfo() {

    const {pathList, json, current, navBack, qs } = useAppRouter();
    const { openChild, setLang } = useAppStore()
    const { animal, fetchAnimals} = useAnimalStore()
    const { user } = useUserStore()
    const[j, setJ] = useState(json as { owner: UserInterface, animal: AnimalInterface, scane?: ScaneInterface })
    const { setScaneById, updateScane, scane } = useScaneStore()

    useEffect(() => {
        json?.scane?.id && setScaneById(j.scane?.id || json.scane_id)
    }, [json])

    const isPetProfile = current('pet_profile')
    const isOwner = isPetProfile || current('owner_open_scane')
    const isFounder = isPetProfile || current('scane_info')
    useEffect(() => {
        if (isFounder && scane && !scane?.address) {

            fetch(`https://ipinfo.io/json`).then(async (response) => {
                try {
                    const a = await response.json() as FromApiLocation;
                    if (a && a.loc) {
                        console.log(a);

                        updateScane({
                            id: scane?.id || scane?.id || '',
                            address: {
                                id: '',
                                address: a.region,
                                latitude: a.loc.split(',')[0] + '',
                                longitude: a.loc.split(',')[1] + ''
                            }
                        })
                    }
                } catch (error) { }
            }).catch((error) => {
                console.log(error);
            })
        }
    }, [scane]);

    const [s] = useState<any>({
        scane: scane || {}
    })
    s.scane = scane;
    const { fetchCodes } = useCodeStore();
    const [codes, setCodes] = useState<ListType<CodeInterface> | undefined>()

    useEffect(() => {
        if (!current('pet_profile')) return;
        if (!j.owner) return;
        
        fetchCodes({
            animal_id: (j.animal  as any)?.animal_id ||j.animal?.id,
            no_save: true,
        }).then(res => {
            setCodes(res)
        })
    }, [json]);
    useEffect(()=>{
        
        if (!(current('pet_profile') && user)) return;

        if(animal?.id == (j.animal  as any)?.animal_id ||j.animal?.id){
            fetchAnimals({
                no_save:true,
                animal_id: (j.animal  as any)?.animal_id ||j.animal?.id,
            }).then(res=>{
                console.log('scane_info :  res',res);
                setJ({...j,animal:{ ...j.animal, ...res?.list[0]}})
            })
        }
    },[user, pathList, animal]);
    // console.log('scane_info',j.animal);
    
    return j.animal && j.owner && (
        <div className={"scane-info " + (isOwner ? 'owner' : '')}>
            <div className="ctn">
                <h3 className="title">
                    {
                        isOwner && <span className='return' onClick={() => {
                            if (isFounder && !localStorage.getItem('user.rating')) {
                                openChild(<RatingPage
                                    env='center'
                                    onCancel={() => {
                                        openChild(undefined)
                                        navBack()
                                    }}
                                    onSubmit={(d) => {
                                        console.log(d);
                                        navBack()
                                    }}
                                />, true, '#3455')
                            } else {
                                navBack()
                            }
                        }}></span>
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
                    <h2><span>{j.animal.name}</span></h2>
                    <div className="info">
                        <div className='t'>{_L('species')} : <span>{j.animal.species}</span></div>
                        <div className='t'>{_L('breed')} : <span>{j.animal.breed}</span></div>
                        <div className='t'>{_L('age')} : <span>{j.animal.age && (j.animal.age + ' ' + _L('years'))}</span></div>
                        <div className='t'>{_L('sex')} : <span>{j.animal.sex}</span></div>
                        <div className='t'>{_L('color')} : <span>{j.animal.color}</span></div>
                    </div>
                </div>
                {
                    !isPetProfile && <>
                        <h2>{_L('owner_info_title')}</h2>
                        <div className="info">
                            <div className='t'>{_L('owner')} : <span>{j.owner.full_name}</span></div>
                            <div className='t'>{_L('email')} : <span>{j.owner.email}</span></div>
                            <div className='t'>{_L('phone')} : <span>{j.owner.phone?.phone && PhoneFormater(j.owner.phone)}</span></div>
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
                    </>
                }

                {
                    !isPetProfile && <>

                        <h2>{_L('current_location')}</h2>
                        <p>{scane?.address?.address}</p>
                        <div className="map">
                            <MapView mode={isOwner ? 'scane' : 'found'} scane={scane} home={j.owner.address} canChange={!isOwner} address={scane?.address} setAddress={(address) => {
                                !isOwner && updateScane({
                                    id: s.scane.id || '',
                                    address
                                })
                            }} />
                            <div className="hover">
                                <div className="required-permission"></div>
                            </div>
                        </div>
                    </>
                }
                <h2>{_L('medical_info')}</h2>
                <div className="infos">
                    <div className='t'>{_L('medications')} : <span>{j.animal.medication}</span></div>
                    <div className='t'>{_L('vaccines')} : <span>{j.animal.vaccines}</span></div>
                    <div className='t'>{_L('allergies')} : <span>{j.animal.allergies}</span></div>
                </div>
                <h2>{_L('veto_info')}</h2>
                <div className="infos">
                    <div className='t'>{_L('animal_veto_name')} : <span>{j.animal.veto_name}</span></div>
                    <div className='t'>{_L('animal_veto_phone')} : <span>{j.animal.veto_phone}</span></div>
                    <div className='t'>{_L('animal_veto_clinic')} : <span>{j.animal.veto_clinic}</span></div>
                </div>
                {
                    j.animal.about && <>
                        <h2>{_L('about_pet')}</h2>
                        <p>{j.animal.about}</p>
                    </>
                }
                {
                    !isPetProfile && <>
                        <h2>{_L('qr_code_info_title')}</h2>
                        <div className="_flex">
                            <div className="qr" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <QRCode
                                    size={256}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    value={`${Host}/s_c/${'123456' || ''}`}
                                    viewBox={`0 0 256 256`}
                                />
                                <p>{scane?.code_url}</p>
                            </div>
                            <span>{_L('qr_code_prompt')}</span>
                        </div>
                    </>
                }
                {
                    isPetProfile && <div className="edit" onClick={() => {
                        qs({ animal_id: j.animal.id }).setAbsPath(['animal']);
                    }}><span></span>{/* {_L('edit')} */} Edit</div>
                }
            </div>
            {
                isPetProfile && <div className="lits-codes">
                    {
                        <>
                            <div className="title">
                                <h2>{_L('codes_list')}</h2>
                                <div className="add-new" onClick={() => qs(j.animal && { animal_id: j.animal.id }).setAbsPath(['new_code'])}>
                                    <span></span>
                                    {_L('new_code')}
                                </div>
                            </div>
                            <div className="list">
                                {
                                    codes?.list.map((c => (
                                        <CodeItem key={c.id} animal_info={false} code={c} onClick={() => qs({ code_id: c.id }).setAbsPath(['code'])} />
                                    )))
                                }
                            </div>
                        </>
                    }
                </div>
            }
        </div >
    )
} 