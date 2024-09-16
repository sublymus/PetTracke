import { create } from "zustand";
import { Host } from "../../Config";
import { ListType, UserDetail } from "../../Database";
import { useUserStore } from "../Profile/UserStore";

interface AdminState {
    users:ListType<UserDetail>|undefined,
    get_users(data:{
        page?:number, 
        limit?:number, 
        full_name?:string, 
        email?:string, 
        phone?:string, 
        user_id?:string, 
        order_by?:string, 
        text?:string,
        no_save?:boolean,
        count_pet?:boolean, 
        count_code?:boolean,
        add_pet?:boolean, 
        add_code?:boolean, 
        add_rating?:boolean
    }):Promise<ListType<UserDetail>|undefined>
}
export const useAdminStore = create<AdminState>((set) => ({
    users:undefined,
    async get_users(filter){
        const h = useUserStore.getState().getHeaders()
        if (!h) return;
        const searchParams = new URLSearchParams({});
        for (const key in filter) {
            const value = filter[key as keyof typeof filter];
            (value != undefined) && searchParams.set(key, value as any);
        }
        const response = await fetch(`${Host}/get_users/?${searchParams.toString()}`, {
            headers: h.headers
        });
        const users = (await response.json()) as ListType<UserDetail>
        if (!users?.list) return
        if (!filter?.no_save) {
            set(() => ({ users }))
        }
        return users
    }
}))