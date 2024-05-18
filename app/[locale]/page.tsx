import {useTranslations} from 'next-intl';
import localFont from 'next/font/local';

const namecat = localFont({src: '../../public/assets/fonts/Namecat.ttf'});

const Index = () => {
  const t = useTranslations('Index');
  return (
    <section id="hero" className="flex flex-col justify-center items-center ml-4 mr-4 bg-hero bg-cover w-full bg-no-repeat bg-center h-[440px]">
      <h1 className={`${namecat.className} uppercase text-yellow-500 text-4xl md:text-[64px] mb-6 text-center`}>
        {t('hero.title')}
      </h1>

      <p>{t('hero.subtitle')}</p>
    </section>
  );
};

export default Index;
