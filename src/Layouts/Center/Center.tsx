import { useEffect } from 'react';
import { useScaneStore } from '../Scane/ScaneStore'
import './Center.css'
import { useUserStore } from '../Profile/UserStore';
import { getImg } from '../../Tools/StringFormater';
import { useCodeStore } from '../Code/CodeStore';
import { useAnimalStore } from "../Animal/AnimalStore";
import { useAppRouter} from '../../AppStore';
import { CodeItem } from '../../Components/CodeItem/CodeItem';
import { ScaneItem } from '../../Components/ScaneItem/ScaneItem';
import { _L } from '../../Tools/_L';

export function Center() {
    const { current, qs } = useAppRouter();
    const { user } = useUserStore();
    const { codes, fetchCodes } = useCodeStore();
    const { scanes } = useScaneStore();
    const { fetchScanes } = useScaneStore()
    const { animals, fetchAnimals } = useAnimalStore()

    useEffect(() => {
        if (user) {
            fetchCodes();
            fetchScanes({});
            fetchAnimals();
        }
    }, [user]);

    return (current('list') || current('/')) && <div className="center">
        <div className="list-codes">
            <h1 className='center-top-bar' >
                <div className="account-options" onClick={() => {window.innerWidth<850 && qs({ profile: 'open' }).apply() }}></div>
                <span className='account-icon' style={{ background: getImg(user?.photos[0]) }} onClick={() => {  window.innerWidth<850 && qs({ profile: 'open' }).apply() }}>
                </span>
                {_L('app_name')}
            </h1>
            <h2>{_L('codes_list')} <div className="add" onClick={() => qs().setAbsPath(['new_code'])}><span></span>{_L('add_new')}</div></h2>
            <div className="list">
                {/* <div className="new" onClick={() => qs().setAbsPath(['new_code'])}><span></span></div> */}
                {
                    !codes?.list[0] && <div className="not-code">no pets yet</div>
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
                    !scanes?.list[0] && <div className="not-scane">no scans yet</div>
                }
                {
                    scanes?.list.map(s => <ScaneItem key={s.id} scane={s} />)
                }
                {/* {
                    <pre>
                        {
                            JSON.stringify(scanes, undefined, 4)
                        }
                    </pre>
                } */}
            </div>
            <h2>{_L('pets_list')}  <div className="add" onClick={() => qs().setAbsPath(['new_animal'])}><span></span>{_L('add_new')}</div></h2>

            <div className="list-column">
                {
                    !animals?.list[0] && <div className="not-animal">no pets yet</div>
                }
                {
                    animals?.list.map((a => (
                        <div key={a.id} className="animal" onClick={() => qs({ animal_id: a.id }).setAbsPath(['animal'])}>
                            <div className="image" style={{ background: a.images[0] && getImg(a.images[0]) }}></div>
                            <div className="right">
                                <div className="text">
                                    <h3 className="name">{a.name}</h3>
                                    <div className="i-2">{a.species},{a.breed}, {a.age} years</div>
                                    <div className="color">{a.color} {a.sex}</div>
                                </div>
                                <div className="animal-scane">
                                    <div className="toalt-code">{a._count_code || 3} codes</div>
                                    <div className="last-scane">
                                        <div className="date">{a._last_scane || 'not yet scanned'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )))
                }
            </div>
        </div>
    </div>
}