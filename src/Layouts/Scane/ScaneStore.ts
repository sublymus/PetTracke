import { create } from "zustand";
import { Host } from "../../Config";
import { ScaneInterface, ListType } from "../../Database";
import { useUserStore } from "../Profile/UserStore";

interface ScaneState {
    scanes: ListType<ScaneInterface> | undefined,
    scane: ScaneInterface | undefined
    fetchScanes(filter?: {
        page?: number,
        limit?: number,
        order_by?: string,
        user_id?: string,
        scane_id?: string,
        code_url?: string,
        code_id?: string,
        animal_id?: string,
        no_save?: boolean,
    }): Promise<ListType<ScaneInterface> | undefined>
    setScaneById(scane_id: string): Promise<ScaneInterface | undefined>;
    updateScane(scane: Partial<ScaneInterface> & { id: string }): Promise<ScaneInterface | undefined>
}
export const useScaneStore = create<ScaneState>((set, get) => ({
    scane: undefined,
    scanes: undefined,
    async setScaneById(scane_id) {
        const s = get().scanes?.list.find(a => a.id == scane_id);
        if (s) {
            set(() => ({ scane: s }));
        } else {
            console.log('EEEEEEEEEEEEEEEEEEEEEEEEEE');
            
            try {
                const response = await fetch(`${Host}/get_scanes/?scane_id=${scane_id}`);
                const fs = await response.json()
                set(() => ({ scane: fs?.list[0] }))
                console.log({ fs: fs?.list[0] });

            } catch (error) { }
        }
        return undefined
    },
    async fetchScanes(filter) {
        const h = useUserStore.getState().getHeaders()
        if (!h) return;
        const searchParams = new URLSearchParams({});
        for (const key in filter) {
            const value = filter[key as keyof typeof filter];
            (value != undefined) && searchParams.set(key, value as any);
        }
        const response = await fetch(`${Host}/get_scanes/?${searchParams.toString()}`, {
            headers: h.headers
        });
        const scanes = (await response.json()) as ListType<ScaneInterface>
        if (!scanes?.list) return
        if (!filter?.no_save) {
            set(() => ({ scanes }))
        }
        console.log(scanes);

        return scanes
    },
    async updateScane(scane) {
        console.log('update==>', scane);

        const h = useUserStore.getState().getHeaders();
        if (!h) return
        const fromData = new FormData();
        fromData.append('scane_id', scane.id)

        scane.address &&
            fromData.append('address', JSON.stringify(scane.address));
        scane.phone &&
            fromData.append('phone', scane.phone);
        scane.is_real_address &&
            fromData.append('is_real_address', scane.is_real_address ? 'true' : 'false');
        scane.message &&
            fromData.append('message', scane.message);
        scane.name &&
            fromData.append('name', scane.name);
        scane.opened!=undefined &&
            fromData.append('opened', scane.opened?'true':'false');

        const response = await fetch(`${Host}/update_scane`, {
            method: 'PUT',
            body: fromData,
            headers: h.headers,
        });

        const _scane = await response.json();
        console.log({ _scane });

        if (!_scane?.id) return
        set(({scanes}) => ({
            scanes:scanes && {...scanes, list:scanes.list.map(s=>s.id == _scane.id?{...s,..._scane}:s)},
            scane: _scane,
        }));
        console.log({_scane});
        
        return _scane
    }
}))