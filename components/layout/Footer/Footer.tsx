import {LogoCatapult} from '@/components/icons';
import Link from 'next/link';
import urls from '@/utils/urls';
import {useTranslations} from 'next-intl';

const Footer = () => {
  const t = useTranslations('');
  const {
    home,
    twitterCatamoto,
    telegramMatoto,
  } = urls;
  const links: { label: string, href: string }[] = [
    {
      label: t('footer.twitterCatamotoLink'),
      href: twitterCatamoto,
    },
    {
      label: t('footer.telegramCatomotoLink'),
      href: telegramMatoto,
    },
  ];

  return (
    <footer className="flex items-center justify-center flex-col border-t border-y-600 px-4 pt-8 pb-12 md:px-10 bg-[#1E1F2480]">
      <div className="flex justify-between md:items-center w-full flex-col md:flex-row items-start gap-6">
        <Link href={home} className="flex items-center gap-4">
          <div className="w-10 h-10 object-contain">
            <LogoCatapult size={41} />
          </div>

          <span className="uppercase text-white font-medium">{t('common.catapult')}</span>
        </Link>

        <div className="hidden items-center justify-center flex-wrap md:gap-8 md:flex">
          {links.map(({
            label,
            href,
          }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-neutral-100 underline-offset-4 hover:underline"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-7 md:mt-0">
        <p>
          {t('common.catomoto')}
          {' '}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
