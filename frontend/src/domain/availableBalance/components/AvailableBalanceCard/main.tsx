import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Progress } from '@/core/components/progress';
import { Button } from '@/core/components/button';
import { Alert, AlertDescription, AlertTitle } from '@/core/components/alert';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { WalletIcon, AlertTriangleIcon, ArrowRightIcon } from 'lucide-react';
import { useAvailableBalance } from '../../hooks/useAvailableBalance';
import { cn } from '@/core/lib/utils';
import { useNavigation } from '@/core/hooks/useNavigation';

function AvailableBalanceCard() {
  const { availableBalance, isLoading, error } = useAvailableBalance();
  const { navigate } = useNavigation();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner className="h-8 w-8" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertTitle>Erro ao carregar saldo</AlertTitle>
        <AlertDescription>
          Não foi possível carregar o saldo disponível. Tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  if (!availableBalance) {
    return null;
  }

  const {
    valor_formatado,
    status_saldo,
    cor_indicador,
    mensagem_status,
    valor_percentual_formatado,
    progresso_barra,
    cor_barra_progresso,
    container_mensagem_sem_orcamento,
  } = availableBalance;

  // Map API colors to Tailwind classes
  const textColors = {
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    gray: 'text-gray-600',
  };

  const progressColors = {
    green: '[&>div]:bg-green-600',
    red: '[&>div]:bg-red-600',
    yellow: '[&>div]:bg-yellow-600',
    gray: '[&>div]:bg-gray-400',
  };

  const bgColors = {
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    gray: 'bg-gray-50 border-gray-200',
  };

  // Handle "No Budget" state
  if (status_saldo === 'indefinido' && container_mensagem_sem_orcamento?.visible) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WalletIcon className="h-5 w-5 text-muted-foreground" />
            Saldo Disponível
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 py-6 text-center">
          <div className="rounded-full bg-muted p-3">
            <WalletIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">{container_mensagem_sem_orcamento.message}</h3>
            <p className="text-sm text-muted-foreground">
              Configure um orçamento mensal para acompanhar seu saldo disponível.
            </p>
          </div>
          <Button onClick={() => navigate('/orcamento')} variant="outline">
            Definir Orçamento
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('transition-all', bgColors[cor_indicador])}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Saldo Disponível
          </CardTitle>
          <WalletIcon className={cn('h-4 w-4', textColors[cor_indicador])} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <span className={cn('text-3xl font-bold', textColors[cor_indicador])}>
              {valor_formatado}
            </span>
            <p className="text-sm font-medium text-muted-foreground">{mensagem_status}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Orçamento utilizado</span>
              <span className="font-medium">{valor_percentual_formatado}</span>
            </div>
            <Progress
              value={Math.min(progresso_barra * 100, 100)}
              className={cn('h-2 bg-black/5', progressColors[cor_barra_progresso])}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { AvailableBalanceCard };
