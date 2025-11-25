import {create} from "zustand/index";
import {persist} from "zustand/middleware";


interface DirectionStore {
  direction: string;
  setDirection: (direction: string) => void;
}

export const useDirection = create<DirectionStore>()(
    persist(
        (set) => ({
          direction: "ltr",
          setDirection: (direction: string) => set({direction}),
        }),
        {
          name: 'iso-direction',
        }
    )
);