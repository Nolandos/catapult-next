'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {Dialog, DialogContent, DialogTitle} from '@radix-ui/react-dialog';
import {getWalletClient} from '@wagmi/core';
import {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Address, isAddress, zeroAddress} from 'viem';
import {useAccount, WagmiContext} from 'wagmi';
import * as z from 'zod';
import {Spinner} from '@/components/icons/spinner';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';

import {MembershipsContext} from '@/providers/membership-provider';
import {PresaleContext} from '@/providers/presale-provider';
import {ProjectConfigContext} from '@/providers/project-config-provider';
import {PublicClientContext} from '@/providers/public-client-provider';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import {DialogHeader, DialogFooter} from '@/components/ui/dialog';

export const TransferMembership = () => {
  const config = useContext(WagmiContext);

  const {address: walletAddress} = useAccount();

  const {
    chain,
    presaleAddress,
    vestedToken,
  } = useContext(ProjectConfigContext);

  const {publicClients} = useContext(PublicClientContext);
  const publicClient = publicClients[chain.id];

  const {presaleInstance} = useContext(PresaleContext);
  const {
    selectedMembershipId,
    fetchMemberships,
  } = useContext(MembershipsContext);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const transferVestingFormSchema = z.object({
    address: z.custom(
      (value) => {
        if (typeof value !== 'string') return false;

        if (!isAddress(value)) return false;

        return (
          value.toLowerCase() !== presaleAddress.toLowerCase()
          && value.toLowerCase() !== vestedToken.address.toLowerCase()
          && value.toLowerCase() !== zeroAddress.toLowerCase()
        );
      },
      {
        message: 'Invalid address',
      },
    ),
  });

  const form = useForm<z.infer<typeof transferVestingFormSchema>>({
    resolver: zodResolver(transferVestingFormSchema),
    defaultValues: {
      address: '',
    },
  });

  const handleMembershipTransfer = async (to: Address) => {
    if (
      !selectedMembershipId
      || !presaleInstance
      || !config
      || !walletAddress
    ) {
      return;
    }
    const client = await getWalletClient(config);
    setIsLoading(true);

    try {
      const txHash = await presaleInstance.transferMembership(
        client,
        chain,
        to,
        selectedMembershipId,
      );

      await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      await fetchMemberships();

      setIsLoading(false);
      setOpen(false);
    } catch {
      setIsLoading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof transferVestingFormSchema>) {
    await handleMembershipTransfer(values.address);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(idOpen) => {
        form.reset();

        setOpen(idOpen);
      }}
    >
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-fit"
      >
        Transfer vesting
      </Button>

      <DialogContent>
        <Form {...form}>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <p className="text-white">
                You can change the owner of your vesting. The new owner will be
                able to claim all unvested tokens. This can also be transferred
                to a wallet that already has vesting.
              </p>

              <FormField
                control={form.control}
                name="address"
                render={({field}) => (
                  <FormItem className="w-full">
                    <FormLabel>Address</FormLabel>

                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormDescription>
                      WARNING: do NOT select an exchange address here. It must
                      be a private wallet to continue claiming the remaining
                      vesting.
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>

              <Button
                variant="secondary"
                type="submit"
                disabled={isLoading}
                className="space-x-2"
              >
                {isLoading && <Spinner className="animate-spin" />}
                <span>Transfer vesting</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
