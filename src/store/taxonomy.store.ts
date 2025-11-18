import { TaxonomyService } from "@/services";
import { TaxonomyDto } from "@/types/posts";
import { create } from "zustand";

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