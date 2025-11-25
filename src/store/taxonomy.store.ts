import { TaxonomyDto } from "@/types/posts";
import { create } from "zustand";
import taxonomyService from "@/services/modules/taxonomy-service";
interface TaxonomyProps {
  isLoading: boolean;
  taxonomies: TaxonomyDto[];
  initialTaxonomies: () => void;
}
export const useTaxonomyStore = create<TaxonomyProps>((set) => ({
  isLoading:false,
  taxonomies: [],
  initialTaxonomies: async () => {

    set({isLoading:true});
    const response = await taxonomyService.getAllTaxonomies();
    set({taxonomies:response.body.data})
    set({isLoading:false});
  }
}));