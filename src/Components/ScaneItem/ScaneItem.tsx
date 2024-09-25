import { useAppRouter } from '../../AppStore';
import { AnimalInterface, ScaneInterface, UserInterface } from '../../Database';
import { useUserStore } from '../../Layouts/Profile/UserStore';
import { useScaneStore } from '../../Layouts/Scane/ScaneStore';
import { getImg } from '../../Tools/StringFormater';
import { _L } from '../../Tools/_L';
import './ScaneItem.css'


export function ScaneItem({ scane }: { scane: ScaneInterface }) {

    const  { qs } = useAppRouter();
    const {user} = useUserStore();
    const {updateScane} = useScaneStore()
    
    return <div className="scane-item" onClick={()=>{
        
        if(scane.animal && user) {
           !scane.opened && updateScane({
                id:scane.id,
                opened:true,
            })
            qs({animal:scane.animal, owner:user, scane} satisfies { owner: UserInterface, animal: AnimalInterface, scane: ScaneInterface }).setAbsPath(['owner_open_scane']);
        }
    }}>
        <div className="scane-top">
            {
            !scane.opened && <div className="is-new">new</div>
            }
            <div className="image" style={{ background: getImg(scane.animal?.images[0]) }}></div>
            <div className="found _limit-text">{scane.animal?.name}</div>
        </div>
        <div className="address ">
            <span></span><div>{scane.address?.address||_L('address_missing')}</div>
        </div>
        <div className="date"><span></span>{new Date(scane.created_at).toDateString()}</div>
        <div className="time"><span></span>{new Date(scane.created_at).toLocaleTimeString()}</div>
    </div>
}