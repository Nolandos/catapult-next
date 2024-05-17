import {useTranslations} from 'next-intl';

const Index = () => {
  const t = useTranslations('Index');
  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold text-red-600">
        {t('title')}
      </h1>
    </div>
  );
};

export default Index;
