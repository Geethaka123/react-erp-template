import { type FieldValues, useForm, type DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/Modal";
import { Form } from "@/components/ui/form";
import { useEffect, useMemo } from 'react';

import { renderDynamicField, type FieldConfig, generateSchemaFromConfigs } from '@/components/ui/AppFormField';

// Generic props for the ItemModal
interface ItemModalProps<T extends FieldValues> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: T) => void;
  isLoading: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  fieldConfigs: FieldConfig<T>[];
  defaultValues: DefaultValues<T>;
  maxWidth?: string;
}

export function ItemModal<T extends FieldValues>({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading, 
  title,
  description,
  fieldConfigs,
  defaultValues,
  maxWidth = "sm:max-w-[900px]"
}: ItemModalProps<T>) {
  
  const schema = useMemo(() => generateSchemaFromConfigs(fieldConfigs), [fieldConfigs]);

  const form = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as any,
    defaultValues: defaultValues
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
  }, [isOpen, defaultValues, form]);

  const handleFormSubmit = (data: T) => {
    onSubmit(data);
  };

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={title}
        description={description}
        maxWidth={maxWidth}
        className="!bg-background"

        footer={
            <>
                <Button 
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold" 
                    type="submit" 
                    form="item-modal-form" 
                    disabled={isLoading}
                >
                    Create
                </Button>
                 <Button 
                    variant="outline"
                    type="button" 
                    onClick={onClose} 
                    disabled={isLoading}
                    className="flex-1"
                >
                    Cancel
                </Button>
            </>
        }
    >
        <Form {...form}>
            <form id="item-modal-form" onSubmit={form.handleSubmit(handleFormSubmit)} className="grid grid-cols-2 gap-6 font-sans">
                {fieldConfigs.map(config => renderDynamicField(config, form.control))}
            </form>
        </Form>
    </Modal>
  );
}

