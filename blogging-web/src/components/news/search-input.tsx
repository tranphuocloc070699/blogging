import {Search, SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/input";

const SearchInput = ({value, onChange}: { value: string; onChange: (v: string) => void }) => (
    <div className="relative flex items-center">
      <SearchIcon className="absolute left-3 h-4 w-4 text-muted-foreground"/>
      <Input type="text" placeholder="Search..." className="pl-10 rounded-pill"/>
    </div>
);

export default SearchInput;