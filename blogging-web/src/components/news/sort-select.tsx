import {ListFilter} from 'lucide-react';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SortSelect = () => {
  return (
      <Select defaultValue={"popular"}>
        <SelectTrigger className="w-[120px] rounded-pill">
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="viewed">Viewed</SelectItem>
          <SelectItem value="popular">Popular</SelectItem>
        </SelectContent>
      </Select>
  );
};

export default SortSelect;