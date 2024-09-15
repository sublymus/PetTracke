import QRCode from 'react-qr-code';
import { useAppRouter, useAppStore } from '../../AppStore';
import { _L } from '../../Tools/_L';
import { useUserStore } from '../Profile/UserStore'
import './Code.css'
import { useCodeStore } from './CodeStore';
import { useEffect, useState } from 'react';
import { getImg } from '../../Tools/StringFormater';
import { AnimalInterface, CodeInterface } from '../../Database';
import { useAnimalStore } from '../Animal/AnimalStore';
import { Host } from '../../Config';
import NotifContext from '../../Tools/Notification';
import { ConfirmPopup } from '../../Components/ConfirmPopup/ConfirmPopup';


export function CodePage() {

    const { current, json, navBack, pathList , qs } = useAppRouter();
    const { user } = useUserStore();
    const { openChild } = useAppStore()
    const { code, setCodeById, updateCode, removeCode, createCode } = useCodeStore()
    const { setAnimalById, animal } = useAnimalStore()
    const [loading, setLoading] = useState(false);
    const isNew = current('new_code');
    const isEdit = current('code');
    const [collected, setCollected] = useState<Partial<CodeInterface>>({});
    useEffect(() => {
        isEdit && code && setCollected(code);
        isNew && setCollected({})
    }, [code, pathList])

    useEffect(() => {
        user && setCodeById(json)
        if(user && json?.animal_id){
            setAnimalById(json)
        }
    }, [json, user]);

    useEffect(()=>{
        setCollected({...collected,...animal})
    },[animal])
    return (isEdit || isNew) && (
        <div className="code-page">
            <div className="top">
                <div className="return" onClick={() => navBack()}></div>
                <h3 className="title">{_L('code_title')}</h3>
            </div>

            <div className="infos">
                <div className="replace" onClick={() => {
                    openChild(<ChoiseAnimal setAnimal={(a) => {
                        isNew && setCollected({
                            ...collected,
                            animal_id: a.id,
                            ...a,
                        })
                        isEdit && updateCode({
                            animal_id: a.id,
                            id: collected?.id,
                        })
                    }} />, false, '#3455')
                }}>{_L('choise_pet')} <span className={isEdit ? '' : 'add'}></span></div>
                {
                    collected.name ? <div onClick={()=>qs({animal_id:code?.animal_id}).setAbsPath(['animal'])}>
                        {
                            <AnimalInfo animal={collected as AnimalInterface} />
                        }
                    </div> : ''
                }
                {
                    isNew && collected.name && <label className='new-code-url' htmlFor="new-code-url">
                        <div className="label">{_L('code_id')}</div>
                        <div className="_flex">
                            <input id='new-code-url' type="text" value={collected.code_url || ''} placeholder='Code Id' onChange={(e) => setCollected({ ...collected, code_url: e.currentTarget.value })} />
                            <div className="icon"></div>
                        </div>
                    </label>
                }
                {
                    collected.code_url && <>
                        <div className="code">
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={`${Host||location.host}/s_c/${collected?.code_url || ''}`}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                        <div className="code-url">{collected.code_url}</div>
                    </>
                }
                {
                    isEdit && <>
                        <div className="code-date">{collected?.created_at && (new Date(collected.created_at).toDateString() + ', ' + new Date(collected.created_at).toLocaleTimeString())}</div>

                    </>
                }
                {
                    isEdit && <div className="remove-code" onClick={() => {
                        const id = collected.id;
                        id && removeCode(id).then(()=>{
                            user && NotifContext.remove({
                                user: user,
                                context_id: id,
                                context_name: 'subjects'
                            })
                        });
                        navBack();
                    }}>
                        <span></span>{_L('remove')}
                    </div>
                }
                {
                    isNew && collected.animal_id && collected.code_url && <div className={"create-code " + (loading?'loading':'')} onClick={() => {
                        if(loading) return;
                        setLoading(true)
                        createCode(collected).then((res)=>{
                            setLoading(false);
                            if(!res?.id) {
                                openChild(<ConfirmPopup 
                                    title='Creation Error' 
                                    message='Try another code'
                                    onCancel={()=>{
                                        openChild(undefined);
                                        setCollected({
                                            ...collected,
                                            code_url:''
                                        })
                                    }}
                                />,undefined, '#3455');
                                
                                return 
                            }
                            NotifContext.required().then(() => {
                                if (user) {
                                    NotifContext.sendData(user);
                                    NotifContext.add({
                                        user: user,
                                        context_id: res.id,
                                        context_name: 'codes'
                                    });
                                }
                            });
                            navBack();
                        });
                    }}>
                        <span></span>{_L('create')}
                    </div>
                }
            </div>
            <span>{_L('code_page_bottom_prompt')}</span>
        </div>
    )
}

function ChoiseAnimal({ setAnimal }: { setAnimal: (animal: AnimalInterface) => void }) {

    const { fetchAnimals, animals } = useAnimalStore()
    const { openChild } = useAppStore();
    const { qs } = useAppRouter()
    useEffect(() => {
        fetchAnimals()
    }, [])

    return (
        <div className="choise-animal" onClick={() => {
            openChild(undefined);
        }}>
            <div className="list">
                <div className="add-pet" onClick={ ()=>qs().setAbsPath(['new_animal']) }>{_L('add_pet')} <span></span></div>
                {
                    animals?.list.map(a => (
                        <AnimalInfo key={a.id} animal={a} onClick={() => {
                            setAnimal(a);
                        }} />
                    ))
                }
            </div>
        </div>
    )
}

function AnimalInfo({ animal, onClick }: { animal: AnimalInterface, onClick?: () => void }) {

    return <div className="animal-info " onClick={onClick}>
        <div className="image" style={{ background: getImg(animal?.images?.[0]) }}></div>
        <div className="right ">
            <h2 className="name" >{animal?.name}</h2>
            <div>{animal?.species}, {animal?.breed}, {animal?.color}</div>
        </div>
    </div>
}