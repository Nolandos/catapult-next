import {getTranslations} from 'next-intl/server';
import localFont from 'next/font/local';
import LiveAndOngoingProjectsCard from '@/components/page/index/LiveAndOngoingProjectsCard/LiveAndOngoingProjectsCard';
import {getProjects} from '@/lib/strapi/project';
import {Project} from '@/utils/types.common';

const namecat = localFont({src: '../../public/assets/fonts/Namecat.ttf'});

const Index = async () => {
  const t = await getTranslations('Index');
  const response: Project[] = await getProjects();

  const checkDate = (isoDate: string) => {
    const now = new Date();
    const convertISO = new Date(isoDate);
    return convertISO >= now;
  };

  const compareDates = (a: Project, b: Project) => new Date(a.attributes.idoStarts).getTime() - new Date(b.attributes.idoStarts).getTime();

  return (
    <div id="index-page" className="flex flex-col gap-7">
      <section id="hero" className="flex flex-col justify-center items-center bg-hero bg-cover w-full bg-no-repeat bg-center h-[440px]">
        <h1 className={`${namecat.className} uppercase text-yellow-500 text-4xl md:text-[64px] mb-6 text-center`}>
          {t('hero.title')}
        </h1>
        <p>{t('hero.subtitle')}</p>
      </section>
      <section id="live-and-ongoing projects" className="container flex flex-col items-center">
        <h2 className="w-full text-4xl font-bold mb-11 pl-8">
          {t('liveAndOngoingProjects.title')}
          :
        </h2>
        {response
          .filter(({attributes: {idoEnds}}) => checkDate(idoEnds))
          .sort(compareDates)
          .map((project) => (
            <LiveAndOngoingProjectsCard project={project} />
          ))}
      </section>
    </div>
  );
};

export default Index;
