import lang from "../language.json";

const language = ['en','ru','fr'] as const;
type listLang = typeof language[number]
const l = (text:keyof typeof lang, _language?:listLang)=>{
    const res = (lang[text]as any)[_language||_L.lang];
    return  res ?  res : (lang[text]as any)[_L.lang];
} 
type _L_TYPE = typeof l & {
    getLang():listLang
    setLang(lang:listLang):void
    lang:listLang
}

export const _L : _L_TYPE = l  as _L_TYPE
_L.lang = localStorage.getItem('setting.lang') as (listLang|undefined)||'en';
_L.setLang = (lang)=>{
    _L.lang = lang
    localStorage.setItem('setting.lang', lang)
}
_L.getLang = ()=>{
    return   _L.lang
}