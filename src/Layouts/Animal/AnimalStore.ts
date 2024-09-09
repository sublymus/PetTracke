import { create } from "zustand";
import { Host } from "../../Config";
import { AnimalInterface, ListType } from "../../Database";
import { useUserStore } from "../Profile/UserStore";

interface AnimalState {
    animals: ListType<AnimalInterface> | undefined,
    animal: AnimalInterface | undefined
    fetchAnimals(filter?: {
        page?: number,
        limit?: number,
        order_by?: string,
        about?: string,
        medication?: string,
        vaccines?: string,
        type?: string,
        color?: string,
        sex?: string,
        name?: string,
        animal_id?: string,
        user_id?: string,
        all?: string,
        no_save?: boolean
    }): Promise<ListType<AnimalInterface> | undefined>
    setAnimalById(json?: Record<string, any>): Promise<void>
    updateAnimal(animal: Partial<AnimalInterface>): Promise<AnimalInterface|undefined>,
    createAnimal(animal:Partial<AnimalInterface>):Promise<AnimalInterface|undefined>,
    removeAnimal(animal_id:string):Promise<{isDeleted:boolean}|undefined>
}
export const useAnimalStore = create<AnimalState>((set, get) => ({
    animal: undefined,
    animals: undefined,
    async createAnimal(animal) {
        const h = useUserStore.getState().getHeaders();

        if (!h) return
        
        console.log(animal, h);
 
        const formData = new FormData();

        if (animal.images) {
            const imgs = (animal as AnimalInterface & { images: (string | File)[] }).images;
            console.log('images', imgs);
            let count = 0;
            for (let i = 0; i < imgs.length; i++) {
                if((imgs[i] as any) instanceof Blob) {
                    formData.append('images_' + (count++), imgs[i]);
                }
            }
            delete animal.images
        }

        for (const k in animal) {
            if ((animal as any)[k]) {
                (animal as any)[k] && formData.append(k, (animal as any)[k])
            }
        }

        const response = await fetch(`${Host}/create_animal`, {
            method: 'POST',
            body: formData,
            headers: h.headers,
        });

        const _animal = await response.json();
        
        if (!_animal?.id) return
        set(({animals}) => ({
            animal: _animal,
            animals:animals && {...animals,list:[_animal,...animals.list]}
        }));
        return _animal
    },
    
    async removeAnimal(animal_id) {
        const h = useUserStore.getState().getHeaders();
        if (!h) return
        const response = await fetch(`${Host}/delete_animal/${animal_id}`, {
            method: 'DELETE',
            headers: h.headers
        });
        const json = await response.json();
        if(json?.isDeleted){
            set(({animals})=>({animals:animals && {...animals, list:animals.list.filter(p=>p.id != animal_id)}}))
        }
        return json?.isDeleted;
    },
    
    async updateAnimal(animal) {
        const h = useUserStore.getState().getHeaders();

        if (!h) return
        if (!animal.id) return
        (animal as any).animal_id = animal.id
        console.log(animal, h);

        const formData = new FormData();

        if (animal.images) {
            let l = [];
            
            const imgs = (animal as AnimalInterface & { images: (string | File)[] }).images;
            console.log('images', animal.images, imgs);
            
            for (let i = 0; i < imgs.length; i++) {
                if((imgs[i] as any) instanceof Blob) {
                    l.push(`images_${i}`)
                    formData.append('images_' + i, imgs[i]);
                }else{
                    l.push(imgs[i]);
                }
            }
            console.log(l);
        
            formData.append('images',JSON.stringify(l));
            delete animal.images
        }
        for (const k in animal) {
            if ((animal as any)[k]) {
                (animal as any)[k] && formData.append(k, (animal as any)[k])
            }
        }

        const response = await fetch(`${Host}/update_animal`, {
            method: 'PUT',
            body: formData,
            headers: h.headers,
        });

        const _animal = await response.json();
        console.log({ _animal });

        if (!_animal?.id) return
        set(({animals}) => ({
            animal: _animal,
            animals:animals && {...animals,list:animals.list.map(a=>a.id == animal.id ? _animal : a)}
        }));
        return _animal
    },
    async setAnimalById(json) {
        if (!json?.animal_id) return;
        let animal = get().animals?.list.find(a => a.id == json.animal_id);
        if (animal) {
            set(() => ({ animal }));
        } else {
            animal = (await get().fetchAnimals({
                no_save: true,
                animal_id: json.animal_id
            }))?.list[0];
            set(() => ({ animal }));
        }
    },
    async fetchAnimals(filter) {
        const h = useUserStore.getState().getHeaders()
        if (!h) return;
        const searchParams = new URLSearchParams({});
        for (const key in filter) {
            const value = filter[key as keyof typeof filter];
            (value != undefined) && searchParams.set(key, value as any);
        }
        const response = await fetch(`${Host}/get_animals/?${searchParams.toString()}`, {
            headers: h.headers
        });
        const animals = (await response.json()) as ListType<AnimalInterface>
        if (!animals?.list) return
        if (!filter?.no_save) {
            set(() => ({ animals }))
        }
        // console.log(animals);

        return animals
    },
}))