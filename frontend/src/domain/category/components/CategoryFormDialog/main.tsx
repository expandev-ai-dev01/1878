import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { categorySchema } from '../../validations/category';
import { useCategoryCreate } from '../../hooks/useCategoryCreate';
import { useCategoryUpdate } from '../../hooks/useCategoryUpdate';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/core/components/form';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/core/components/sheet';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import type { Category } from '../../types/category';
import { useEffect } from 'react';
import { CATEGORY_ICONS, ICON_OPTIONS } from '../../constants/icons';
import { COLOR_OPTIONS } from '../../constants/colors';
import { RadioGroup, RadioGroupItem } from '@/core/components/radio-group';
import { Label } from '@/core/components/label';

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  category?: Category;
}

function CategoryFormDialog({ open, onOpenChange, mode, category }: CategoryFormDialogProps) {
  const { createCategory, isPending: isCreating } = useCategoryCreate();
  const { updateCategory, isPending: isUpdating } = useCategoryUpdate();
  const isPending = isCreating || isUpdating;

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      icon: 'circle',
      color: '#9E9E9E',
    },
  });

  useEffect(() => {
    if (open && mode === 'edit' && category) {
      form.reset({
        name: category.name,
        icon: category.icon,
        color: category.color,
      });
    } else if (open && mode === 'create') {
      form.reset({
        name: '',
        icon: 'circle',
        color: '#9E9E9E',
      });
    }
  }, [open, mode, category, form]);

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      if (mode === 'create') {
        await createCategory(data);
        toast.success(`Categoria "${data.name}" criada com sucesso!`);
      } else if (category) {
        await updateCategory({ idCategory: category.idCategory, ...data });
        toast.success(`Categoria "${data.name}" atualizada com sucesso!`);
      }
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        `Não foi possível ${mode === 'create' ? 'criar' : 'atualizar'} a categoria.`;
      toast.error(errorMessage);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{mode === 'create' ? 'Nova Categoria' : 'Editar Categoria'}</SheetTitle>
          <SheetDescription>
            {mode === 'create'
              ? 'Crie uma nova categoria personalizada para organizar seus gastos'
              : 'Atualize as informações da categoria'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Pets, Investimentos..."
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>Nome da categoria (3-30 caracteres)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ícone *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isPending}
                      className="grid grid-cols-5 gap-3"
                    >
                      {ICON_OPTIONS.map((option) => {
                        const IconComponent = CATEGORY_ICONS[option.value];
                        return (
                          <div key={option.value}>
                            <RadioGroupItem
                              value={option.value}
                              id={`icon-${option.value}`}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={`icon-${option.value}`}
                              className="flex h-14 cursor-pointer items-center justify-center rounded-lg border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <IconComponent className="h-6 w-6" />
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>Selecione um ícone para a categoria</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isPending}
                      className="grid grid-cols-5 gap-3"
                    >
                      {COLOR_OPTIONS.map((option) => (
                        <div key={option.value}>
                          <RadioGroupItem
                            value={option.value}
                            id={`color-${option.value}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`color-${option.value}`}
                            className="flex h-14 cursor-pointer items-center justify-center rounded-lg border-2 border-muted hover:border-primary peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            style={{ backgroundColor: option.value }}
                          >
                            <span className="sr-only">{option.label}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>Escolha uma cor para identificar a categoria</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <LoadingSpinner className="mr-2" />
                    {mode === 'create' ? 'Criando...' : 'Salvando...'}
                  </>
                ) : mode === 'create' ? (
                  'Criar Categoria'
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export { CategoryFormDialog };
