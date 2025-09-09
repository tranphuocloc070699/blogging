"use client"

import {LAYOUT_OPTIONS} from '@/config/enums';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface LayoutStore {
  layout: string;
  setLayout: (layout: string) => void;
}

export const useLayout = create<LayoutStore>()(
    persist(
        (set) => ({
          layout: LAYOUT_OPTIONS.HYDROGEN,
          setLayout: (layout: string) => set({layout}),
        }),
        {
          name: 'admin-template-layout',
        }
    )
);