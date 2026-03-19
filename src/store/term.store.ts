import {create} from "zustand";
import {TermDto} from "@/types/posts";
import termService from "@/services/modules/term-service";
import { ApiRequestError } from "@/lib/app-error";

interface TermProps {
  isLoading: boolean;
  terms: TermDto[];
  initialTerms: () => void;
  tagTerms:TermDto[];
  error: string | null;
}
export const useTermStore = create<TermProps>((set) => ({
  isLoading:false,
  terms: [],
  tagTerms:[],
  error: null,
  initialTerms: async () => {
    set({isLoading:true});
    try {
      const response = await termService.getAllTerms();
      set({
        terms: response.body.data,
        tagTerms: response.body.data.filter(term => term.taxonomy.slug === "tag"),
        error: null,
      });
    } catch (error) {
      set({
        terms: [],
        tagTerms: [],
        error: error instanceof ApiRequestError ? error.message : 'Failed to load terms',
      });
    } finally {
      set({isLoading:false});
    }
  }
}));
