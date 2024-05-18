import React, {createContext, useMemo, useState} from 'react';
import {useConnect} from 'wagmi';
import Button from '@/components/ui/button';
import {MetamaskIcon, WalletConnectIcon} from '@/components/icons';
import {IconProperties} from '@/components/icons/iconProperties';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface ConnectWalletDialogContextProperties {
  openDialog: () => void;
}

export const ConnectWalletDialogContext = createContext<ConnectWalletDialogContextProperties>({
  openDialog: () => {
  },
});

export const ConnectWalletDialogProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const {
    connectors,
    connect,
  } = useConnect();

  const [isOpen, setIsOpen] = useState(false);

  // remove duplication
  const _connectors = connectors.filter(
    (connector, index, self) => index === self.findIndex((c) => c.name === connector.name),
  );

  const icons: {
    [key: string]: ({className}: IconProperties) => React.ReactNode
  } = {
    MetaMask: MetamaskIcon,
    WalletConnect: WalletConnectIcon,
  };

  const contextValue = useMemo(
    () => ({
      openDialog: () => setIsOpen(!isOpen),
    }),
    [],
  );

  return (
    <ConnectWalletDialogContext.Provider
      value={contextValue}
    >
      <Dialog open={isOpen} onOpenChange={(_isOpen) => setIsOpen(_isOpen)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect wallet</DialogTitle>
          </DialogHeader>

          <DialogDescription asChild>
            <div className="grid gap-2 auto-rows-fr">
              {_connectors.map((connector) => {
                const Icon = icons[connector.name];

                return (
                  <Button
                    key={connector.uid}
                    onClick={() => connect(
                      {connector},
                      {
                        onSuccess: () => setIsOpen(false),
                      },
                    )}
                    className="flex flex-row gap-2 h-auto justify-center items-center p-2"
                    variant="secondary"
                  >
                    {Icon && <Icon className="" />}

                    <span>{connector.name}</span>
                  </Button>
                );
              })}
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
      {children}
    </ConnectWalletDialogContext.Provider>
  );
};
