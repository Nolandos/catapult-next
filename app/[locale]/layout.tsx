import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import type {Metadata} from 'next';
// eslint-disable-next-line camelcase
import {Wix_Madefor_Display} from 'next/font/google';

import './globals.css';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import Providers from '@/app/[locale]/providers';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};
const inter = Wix_Madefor_Display({subsets: ['latin']});

const LocaleLayout = async ({
  children,
  params: {locale},
}: {
  children: React.ReactNode;
  params: { locale: string };
}) => {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} flex flex-col min-h-screen bg-gradient-background`}>

        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Header />
            <main className="flex-grow py-6 md:py-12 justify-stretch w-full items-stretch flex">
              {children}
            </main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;