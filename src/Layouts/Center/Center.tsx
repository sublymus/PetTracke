import { useEffect } from 'react';
import { useScaneStore } from '../Scane/ScaneStore'
import './Center.css'
import { useUserStore } from '../Profile/UserStore';
import { getImg } from '../../Tools/StringFormater';
import { useCodeStore } from '../Code/CodeStore';
import { useAnimalStore } from "../Animal/AnimalStore";
import { useAppRouter } from '../../AppStore';
import { CodeItem } from '../../Components/CodeItem/CodeItem';
import { ScaneItem } from '../../Components/ScaneItem/ScaneItem';
import { _L } from '../../Tools/_L';

export function Center() {
    const { pathList,current, qs } = useAppRouter();
    const { user } = useUserStore();
    const { codes, fetchCodes } = useCodeStore();
    const { scanes } = useScaneStore();
    const { fetchScanes } = useScaneStore()
    const { animals, fetchAnimals } = useAnimalStore()
    const isHome = (current('list') || current('/')) ;
    useEffect(() => {
        if(!isHome) return
        if (user) {
            fetchCodes();
            fetchScanes({});
            fetchAnimals();
        }
    }, [user, pathList]);

    return isHome && <div className="center">
        <div className="list-codes">
            <h1 className='center-top-bar' >
                <div className="account-options" onClick={() => { window.innerWidth < 850 && qs({ profile: 'open' }).apply() }}></div>
                <span className='account-icon' style={{ background: getImg(user?.photos[0]) }} onClick={() => { window.innerWidth < 850 && qs({ profile: 'open' }).apply() }}>
                </span>
                {_L('app_name')}
            </h1>
            <h2>{_L('codes_list')} <div className="add" onClick={() => qs().setAbsPath(['new_code'])}><span></span>{_L('add_new')}</div></h2>
            <div className="list">
                {
                    !codes?.list[0] && <div className="not-code">{_L('not_code_yet')}</div>
                }

                {
                    codes?.list.map((c => (
                        <CodeItem key={c.id} code={c} onClick={() => qs({ code_id: c.id }).setAbsPath(['code'])} />
                    )))
                }
            </div>
            <h2>{_L('scane_list')}</h2>
            <div className="list">
                {
                    !scanes?.list[0] && <div className="not-scane">{_L('not_scane_yet')}</div>
                }
                {
                    scanes?.list.map(s => <ScaneItem key={s.id} scane={s} />)
                }
            </div>
            <h2>{_L('pets_list')}  <div className="add" onClick={() => qs().setAbsPath(['new_animal'])}><span></span>{_L('add_new')}</div></h2>

            <div className="list list-animal">
                {
                    !animals?.list[0] && <div className="not-animal">{_L('not_pets_yet')}</div>
                }
                {
                    animals?.list.map((a => (
                        <div key={a.id} className="animal" onClick={() => user && qs({animal:a, owner:user} ).setAbsPath(['pet_profile'])}>
                            <div className="image" style={{ background: a.images[0] && getImg(a.images[0]) }}></div>
                            <div className="right ">
                                <h3 className="name _limit-text">{a.name}</h3>
                                <div className="i-2 _limit-text">{a.species}{a.breed &&(((a.species||'') && ', ') + a.breed)}{a.age && (((a.species|| a.breed ||'') &&', ') + a.age +' '+ _L('years'))} </div>
                                <div className="color _limit-text">{a.sex} {a.color && ( ((a.sex||'') &&', ') + a.color )}</div>
                            </div>
                        </div>
                    )))
                }
            </div>
        </div>
    </div>
}