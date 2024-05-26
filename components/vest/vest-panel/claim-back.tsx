'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {getWalletClient} from '@wagmi/core';
import {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import {formatUnits, parseUnits} from 'viem';
import {WagmiContext} from 'wagmi';
import {z} from 'zod';

import {Spinner} from '@/components/icons/spinner';
import Button from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Input from '@/components/ui/input';
import {MembershipsContext} from '@/providers/membership-provider';
import {PresaleContext} from '@/providers/presale-provider';
import {ProjectConfigContext} from '@/providers/project-config-provider';
import {PublicClientContext} from '@/providers/public-client-provider';
import {TokensContext} from '@/providers/tokens-provider';
import {Membership} from '@/class/interface/presale';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/vesting-card';
import {cutDecimals} from '@/utils/utils';

interface ClaimBackProperties {
  membership: Membership;
}

export const ClaimBack = ({membership}: ClaimBackProperties) => {
  const {fetchMemberships} = useContext(MembershipsContext);
  const {presaleInstance} = useContext(PresaleContext);
  const {
    chain,
    vestedToken,
    collectedToken,
  } = useContext(ProjectConfigContext);
  const {fetchCollectedTokenData} = useContext(TokensContext);
  const config = useContext(WagmiContext);
  const {publicClients} = useContext(PublicClientContext);

  const publicClient = publicClients[chain.id];

  const [vestedTokenAmountToClaimBack, setVestedTokenAmountToClaimBack] = useState('0');

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const claimableBackCollectedToken = (BigInt(BigInt(membership.usage.max)) * BigInt(membership.price))
    / BigInt(10 ** vestedToken.decimals);

  const claimBackFormSchema = z.object({
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    amount: z.custom<string>((value) => inputValidation(
      value,
      formatUnits(claimableBackCollectedToken, collectedToken.decimals),
    )),
  });

  const form = useForm<z.infer<typeof claimBackFormSchema>>({
    resolver: zodResolver(claimBackFormSchema),
    defaultValues: {
      amount: '0',
    },
  });

  const handleCollectedTokenAmountToClaimBackChange = (value: string) => {
    if (!value) {
      form.setValue('amount', '');
      return;
    }
    // Replace all non-numeric characters except dot and comma
    value = value.replaceAll(/[^\d.]/g, '')
      .replaceAll(/\.+/g, '.');

    // If value ends with a dot, then it's a decimal number and user is still typing
    if (value.endsWith('.')) {
      form.setValue('amount', value);
      return;
    }

    form.setValue('amount', value);

    const values = value.split('.');
    let decimalsLength = values[1] ? values[1].length : 0;
    decimalsLength = Math.min(decimalsLength, collectedToken.decimals);

    value = values[0]
      + (decimalsLength > 0 ? `.${values[1].slice(0, decimalsLength)}` : '');

    const allowedDecimals = decimalsLength
      ? values[1].slice(0, decimalsLength)
      : '';
    const shiftedValue = decimalsLength > 0 ? values[0] + allowedDecimals : value;

    const priceInUnit = parseUnits(
      shiftedValue,
      collectedToken.decimals - decimalsLength,
    );

    const newAmount = (BigInt(priceInUnit) * BigInt(10 ** vestedToken.decimals))
      / BigInt(Number(membership.price));

    setVestedTokenAmountToClaimBack(newAmount.toString());
  };

  async function onSubmit() {
    const client = await getWalletClient(config!);

    setIsLoading(true);

    try {
      const txHash = await presaleInstance!.claimBackTokens(
        client,
        chain,
        membership.id,
        BigInt(vestedTokenAmountToClaimBack),
      );

      await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      await fetchCollectedTokenData();
      await fetchMemberships();

      form.reset();
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="row-span-1">
      <CardHeader>
        <CardTitle>Claim back</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            form.reset();

            setOpen(isOpen);
          }}
        >
          <Button variant="outline" onClick={() => setOpen(true)}>
            Claim back
            {' '}
            {collectedToken.symbol}
          </Button>

          <DialogContent className="bg-black text-white">
            <Form {...form}>
              <DialogHeader>
                <DialogTitle>Make claim back</DialogTitle>
              </DialogHeader>
              {/* <p>{vestedTokenAmountToClaimBack}</p> */}

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="amount"
                  render={({field}) => (
                    <FormItem className="w-full">
                      <div className="flex flex-row justify-between">
                        <FormLabel>
                          Number of
                          {' '}
                          {collectedToken?.symbol}
                          {' '}
                          to claim back
                        </FormLabel>
                      </div>

                      <FormControl>
                        <Input
                          {...field}
                          onChange={(event) => handleCollectedTokenAmountToClaimBackChange(
                            event.target.value,
                          )}
                        />
                      </FormControl>

                      <FormDescription>
                        You have
                        {' '}
                        <span className="font-semibold">
                          {cutDecimals(
                            formatUnits(
                              claimableBackCollectedToken,
                              collectedToken.decimals,
                            ),
                            2,
                          )}
                          {' '}
                          {collectedToken.symbol}
                        </span>
                        {' '}
                        to claim back
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                    variant="destructive"
                    type="submit"
                    disabled={isLoading}
                    className="space-x-2"
                  >
                    {isLoading && <Spinner className="animate-spin" />}
                    <span>
                      Claim back
                      {collectedToken.symbol}
                    </span>
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export const inputValidation = (value: unknown, max: string) => {
  const castedValue: string = String(value);

  // If value is empty, then it's not valid
  if (castedValue === '') return false;

  // If value ends with a dot, then it's not valid
  if (castedValue.endsWith('.')) return false;

  const floatValue = Number.parseFloat(castedValue);

  // If value is not a number, then it's not valid
  if (Number.isNaN(floatValue)) return false;

  // If value is more than max, then it's not valid
  if (floatValue > Number.parseFloat(max)) return false;

  // If value is less than or equal to 0, then it's not valid
  return !(floatValue <= 0);
};
