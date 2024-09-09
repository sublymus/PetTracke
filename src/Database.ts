
export type ListType<T = any> = {
    page: number,
    limit: number,
    total: number,
    list: T[],
}

export interface RatingInterface{
    id:string,
    user_id:string,
    star:number,
    message:string,
    env?:string;
}

export interface FromApiLocation{
    status: string,
    country: string,
    countryCode: string,
    region: string,
    regionName: string,
    city: string,
    zip: string,
    lat:number,
    lon: number,
    timezone: string,
    isp: string,
    org: string,
    as: string,
    query: string,
}

export interface AddressResultInterface {

    place_id: number,
    licence: string,
    osm_type: string,
    osm_id: number,
    lat: string,
    lon: string,
    class: string,
    type: string,
    place_rank: number,
    importance: number,
    addresstype: string,
    name: string,
    display_name: string,
    address: {
        house_number: string,
        road: string,
        hamlet: string,
        town: string,
        city: string,
        "ISO31662-lvl8": string,
        state_district: string,
        state: string,
        "ISO31662-lvl4": string,
        postcode: string,
        country: string,
        country_code: string,
    },
    boundingbox: string[] // json.stringify(number[])
}
export interface AddressInterface {
    id: string,
    context?: string,
    address: string,
    latitude: string,
    longitude: string
}
export interface PhoneInterface {
    id: string,
    countryCode: string,// "ru",
    dialCode: string,// "7",
    format: string,// "+. (...) ...-..-.."
    name: string,// "Russia"
    phone: string
    context?: string
}

export interface ScaneInterface {
    id: string,
    code_url: string
    images: string[],
    is_real_address?: boolean,
    phone?: string
    name?: string
    message?: string
    created_at: string,
    opened?:boolean,
    address?: AddressInterface,
    animal?:AnimalInterface
}

export interface UserInterface {
    id: string,
    full_name: string,
    email: string,
    photos: string[],
    status?: string,
    phone?: PhoneInterface,
    address?: AddressInterface,
    token?: string,
    newAddress: string
    created_at: string,
}

export interface AnimalInterface {
    id: string,
    name: string,
    user_id: string,
    images: string[],
    sex?: string,
    color?: string,
    age?: string,
    breed?: string,
    species?: string,
    about?: string,
    medication?: string,
    vaccines?: string,
    allergies?: string,
    conditions?: string,
    user?: UserInterface,
    veto_name:string,
    veto_phone:string,
    veto_address:string,
    veto_clinic:string
    created_at: string,
    _count_code?: number,
    _last_scane?: string,
}


export interface CodeInterface extends UserInterface, AnimalInterface {
    id: string,
    code_url: string,
    user_id: string,
    animal_id: string,
    created_at: string,
}