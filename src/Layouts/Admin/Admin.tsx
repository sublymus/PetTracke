import { useEffect } from 'react'
import './Admin.css'
import { useAdminStore } from './AdminStore'
import { type UserDetail } from '../../Database';
import { PhoneFormater, getImg, limit } from '../../Tools/StringFormater';

export function Admin() {

    const { get_users, users } = useAdminStore()

    useEffect(() => {
        get_users({ add_code: true, add_pet: true, add_rating: true });
    }, []);

    return <div className="admin-page">
        <div className="ctn">
            <h1>User List</h1>
            <div className="list">
                {
                    users?.list.map((u) => (
                        <UserDetail user={u} />
                    ))
                }
            </div>
        </div>

    </div>
}


function UserDetail({ user }: { user: UserDetail }) {


    return <div className="user-detail">
        <div className="photo" style={{ background: getImg(user.photos[0]) }}></div>
        <div className="activity">
            <div>Pets : {user.animals?.list.length || 0}</div>
            <div>codes : {user.codes?.list.length || 0}</div>
            <div>rating : {user.rating?.star || 'null'}</div>
        </div>
        <div className="user ">
            <h2>{user.full_name}</h2>
            <p>{(user.phone?.phone && PhoneFormater(user.phone)) || 'No phone'}</p>
            <p className='address'>{limit(user.address?.address, 75 )|| 'No address'}</p>
        </div>
    </div>
}
