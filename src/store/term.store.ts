import {create} from "zustand";
import {TermDto} from "@/types/posts";
import termService from "@/services/modules/term-service";

interface TermProps {
  isLoading: boolean;
  terms: TermDto[];
  initialTerms: () => void;
  tagTerms:TermDto[];
}
export const useTermStore = create<TermProps>((set) => ({
  isLoading:false,
  terms: [],
  tagTerms:[],
  initialTerms: async () => {
    set({isLoading:true});
     const response = await termService.getAllTerms();
      set({terms:response.body.data,tagTerms: response.body.data.filter(term => term.taxonomy.slug === "tag"),})
      
    set({isLoading:false});
  }
}));