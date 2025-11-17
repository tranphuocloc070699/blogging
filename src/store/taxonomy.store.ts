import {create} from "zustand";
import {Taxonomy} from "@prisma/client";
import {TaxonomyDto} from "@/types/posts";
import {TaxonomyService, TermService} from "@/services";

interface TaxonomyProps {
  isLoading: boolean;
  taxonomies: TaxonomyDto[];
  initialTaxonomies: () => void;
}
export const useTaxonomyStore = create<TaxonomyProps>((set) => ({
  isLoading:false,
  taxonomies: [],
  initialTaxonomies: async () => {
    const service = new TaxonomyService();
    set({isLoading:true});
    const response = await service.getAllTaxonomies();
    set({taxonomies:response.body.data})
    set({isLoading:false});
  }
}));