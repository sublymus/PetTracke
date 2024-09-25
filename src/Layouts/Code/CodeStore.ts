import { create } from "zustand";
import { Host } from "../../Config";
import { CodeInterface, ListType } from "../../Database";
import { useUserStore } from "../Profile/UserStore";

interface CodeState {
    codes: ListType<CodeInterface> | undefined,
    code: CodeInterface | undefined
    fetchCodes(filter?: {
        user_id?:string,
        code_url?:string,
        code_id?:string,
        animal_id?:string,
        no_save?:boolean,
    }): Promise<ListType<CodeInterface> | undefined>
    setCodeById(json?: Record<string, any>): Promise<void>,
    updateCode(code: Partial<CodeInterface>): Promise<CodeInterface|undefined>,
    createCode(code:Partial<CodeInterface>):Promise<CodeInterface|undefined>,
    removeCode(code_id:string):Promise<{isDeleted:boolean}|undefined>
}
export const useCodeStore = create<CodeState>((set,get) => ({
    code:undefined,
    codes:undefined,
    async createCode(code) {
        const h = useUserStore.getState().getHeaders();

        if (!h) return
        if(!code.code_url) return;
        if(!code.animal_id) return;
        
        console.log(code, h);
        const formData = new FormData();
       
        formData.append('animal_id',code.animal_id);
        formData.append('code_url',code.code_url);

               const response = await fetch(`${Host}/create_code`, {
            method: 'POST',
            body: formData,
            headers: h.headers,
        });

        const _code = await response.json();
        
        if (!_code?.id) return
        set(({codes}) => ({
            code: _code,
            codes:codes && {...codes,list:[_code,...codes.list]}
        }));
        return _code
    },
    async removeCode(code_id) {
        const h = useUserStore.getState().getHeaders();
        if (!h) return
        const response = await fetch(`${Host}/delete_code/${code_id}`, {
            method: 'DELETE',
            headers: h.headers
        });
        const json = await response.json();
        if(json?.isDeleted){
            set(({codes})=>({codes:codes && {...codes, list:codes.list.filter(p=>p.id != code_id)}}))
        }
        return json?.isDeleted;
    },
    async updateCode(code) {
        const h = useUserStore.getState().getHeaders();

        console.log({code});
        
        if (!h) return
        if(!code.id) return;
        if(!code.animal_id) return;
        
        const formData = new FormData();

        formData.append('animal_id',code.animal_id);
        formData.append('code_id',code.id);

        const response = await fetch(`${Host}/update_code`, {
            method: 'PUT',
            body: formData,
            headers: h.headers,
        });

        const _code = await response.json();
        

        if (!_code?.id) return
        set(({codes}) => ({
            code: _code,
            codes:codes && {...codes,list:codes.list.map(c=>c.id == code.id ? _code : c)}
        }));
        return _code
    },
    async setCodeById(json) {
        if (!json?.code_id) return;
        let code = get().codes?.list.find(a => a.id == json.code_id);
        if (code) {
            set(() => ({ code }));
        } else {
            code = (await get().fetchCodes({
                code_id: json.code_id
            }))?.list[0];
            set(() => ({ code }));
        }
    },
    async fetchCodes(filter) {
        const h = useUserStore.getState().getHeaders()
        if(!h) return;
        const searchParams = new URLSearchParams({});
        for (const key in filter) {
            const value = filter[key as keyof typeof filter];
            (value != undefined) && searchParams.set(key, value as any);
        }
        const response = await fetch(`${Host}/get_codes/?${searchParams.toString()}`, {
            headers: h.headers
        });
        const codes = (await response.json()) as ListType<CodeInterface>
        if (!codes?.list) return
        if (!filter?.no_save) {
            set(() => ({ codes }))
        }
       
        return codes
    },
}))