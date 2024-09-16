import { SRouter } from "./Tools/SRouter";
export const DefaultImage = '/src/res/photo2.png';


const Pages = {
    '/': {
        list:{},
        animal:{},
        new_animal:{},
        scanes:{},
        code:{},
        new_code:{},
        scane_info:{},
        owner_open_scane:{},
        setting:{},
        about:{},
        choise_address:{},
        pricing:{},
        admin:{},
        pet_profile:{},
        qr_scaner:{}
    }
}

import { create } from "zustand";
import { _L } from "./Tools/_L";
interface AppState {
    lang:typeof _L.lang,
    back_color: string;
    blur: boolean,
    T: string | undefined | null,
    openNav: 'max' | 'min',
    setOpenNav(nav: 'max' | 'min'): void
    setLang(lang: typeof _L.lang): void
    setT(T: string | undefined): void,
    currentChild: JSX.Element | undefined,
    openChild: (child: JSX.Element | undefined, blur?: boolean, back_color?: string) => any,
}

export const useAppStore = create<AppState>((set) => ({
    T: localStorage.getItem('theme'),
    storeVar: undefined,
    usersVar: undefined,
    lang:_L.lang,
    back_color: '',
    blur: false,
    openNav: 'max',
    setLang(lang){
        _L.setLang(lang)
        set(()=>({lang}))
    },
    setOpenNav(nav) {
        set(() => ({ openNav: nav }))
    },
    setT(T) {
        T && localStorage.setItem('theme', T);
        set(() => ({ T }))
    },
    currentChild: undefined,
    openChild(child, blur, back_color) {
        set(() => ({ currentChild: child, blur, back_color: child ? (back_color || '') : '' }))
    },
}));

export const useAppRouter = new SRouter(Pages, ['/', 'list']).getStore()