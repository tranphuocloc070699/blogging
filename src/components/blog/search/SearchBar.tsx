'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Search posts..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-11 rounded-full border-gray-200 focus:ring-1 focus:ring-black focus:border-black"
      />
    </div>
  );
}
