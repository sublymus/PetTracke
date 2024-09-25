import { Host } from "../Config";
import { PhoneInterface } from "../Database";

export const toDate = (date: string) => {
    let a: any = new Date(date).toLocaleTimeString();
    a = a.split(':');
    return `${a[0]}:${a[1]}`
}
export const limit = (text: string = '', max: number = 20) => {
    return text?.length > max ? text.substring(0, max) + '..' : (text || '')
}
export const getImg = (img?: string, size = 'cover', addHost?: boolean, option?: {
    addMore?: string
}) => {
    if (!img) return ''
    return (`no-repeat center/${size} url(${addHost === true ? Host : addHost === false ? '' : (img.startsWith('/') ? Host : '')}${img})`) + (option?.addMore ? ', ' + option.addMore : '')
}

export const Click = (n = 0.5) => {
    return (e: any) => {
        const div = e.currentTarget;
        div.style.opacity = String(n);
        setTimeout(() => {
            div.style.opacity = '';
        }, 100);
    }
}

const caches: any = {

}

export function LabelToColor(label: string) {
    if (caches[label]) return caches[label]
    const color = (
        ((label.charCodeAt(0) || 0) % 32) +
        ((label.charCodeAt(1) || 0) % 32) +
        ((label.charCodeAt(2) || 0) % 32)
    ) / (32 * 3);
    return caches[label] = `hsl(${255 * color}, 100%, 71%)`;
}


export function PhoneFormater(phone: PhoneInterface) {
    const f = phone.format || '';
    const n = phone.phone || '';
    let cn = 0;
    let p = ''
    for (let i = 0; i < f.length; i++) {
        const c = f[i];
        p += c == '.' ? n[cn++] : c
    }
    phone && ((phone as any).p = p);
    return p
}