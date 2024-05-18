'use client';

import Link from 'next/link';
import {LogoCatapult} from '@/components/icons';
import {useState} from 'react';
import Button from '@/components/ui/button';
import {Menu, X} from 'lucide-react';
import {clsx} from 'clsx';
import ConnectWalletButton from '@/components/layout/Header/ConnectWalletButton/ConnectWalletButton';
import {useTranslations} from 'next-intl';
import urls from '@/utils/urls';

const Header = () => {
  const [mobileMenuOpened, setMobileMenuOpened] = useState<boolean>(false);
  const t = useTranslations('');
  const {home} = urls;

  return (
    <header
      className="sticky top-0 left-0 z-50 border-b bg-g-700 backdrop-blur border-yellow-500"
    >
      <div
        className={clsx(
          'container flex md:justify-between flex-col md:flex-row md:items-center py-3',
          mobileMenuOpened && 'h-screen gap-8 md:h-auto',
        )}
      >
        <div className="flex items-center justify-between w-full md:contents">
          <Link href={home} className="flex items-center gap-4">
            <div className="w-10 h-10 object-contain">
              <LogoCatapult size={41} />
            </div>

            <span className="uppercase text-y-500 font-semibold">{t('common.catapult')}</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpened(!mobileMenuOpened)}
            className="md:hidden"
          >
            {mobileMenuOpened ? <X /> : <Menu />}
          </Button>
        </div>
        <div className="flex gap-6 flex-col md:contents text-lg lowercase">
          <Link
            className={clsx(
              'font-semibold text-xl',
              mobileMenuOpened ? 'flex' : 'hidden md:flex',
            )}
            href={home}
          >
            {t('header.launchpad')}
          </Link>
          <div className={clsx(mobileMenuOpened ? 'flex' : 'hidden md:flex')}>
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
