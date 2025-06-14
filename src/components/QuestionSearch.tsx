
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface QuestionSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const QuestionSearch = ({ searchTerm, onSearchChange }: QuestionSearchProps) => {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
      <CardContent className="pt-6">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search questions by course code, title, or content..."
            className="flex-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionSearch;
