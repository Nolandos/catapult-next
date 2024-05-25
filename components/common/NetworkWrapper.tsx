import {
  Card, CardHeader, CardTitle, CardContent,
} from '@/components/ui/card';
import Button from '@/components/ui/button';
import {useContext} from 'react';
import {Chain} from 'viem';
import {useSwitchChain, useAccount} from 'wagmi';
import {ConnectWalletDialogContext} from '@/providers/connect-wallet-provider';
import {useTranslations} from 'next-intl';
import {WAGMI_ACCOUNT_STATUS} from '@/utils/enums.common';
import {Spinner} from '../icons/spinner';

const NetworkWrapper = ({
  chains,
  children,
}: {
  chains: Chain[]
  children: React.ReactNode
}) => {
  const t = useTranslations('');
  const {openDialog} = useContext(ConnectWalletDialogContext);
  const {
    CONNECTING,
    RECONNECTING,
    DISCONNECTED,
  } = WAGMI_ACCOUNT_STATUS;

  const {switchChain} = useSwitchChain();

  const {
    chainId,
    status,
  } = useAccount();

  if ((status === CONNECTING || status === RECONNECTING)) {
    return <Spinner className="animate-spin h-12 w-12 mx-auto" />;
  }

  if (status === DISCONNECTED) {
    return (
      <div className="flex items-center justify-center min-w-[35%]">
        <Button onClick={openDialog}>{t('common.connectWalletBtn')}</Button>
      </div>
    );
  }

  if (!chains.some((chain) => chain.id === chainId!)) {
    return (
      <div className="flex items-center justify-center min-w-[35%]">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t('common.unsupportedNetworkInfo')}</CardTitle>
          </CardHeader>

          <CardContent className="h-full space-y-3">
            <p className="text-center">
              {t('common.switchNetworkInfo')}
            </p>

            <div className="flex flex-col gap-4">
              {chains.map((chain) => (
                <Button
                  key={chain.id}
                  onClick={() => switchChain({chainId: chain.id})}
                >
                  Switch to
                  {' '}
                  {chain.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export default NetworkWrapper;
