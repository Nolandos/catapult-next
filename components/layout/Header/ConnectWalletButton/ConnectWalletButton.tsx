'use client';

import {useAccount, useDisconnect} from 'wagmi';
import {useContext} from 'react';
import Button from '@/components/ui/button';
import {Spinner} from '@/components/icons/spinner';
import {ConnectWalletDialogContext} from '@/providers/connect-wallet-provider';
import {useTranslations} from 'next-intl';
import {WAGMI_ACCOUNT_STATUS} from '@/utils/enums.common';
import {cutAddress} from '@/utils/utils';

const ConnectWalletButton = () => {
  const t = useTranslations('');
  const {openDialog} = useContext(ConnectWalletDialogContext);
  const {disconnect} = useDisconnect();
  const {
    status,
    address,
  } = useAccount();
  const {
    CONNECTED,
    CONNECTING,
    RECONNECTING,
  } = WAGMI_ACCOUNT_STATUS;

  const cutedAddress = address
    ? cutAddress(address)
    : '';

  return (
    <Button
      variant={status === CONNECTED ? 'outline' : 'default'}
      disabled={status === CONNECTING || status === RECONNECTING}
      onClick={() => (status === CONNECTED ? disconnect() : openDialog())}
      className="space-x-2"
    >
      {(status === CONNECTING || status === RECONNECTING) && <Spinner className="animate-spin h-5 w-5" />}
      <span>
        {status === CONNECTED
          ? `${t('common.disconnectWalletBtn')} ${cutedAddress}`
          : t('common.connectWalletBtn')}
      </span>
    </Button>
  );
};

export default ConnectWalletButton;
