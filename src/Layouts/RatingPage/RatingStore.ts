import { create } from "zustand";
import { Host } from "../../Config";
import { RatingInterface } from "../../Database";
import { useUserStore } from "../Profile/UserStore";

interface RatingState {
    add_rating(rate: Partial<RatingInterface>): Promise<RatingInterface|undefined>
}
export const useRatingStore = create<RatingState>(() => ({
    async add_rating(rate) {
        const h = useUserStore.getState().getHeaders();

        if (!h) return

        const formData = new FormData();

        formData.append('star', rate.star as any);
        formData.append('message', rate.message || '');
        formData.append('env', rate.env || '');

        const response = await fetch(`${Host}/add_rating`, {
            method: 'POST',
            body: formData,
            headers: h.headers,
        });

        const _rate = await response.json();

        if (!_rate?.id) return
        return _rate
    }
}))