import { useEffect, useState } from 'react';
import { useAppRouter, useAppStore } from '../../AppStore'
import { useAnimalStore } from './AnimalStore'
import './AnimalPage.css'
import { getImg } from '../../Tools/StringFormater';
import { AnimalInterface } from '../../Database';
import { _L } from '../../Tools/_L';
import { ConfirmPopup } from '../../Components/ConfirmPopup/ConfirmPopup';

export function AnimalPage() {

    const { current, json, navBack, pathList } = useAppRouter();
    const { animal, setAnimalById, updateAnimal, createAnimal, removeAnimal } = useAnimalStore();
    const { openChild } = useAppStore()
    const [collected, setCollected] = useState<Partial<AnimalInterface>>({});
    const isNew = current('new_animal');
    const isEdit = current('animal');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setAnimalById(json)
    }, [json]);

    useEffect(() => {
        if (isEdit) {
            setCollected({
                ...animal
            })
        } else {
            setCollected({ sex: 'mal' })
        }
    }, [animal, pathList])
   
    console.log(animal?.sex);

    return (isEdit || isNew) && (
        <div className='animal-page'>
            <div className="top">
                <div className="return" onClick={() => navBack()}></div>
                <h3 className="title">{_L('animal_page_title')}</h3>
            </div>
            <div className="infos">
                <h1>{collected?.name}</h1>
                <div className="image" style={{ background: (collected?.images?.[0] as any) instanceof Blob ? collected?.images?.[0] && getImg(URL.createObjectURL(collected.images[0] as any)) : getImg(collected?.images?.[0]) }}>
                    {
                        isNew ? <label htmlFor="animal-image">{
                            !collected.images && <>
                                <span></span> Add Images
                            </>
                        }</label>
                            : <label htmlFor='animal-image' className="edit"></label>
                    }
                    <input id='animal-image' style={{ display: 'none' }} type="file" onChange={(e) => {
                        const u = { ...collected, images: e.currentTarget.files || collected.images } as any;
                        console.log(u);

                        setCollected(u);
                        isEdit && updateAnimal(u);
                    }
                    } />
                </div>

                <h2>{_L('basic_info')}</h2>
                <label htmlFor="animal-input-name">
                    <div className="label">{_L('name')} <span style={{ color: '#f00' }}>*</span></div>
                    <div className="_flex">
                        <input id='animal-input-name' value={collected.name} placeholder='Name' type="text"
                            onChange={e => setCollected({ ...collected, name: e.currentTarget.value })}
                            onKeyUp={e => {
                                if (e.code == 'Enter') {
                                    e.currentTarget.blur();
                                }
                            }}
                            onBlur={() => {
                                isEdit && updateAnimal(collected);
                            }}
                        />
                        <div className="icon"></div>
                    </div>
                </label>
                <label htmlFor="animal-input-species">
                    <div className="label">{_L('species')}</div>
                    <div className="_flex">
                        <input id='animal-input-species' value={collected.species} placeholder='Species' type="text"
                            onChange={e => setCollected({ ...collected, species: e.currentTarget.value })}
                            onKeyUp={e => {
                                if (e.code == 'Enter') {
                                    e.currentTarget.blur();
                                }
                            }}
                            onBlur={() => {
                                isEdit && updateAnimal(collected);
                            }}
                        />
                        <div className="icon"></div>
                    </div>
                </label>
                <label htmlFor="animal-input-breed">
                    <div className="label">{_L('breed')}</div>
                    <div className="_flex">
                        <input id='animal-input-breed' value={collected.breed} placeholder='Breed' type="text"
                            onChange={e => setCollected({ ...collected, breed: e.currentTarget.value })}
                            onKeyUp={e => {
                                if (e.code == 'Enter') {
                                    e.currentTarget.blur();
                                }
                            }}
                            onBlur={() => {
                                isEdit && updateAnimal(collected);
                            }}
                        />
                        <div className="icon"></div>
                    </div>
                </label>
                <label htmlFor="animal-input-color">
                    <div className="label">{_L('color')}</div>
                    <div className="_flex">
                        <input id='animal-input-color' value={collected.color} placeholder='Color' type="text"
                            onChange={e => setCollected({ ...collected, color: e.currentTarget.value })}
                            onKeyUp={e => {
                                if (e.code == 'Enter') {
                                    e.currentTarget.blur();
                                }
                            }}
                            onBlur={() => {
                                isEdit && updateAnimal(collected);
                            }}
                        />
                        <div className="icon"></div>
                    </div>
                </label>
                <label htmlFor="animal-input-age">
                    <div className="label">{_L('age')}</div>
                    <div className="_flex">
                        <input id='animal-input-age' value={collected.age} placeholder='Age' type="text"
                            onChange={e => setCollected({ ...collected, age: e.currentTarget.value })}
                            onKeyUp={e => {
                                if (e.code == 'Enter') {
                                    e.currentTarget.blur();
                                }
                            }}
                            onBlur={() => {
                                isEdit && updateAnimal(collected);
                            }}
                        />
                        <div className="icon"></div>
                    </div>
                </label>
                <label>
                    <div className="label">{_L('sex')}</div>
                    <div className="_flex">
                        <div className="chex-box">
                            <div className={"mal " + (collected.sex?.toLocaleLowerCase() == 'mal' ? 'active' : '')} onClick={() => {
                                const c = { ...collected, sex: 'mal' }
                                setCollected(c);
                                isEdit && updateAnimal(c);
                            }}>{_L('mal')}</div>
                            <div className={"fem " + (collected.sex?.toLocaleLowerCase() == 'female' ? 'active' : '')} onClick={() => {
                                const c = { ...collected, sex: 'female' }
                                setCollected(c);
                                isEdit && updateAnimal(c);
                            }}>{_L('femal')}</div>
                        </div>
                    </div>
                </label>
                <h2>{_L('medical_info')}</h2>
                <label htmlFor="animal-input-medication">
                    <div className="label">{_L('medications')}</div>
                    <div className="_flex">
                        <input id='animal-input-medication' value={collected.medication} placeholder='Medications' type="text"
                            onChange={e => setCollected({ ...collected, medication: e.currentTarget.value })}
                            onKeyUp={e => {
                                if (e.code == 'Enter') {
                                    e.currentTarget.blur();
                                }
                            }}
                            onBlur={() => {
                                isEdit && updateAnimal(collected);
                            }}
                        />
                        <div className="icon"></div>
                    </div>
                </label>
                <label htmlFor="animal-input-vaccines">
                    <div className="label">{_L('vaccines')}</div>
                    <div className="_flex">
                        <input id='animal-input-vaccines' value={collected.vaccines} placeholder='Vaccines' type="text"
                            onChange={e => setCollected({ ...collected, vaccines: e.currentTarget.value })}
                            onKeyUp={e => {
                                if (e.code == 'Enter') {
                                    e.currentTarget.blur();
                                }
                            }}
                            onBlur={() => {
                                isEdit && updateAnimal(collected);
                            }}
                        />
                        <div className="icon"></div>
                    </div>
                </label>
                <label htmlFor="animal-input-allergies">
                    <div className="label">{_L('allergies')}</div>
                    <div className="_flex">
                        <input id='animal-input-allergies' value={collected.allergies} placeholder='Allergies' type="text"
                            onChange={e => setCollected({ ...collected, allergies: e.currentTarget.value })}
                            onKeyUp={e => {
                                if (e.code == 'Enter') {
                                    e.currentTarget.blur();
                                }
                            }}
                            onBlur={() => {
                                isEdit && updateAnimal(collected);
                            }}
                        />
                        <div className="icon"></div>
                    </div>
                </label>

                <label htmlFor="animal-input-about">
                    <div className="label">{_L('about_pet')}</div>
                    <div className="_flex">
                        <textarea spellCheck={false} id='animal-input-about' value={collected.about} placeholder={'...'}
                            onChange={e => setCollected({ ...collected, about: e.currentTarget.value })}
                            onBlur={() => {
                                isEdit && updateAnimal(collected);
                            }}
                        />
                        <div className="icon"></div>
                    </div>
                </label>

                <h2>{_L('veto_info')}</h2>

                <label htmlFor="animal-input-veto-name">
                    <div className="label">{_L('animal_veto_name')}</div>
                    <div className="_flex">
                        <input id='animal-input-veto-name' value={collected.veto_name} placeholder={'...'} type="text"
                            onChange={e => setCollected({ ...collected, veto_name: e.currentTarget.value })}
                            onKeyUp={e => {
                                if (e.code == 'Enter') {
                                    e.currentTarget.blur();
                                }
                            }}
                            onBlur={() => {
                                isEdit && updateAnimal(collected);
                            }}
                        />
                        <div className="icon"></div>
                    </div>
                </label>

                <label htmlFor="animal-input-veto-phone">
                    <div className="label">{_L('animal_veto_phone')}</div>
                    <div className="_flex">
                        <input id='animal-input-veto-phone' value={collected.veto_phone} placeholder={'...'} type="text"
                            onChange={e => setCollected({ ...collected, veto_phone: e.currentTarget.value })}
                            onKeyUp={e => {
                                if (e.code == 'Enter') {
                                    e.currentTarget.blur();
                                }
                            }}
                            onBlur={() => {
                                isEdit && updateAnimal(collected);
                            }}
                        />
                        <div className="icon"></div>
                    </div>
                </label>

                <label htmlFor="animal-input-veto-clinic">
                    <div className="label">{_L('animal_veto_clinic')}</div>
                    <div className="_flex">
                        <input id='animal-input-veto-clinic' value={collected.veto_clinic} placeholder={'...'} type="text"
                            onChange={e => setCollected({ ...collected, veto_clinic: e.currentTarget.value })}
                            onKeyUp={e => {
                                if (e.code == 'Enter') {
                                    e.currentTarget.blur();
                                }
                            }}
                            onBlur={() => {
                                isEdit && updateAnimal(collected);
                            }}
                        />
                        <div className="icon"></div>
                    </div>
                </label>

                <div className="btns">
                    <div className="cancel" onClick={() => navBack()}><span></span> {_L('cancel')}</div>
                    {
                        loading ?
                            <div className="loading"><span></span></div>
                            :
                            <div className={"btn " + (isNew ? 'is-new' : 'is-edit') + (collected.name && collected.images?.[0] ? ' ok ' : '')} onClick={() => {

                                if (loading) return


                                if (isEdit && animal) {
                                    openChild(<ConfirmPopup confirmText={_L('delete')} type='confirm' title='Are you to detelet pet profile ?' onCancel={() => {
                                        openChild(undefined);
                                    }}
                                        onConfirm={() => {
                                            setLoading(true);
                                            removeAnimal(animal.id).then(_res => {
                                                setLoading(false)
                                                navBack();
                                            })
                                        }} />, undefined, '#3455')
                                } else if (isNew) {
                                    if (collected.name && collected.images?.[0]) {
                                        setLoading(true);
                                        createAnimal(collected).then(_res => {
                                            setLoading(false)
                                            navBack();
                                        });
                                    } else {
                                        setLoading(false)
                                    }
                                }
                            }}><span></span>
                                {
                                    isNew ? _L('create') : _L('remove')
                                }
                            </div>
                    }
                </div>
            </div>
           
        </div>
    )
}