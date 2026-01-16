import * as React from "react"
import type { Control, FieldPath, FieldValues } from "react-hook-form"
import type { LucideIcon } from "lucide-react"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { Combobox } from "./combobox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { DatePicker } from "./date-picker"
import { Input } from "./input"

import { z } from "zod"

export type FieldType = 'text' | 'select' | 'combobox' | 'date';

export interface FieldConfig<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>
  label: string
  type: FieldType
  icon?: LucideIcon
  placeholder?: string
  options?: { label: React.ReactNode; value: string }[]
  className?: string
  colSpan?: number
  validation?: z.ZodTypeAny
  isLoading?: boolean
}

export function generateSchemaFromConfigs<T extends FieldValues>(
  configs: FieldConfig<T>[]
) {
  const shape: any = {};
  configs.forEach((config) => {
    shape[config.name] = config.validation || z.string().optional();
  });
  return z.object(shape);
}

interface FormFieldWrapperProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>
  name: TName
  label: string
  className?: string
  children: (field: any) => React.ReactNode
}

export function FormFieldWrapper<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  className,
  children,
}: FormFieldWrapperProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("group", className)}>
          <FormLabel className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground/80 group-focus-within:text-ring group-has-[[data-state=open]]:text-ring transition-colors">
            {label}
          </FormLabel>
          {children(field)}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

interface FormInputWrapperProps {
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
}

export function FormInputWrapper({
  icon: Icon,
  children,
  className,
}: FormInputWrapperProps) {
  return (
    <FormControl>
      <div className={cn("relative group", className)}>
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-ring group-has-[[data-state=open]]:text-ring transition-colors z-10" />
        )}
        {children}
      </div>
    </FormControl>
  )
}

export function renderDynamicField<T extends FieldValues>(
  fieldConfig: FieldConfig<T>,
  control: Control<T>
) {
  const { name, label, type, icon, placeholder, options, className, isLoading } = fieldConfig;

  return (
    <FormFieldWrapper key={name} control={control} name={name} label={label} className={className}>
      {(field) => {
        switch (type) {
          case 'combobox':
            return (
              <FormInputWrapper icon={icon}>
                <Combobox
                  options={options?.map(opt => ({ 
                    label: typeof opt.label === 'string' ? opt.label : (opt.value), 
                    value: opt.value 
                  })) || []}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={placeholder}
                  isLoading={isLoading}
                  className="w-full pl-9 bg-secondary/40 border-border hover:bg-secondary/60 focus:bg-background focus:border-ring data-[state=open]:border-ring transition-all duration-300 h-11"
                />
              </FormInputWrapper>
            );
          case 'select':
            return (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormInputWrapper icon={icon}>
                  <SelectTrigger className="pl-9 h-11 bg-secondary/40 border-border hover:bg-secondary/60 focus:bg-background focus:border-ring data-[state=open]:border-ring transition-all duration-300">
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormInputWrapper>
                <SelectContent>
                  {options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          case 'date':
            return (
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                placeholder={placeholder}
                className="pl-9 h-11 bg-secondary/40 border-border hover:bg-secondary/60 focus:bg-background focus:border-ring data-[state=open]:border-ring transition-all duration-300"
              />
            );
          case 'text':
          default:
            return (
              <FormInputWrapper icon={icon}>
                <Input
                  {...field}
                  placeholder={placeholder}
                  className="pl-9 h-11 bg-secondary/40 border-border hover:bg-secondary/60 focus:bg-background focus:border-ring transition-all duration-300"
                />
              </FormInputWrapper>
            );
        }
      }}
    </FormFieldWrapper>
  );
}
