import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

import {getWalletClient} from '@wagmi/core';

import {
  Chain, erc20Abi, formatUnits, getContract, parseUnits,
} from 'viem';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import {cutDecimals} from '@/utils/utils';
import {useContext, useEffect, useState} from 'react';
import {useAccount, useSwitchChain, WagmiContext} from 'wagmi';
import {PublicClientContext} from '@/providers/public-client-provider';
import {catapultAbi} from '@/abi/catapult';
import {Presale, Token} from '@/utils/types.common';
import {useTranslations} from 'next-intl';
import {clsx} from 'clsx';
import {Spinner} from '../icons/spinner';

interface BuyTokensPanelProperties {
  chains: Chain[];
  tokensData: { [chainId: number]: Token };
  setTokensData: (tokensData: { [chainId: number]: Token }) => void;
  presaleData: { [chainId: number]: Presale };
}

const BuyTokens = ({
  chains,
  tokensData,
  setTokensData,
  presaleData,
}: BuyTokensPanelProperties) => {
  const {
    address: walletAddress,
    chainId,
  } = useAccount();
  const t = useTranslations('Project');

  const config = useContext(WagmiContext);
  const {switchChain} = useSwitchChain();
  const {publicClients} = useContext(PublicClientContext);

  const [token, setToken] = useState<Token>(tokensData[chainId!]);
  const [amountInUnit, setAmountInUnit] = useState<string>('0');
  const [needApproval, setNeedApproval] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!chainId) return;

    const _token = tokensData[chainId!];

    setToken(_token);
    setNeedApproval(BigInt(_token.allowance || '0') < BigInt(amountInUnit));
  }, [chainId, tokensData]);

  const fetchTokensData = async () => {
    const tokensDataPromises = chains.map(async (chain) => {
      const client = publicClients[chain.id];

      const tokenContract = getContract({
        address: tokensData[chain.id].address,
        abi: erc20Abi,
        client,
      });

      const presaleContract = getContract({
        address: presaleData[chain.id].address,
        abi: catapultAbi,
        client,
      });

      const [balance, allowance, deposited] = await Promise.all([
        tokenContract.read.balanceOf([walletAddress!]),
        tokenContract.read.allowance([
          walletAddress!,
          presaleData[chain.id].address,
        ]),
        presaleContract.read.deposits([walletAddress!]),
      ]);

      return {
        chainId: chain.id,
        tokenData: {
          ...tokensData[chain.id],
          balance: balance.toString(),
          allowance: allowance.toString(),
          deposited: deposited.toString(),
        },
      };
    });

    const resolvedTokensData = await Promise.all(tokensDataPromises);

    const _tokensData = resolvedTokensData.reduce((acc, {
      // eslint-disable-next-line no-shadow
      chainId,
      tokenData,
    }) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      acc[chainId] = tokenData;
      return acc;
    }, {});

    setTokensData(_tokensData);
    return _tokensData;
  };

  useEffect(() => {
    if (walletAddress) {
      fetchTokensData();
    }
  }, []);

  const buyTokensFormSchema = z.object({
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    amount: z.custom<string>((value) => inputValidation(value, formatUnits(BigInt(token.balance), token.decimals))),
  });

  const form = useForm<z.infer<typeof buyTokensFormSchema>>({
    resolver: zodResolver(buyTokensFormSchema),
    defaultValues: {
      amount: '0',
    },
  });

  const handleAmountChange = (value: string) => {
    if (!value) {
      form.setValue('amount', '');
      setAmountInUnit('0');
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

    const values = value.split('.');
    let decimalsLength = values[1] ? values[1].length : 0;
    decimalsLength = Math.min(decimalsLength, token.decimals);

    value = values[0]
      + (decimalsLength > 0 ? `.${values[1].slice(0, decimalsLength)}` : '');

    const allowedDecimals = decimalsLength
      ? values[1].slice(0, decimalsLength)
      : '';
    const shiftedValue = decimalsLength > 0 ? values[0] + allowedDecimals : value;

    const amountOfUnit = parseUnits(
      shiftedValue,
      token.decimals - decimalsLength,
    );

    setAmountInUnit(amountOfUnit.toString());

    setNeedApproval(BigInt(token.allowance || '0') < amountOfUnit);

    form.setValue('amount', value);
    form.trigger('amount');
  };

  const handleMaxPriceAmount = () => {
    const amountUnit = formatUnits(BigInt(token.balance), token.decimals);
    handleAmountChange(amountUnit);
  };

  async function submit() {
    if (!chainId) return;
    setIsLoading(true);

    const client = await getWalletClient(config!);

    try {
      if (needApproval) {
        const tokenContract = getContract({
          address: token.address,
          abi: erc20Abi,
          client,
        });

        const txHash = await tokenContract.write.approve([
          presaleData[chainId!].address,
          BigInt(amountInUnit),
        ]);

        await publicClients[chainId!].waitForTransactionReceipt({
          hash: txHash,
          // confirmations: 5,
        });

        // sleep for 3 seconds
        await new Promise((resolve) => {
          setTimeout(resolve, 3000);
        });

        await fetchTokensData();

        setIsLoading(false);
      } else {
        const presaleContract = getContract({
          address: presaleData[chainId!].address,
          abi: catapultAbi,
          client,
        });

        const txHash = await presaleContract.write.deposit([
          BigInt(amountInUnit),
        ]);

        await publicClients[chainId!].waitForTransactionReceipt({
          hash: txHash,
          // confirmations: 5,
        });

        // sleep for 3 seconds
        await new Promise((resolve) => {
          setTimeout(resolve, 3000);
        });

        await fetchTokensData();

        setIsLoading(false);
      }
    } catch (err) {
      // split error message by new lines and get the first line
      setError((err as Error).message.split('\n')[0]);

      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex flex-wrap justify-between border border-cyan-500 text-cyan-500 px-4 py-2 rounded-[37px] items-center gap-2"
      >
        <p className="capitalize text-white">{t('buyTokens.alreadyLockedInfo')}</p>
        <span className="font-semibold text-[20px]">
          {cutDecimals(
            formatUnits(BigInt(token.deposited), token.decimals),
            2,
          )}
          {' '}
          {token.symbol}
        </span>
      </div>

      {chains.length > 1 && (
        <div className="flex flex-row gap-0 w-full h-[40px]">
          {chains.map((chain, index) => (
            <Button
              variant={chain.id === chainId ? 'default' : 'outline'}
              key={chain.id}
              onClick={() => chain.id !== chainId && switchChain({chainId: chain.id})}
              className={clsx(
                'w-full h-[40px] p-[12px] text-[20px] rounded-[none] disabled:bg-primary disabled:text-primary-foreground disabled:border-primary font-semibold',
                index === 0 && 'rounded-tl-[37px] rounded-bl-[37px]',
                index === chains.length - 1 && 'rounded-tr-[37px] rounded-br-[37px]',
              )}
              disabled={chain.id === chainId}
            >
              {chain.name}
            </Button>
          ))}
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className="flex flex-col w-full h-full justify-center items-center gap-4 md:gap-8"
        >
          <FormField
            control={form.control}
            name="amount"
            render={({field}) => (
              <FormItem className="w-full">
                <div className="flex flex-row justify-between">
                  <FormLabel
                    className="font-semibold text-white text-[14px]"
                  >
                    {t('buyTokens.amount')}
                  </FormLabel>

                  <FormDescription className="font-semibold text-white">
                    Balance:
                    {' '}
                    <span className="font-semibold">
                      {cutDecimals(
                        formatUnits(BigInt(token.balance), token.decimals),
                        2,
                      )}
                      {' '}
                      {token.symbol}
                    </span>
                  </FormDescription>
                </div>

                <FormControl>
                  <div className="flex flex-row items-center">
                    <Input
                      {...field}
                      onChange={(event) => {
                        handleAmountChange(event.target.value);
                      }}
                      className="rounded-r-none h-10 py-6 border border-c-500"
                      autoComplete="off"
                    />

                    <Button
                      onClick={handleMaxPriceAmount}
                      type="button"
                      className="border-l-0 rounded-l-none border border-c-500"
                    >
                      {t('buyTokens.max')}
                    </Button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={!form.formState.isValid || isLoading}>
            {isLoading && <Spinner className="animate-spin mr-2" />}

            {needApproval ? t('buyTokens.approve') : t('buyTokens.lock')}
          </Button>

          {error && <p className="text-red-500">{error}</p>}
        </form>
      </Form>
    </div>
  );
};

const inputValidation = (value: unknown, max: string) => {
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

export default BuyTokens;
