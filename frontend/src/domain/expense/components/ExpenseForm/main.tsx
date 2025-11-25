import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { z } from 'zod';
import { expenseSchema } from '../../validations/expense';
import { useExpenseCreate } from '../../hooks/useExpenseCreate';
import { useCategoryList } from '@/domain/category/hooks/useCategoryList';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Textarea } from '@/core/components/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/core/components/alert-dialog';
import { toast } from 'sonner';
import { useState } from 'react';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/core/components/loading-spinner';

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  onSuccess?: () => void;
}

function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const { createExpense, isPending } = useExpenseCreate();
  const { categories, isLoading: isLoadingCategories } = useCategoryList();
  const [showHighValueAlert, setShowHighValueAlert] = useState(false);
  const [pendingData, setPendingData] = useState<ExpenseFormData | null>(null);

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    mode: 'onBlur',
    defaultValues: {
      amount: 0,
      expenseDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      description: '',
      idCategory: undefined,
    },
  });

  const handleSubmit = async (data: ExpenseFormData) => {
    if (data.amount > 10000) {
      setPendingData(data);
      setShowHighValueAlert(true);
      return;
    }

    await submitExpense(data);
  };

  const submitExpense = async (data: ExpenseFormData) => {
    try {
      const sanitizedData = {
        ...data,
        description: data.description ? DOMPurify.sanitize(data.description) : null,
      };

      await createExpense(sanitizedData);
      toast.success(`Gasto de R$ ${data.amount.toFixed(2)} registrado com sucesso!`);
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Não foi possível registrar o gasto. Tente novamente.';
      toast.error(errorMessage);
    }
  };

  const handleConfirmHighValue = async () => {
    if (pendingData) {
      await submitExpense(pendingData);
      setPendingData(null);
    }
    setShowHighValueAlert(false);
  };

  const handleCancelHighValue = () => {
    setPendingData(null);
    setShowHighValueAlert(false);
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const numberValue = parseFloat(numericValue) / 100;
    return numberValue;
  };

  if (isLoadingCategories) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="R$ 0,00"
                    value={field.value ? `R$ ${field.value.toFixed(2)}` : ''}
                    onChange={(e) => {
                      const formatted = formatCurrency(e.target.value);
                      field.onChange(formatted);
                    }}
                    onBlur={field.onBlur}
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription>Digite o valor do gasto realizado</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expenseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data *</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    value={field.value ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm") : ''}
                    onChange={(e) => {
                      const isoDate = new Date(e.target.value).toISOString();
                      field.onChange(isoDate);
                    }}
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription>Selecione a data em que o gasto foi realizado</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="idCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString()}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.idCategory} value={category.idCategory.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Escolha a categoria que melhor descreve o gasto</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva o gasto (opcional)"
                    {...field}
                    value={field.value ?? ''}
                    disabled={isPending}
                  />
                </FormControl>
                <FormDescription>
                  Adicione detalhes sobre o gasto (máximo 100 caracteres)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isPending}
            >
              Limpar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Registrando...
                </>
              ) : (
                'Registrar Gasto'
              )}
            </Button>
          </div>
        </form>
      </Form>

      <AlertDialog open={showHighValueAlert} onOpenChange={setShowHighValueAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar valor alto</AlertDialogTitle>
            <AlertDialogDescription>
              Você está registrando um gasto de valor elevado (R$ {pendingData?.amount.toFixed(2)}).
              Confirma esta operação?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelHighValue}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmHighValue}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export { ExpenseForm };
