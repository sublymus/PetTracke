//UserStore
import { create } from "zustand";
import { Host } from "../../Config";
import { UserInterface } from "../../Database";
import { transmit } from "../../Tools/Transmit";
import { useScaneStore } from "../Scane/ScaneStore";

interface UserState {
    user: UserInterface | undefined;
    openAuth: boolean;
    disconnection(): Promise<void>;
    deleteUserAccount(): Promise<void>;
    authenticateUser(): Promise<void>;
    getAccess(): Promise<void>;
    create_user(data: {
        mode: 'login' | 'signup'
        email: string,
        password: string,
    }): Promise<UserInterface | undefined>
    updateUser(data: Partial<UserInterface>): Promise<void>;
    getHeaders(): { user: UserInterface, headers: Headers } | undefined
}
export const useUserStore = create<UserState>((set) => ({
    user: undefined,
    openAuth: false,
    async create_user({ email, password, mode }) {
        const h = useUserStore.getState().getHeaders();
        if (!h) return
        const formData = new FormData();

        formData.append('mode', mode);
        formData.append('email', email);
        formData.append('password', password);


        const response = await fetch(`${Host}/create_user`, {
            method: 'POST',
            body: formData,
            headers: h.headers,
        });

        const user = await response.json();

        if (!user?.id) return user?.message
        set(() => ({
            user,
        }));
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', user.token || '');
        return user;

    },
    async deleteUserAccount() {
        const h = useUserStore.getState().getHeaders();
        if (!h) return

        const requestOptions = {
            method: "GET",
            headers: h.headers,
        };
        await fetch(`${Host}/delete_user_account`, requestOptions)

        localStorage.removeItem('user');
        set(() => ({ user: undefined, openAuth: true }));
    },
    async updateUser(data) {

        const h = useUserStore.getState().getHeaders();
        if (!h) return
        const formData = new FormData();

        if (data.photos) {
            let l = [];

            const imgs = (data as UserInterface & { photos: (string | File)[] }).photos;

            for (let i = 0; i < imgs.length; i++) {
                if ((imgs[i] as any) instanceof Blob) {
                    l.push(`photos_${i}`)
                    formData.append('photos_' + i, imgs[i]);
                } else {
                    l.push(imgs[i]);
                }
            }

            formData.append('photos', JSON.stringify(l));
            delete data.photos
        }
        if (data.phone) {
            formData.append('phone', JSON.stringify(data.phone));
        }
        if (data.address) {
            formData.append('address', JSON.stringify(data.address));
        }
        if (data.full_name) {
            formData.append('full_name', data.full_name);
        }

        const response = await fetch(`${Host}/edit_me`, {
            method: 'PUT',
            body: formData,
            headers: h.headers,
        });

        const user = await response.json();

        if (!user?.id) return
        set(() => ({
            user,
        }));
        localStorage.setItem('user', JSON.stringify({ ...h.user, ...user }));
    },
    async disconnection() {
        const h = useUserStore.getState().getHeaders();
        if (!h) return

        const requestOptions = {
            method: "GET",
            headers: h.headers,
        };
        await fetch(`${Host}/disconnection`, requestOptions)

        localStorage.removeItem('user');
        set(() => ({ user: undefined, openAuth: true }));
    },
    async getAccess() {
        window.open(
            `${Host}/google_connexion`,
            undefined,
            "popup"
        );
        const id = setInterval(() => {
            const userJson = localStorage.getItem('user');
            const user = userJson && JSON.parse(userJson);
            if (user.token) {
                localStorage.setItem('token', user.token)
                console.log('getAccess', { token: user.token });
                localStorage.setItem('user', JSON.stringify(user))
                clearInterval(id);
                useUserStore.getState().authenticateUser()
            }
        }, 100);
    },
    async authenticateUser() {

        const token = localStorage.getItem('token');

        try {
            if (token) {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${token}`);

                const response = await fetch(`${Host}/me`, {
                    method: "GET",
                    headers: myHeaders,
                })
                let user: any
                user = await response.json();
                if (!user.id) return
                localStorage.setItem('user', JSON.stringify(user));
                set(() => ({ user, openAuth: false }));
                const subscription = transmit.subscription(user.id);
                await subscription.create();
                subscription.onMessage<{ event: 'scane' | 'update_scane' }>(async (data) => {
                    console.log(data);

                    switch (data.event) {
                        case 'scane': {
                            useScaneStore.getState().fetchScanes();
                            const audio = new Audio(`${Host}/src/res/level-up-191997.mp3`);
                            audio.play()
                        };
                            break;
                        case "update_scane": {
                            useScaneStore.getState().fetchScanes();
                        };
                            break;
                    }
                })

                return user
            }
        } catch (error) { }
    },
    getHeaders() {
        let user = useUserStore.getState().user as UserInterface;
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${localStorage.getItem('token')}`);
        return {
            headers,
            user
        }
    }
}));

