import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { cn } from '@/lib/utils';

export interface SearchField {
  id: string;
  label: string;
  type?: 'text' | 'number' | 'autocomplete';
  placeholder?: string;
  options?: { label: string; value: string }[];
  isLoading?: boolean;
}

interface AdvancedSearchProps {
  fields: SearchField[];
  onSearch: (values: Record<string, string>) => void;
  onReset: () => void;
  className?: string;
}

import { Label } from './label';
import { Combobox } from './combobox';

export function AdvancedSearch({ fields, onSearch, onReset, className }: AdvancedSearchProps) {
  const [values, setValues] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {})
  );

  const handleInputChange = (id: string, value: string) => {
    setValues(prev => ({ ...prev, [id]: value }));
  };

  const handleReset = () => {
    const resetValues = fields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {});
    setValues(resetValues);
    onReset();
  };

  return (
    <div className={cn("w-full bg-secondary/50 dark:bg-secondary/20 p-6 rounded-xl space-y-6 shadow-sm backdrop-blur-sm transition-all duration-300 border border-border/50", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium text-muted-foreground ml-1">
              {field.label}
            </Label>
            {field.type === 'autocomplete' && field.options ? (
              <Combobox
                options={field.options}
                value={values[field.id]}
                onChange={(val) => handleInputChange(field.id, val)}
                placeholder={field.placeholder}
                isLoading={field.isLoading}
                className="w-full bg-background dark:bg-slate-950 border-border h-11 shadow-xs transition-all rounded-lg hover:bg-background"
              />
            ) : (
              <Input
                id={field.id}
                type={field.type === 'number' ? 'number' : 'text'}
                placeholder={field.placeholder}
                value={values[field.id]}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="bg-background dark:bg-slate-950 border-border text-foreground placeholder:text-muted-foreground h-11 shadow-xs focus-visible:ring-primary/20 transition-all rounded-lg"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button
          variant="outline"
          onClick={handleReset}
          className="bg-background dark:bg-slate-900 border-border hover:bg-muted text-muted-foreground font-black h-11 px-8 rounded-lg shadow-xs transition-all uppercase tracking-widest text-xs"
        >
          RESET
        </Button>
        <Button
          onClick={() => onSearch(values)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-black h-11 px-8 rounded-lg shadow-md shadow-primary/20 transition-all active:scale-95 uppercase tracking-widest text-xs"
        >
          SEARCH
        </Button>
      </div>
    </div>
  );
}
