import {getTranslations} from 'next-intl/server';
import localFont from 'next/font/local';
import LiveAndOngoingProjectsCard from '@/components/page/index/LiveAndOngoingProjectsCard/LiveAndOngoingProjectsCard';
import {getParticipateInformation, getProjects} from '@/lib/strapi/project';
import {ParticipateInformation, Project} from '@/utils/types.common';
import {clsx} from 'clsx';
import EndedProject from '@/components/page/index/EndedProject/EndedProject';
import ParticipateInfoCard from '@/components/page/index/ParticipateInfoCard/ParticipateInfoCard';
import Button from '@/components/ui/button';
import urls from '@/utils/urls';
import Link from 'next/link';

const namecat = localFont({src: '../../public/assets/fonts/Namecat.ttf'});
const sectionStyles = clsx('container flex flex-col items-center min-h-[400px] mb-8');

const Index = async () => {
  const t = await getTranslations('Index');
  const projectResponse: Project[] | null = await getProjects();
  const participateInformationResponse: ParticipateInformation[] | null = await getParticipateInformation();
  const {
    getListed,
  } = urls;

  const checkDate = (isoDate: string) => {
    const now = new Date();
    const convertISO = new Date(isoDate);
    return convertISO >= now;
  };

  const liveAndOngoingProjects: Project[] | undefined = projectResponse
    ?.filter(({
      attributes: {idoEnds},
    }) => checkDate(idoEnds));

  const endedProject: Project[] | undefined = projectResponse
    ?.filter(({
      attributes: {idoEnds},
    }) => !checkDate(idoEnds));

  const compareDates = (a: Project, b: Project) => new Date(a.attributes.idoStarts).getTime() - new Date(b.attributes.idoStarts).getTime();
  const compareParticipate = (a: ParticipateInformation, b: ParticipateInformation) => a.attributes.ordinalNumber - b.attributes.ordinalNumber;

  return (
    <div id="index-page" className="flex flex-col gap-7">
      <section id="hero" className="flex flex-col justify-center items-center bg-hero bg-cover w-full bg-no-repeat bg-center h-[440px]">
        <h1 className={`${namecat.className} uppercase text-yellow-500 text-4xl md:text-[64px] mb-6 text-center`}>
          {t('hero.title')}
        </h1>
        <p>{t('hero.subtitle')}</p>
      </section>
      {(liveAndOngoingProjects && liveAndOngoingProjects.length > 0) && (
        <section id="live-and-ongoing projects" className={sectionStyles}>
          <h2 className="w-full max-w-[1220px] text-4xl font-bold mb-11 ">
            {t('liveAndOngoingProjects.title')}
            :
          </h2>
          {liveAndOngoingProjects
            ?.sort(compareDates)
            ?.map((project) => (
              <LiveAndOngoingProjectsCard key={project.id} project={project} />
            ))}
        </section>
      )}
      {(endedProject && endedProject.length > 0) && (
        <section id="ended-projects" className={sectionStyles}>
          <h2 className="w-full max-w-[1220px] text-4xl font-bold mb-11 ">
            {t('endedProjects.title')}
            :
          </h2>
          <EndedProject endedProjects={endedProject?.sort(compareDates)} />
        </section>
      )}
      <section id="how-to-participate" className={sectionStyles}>
        <h2 className="w-full max-w-[1220px] text-4xl font-bold mb-6 ">
          {t('howToParticipate.title')}
          :
        </h2>
        <div className="w-full flex justify-center flex-wrap">
          {participateInformationResponse?.sort(compareParticipate)
            .map(({
              id,
              attributes,
            }) => (
              <ParticipateInfoCard
                key={id}
                participateInfo={attributes}
              />
            ))}
          <p
            className="pl-[10px] relative before:content-[''] before:absolute before:rounded-full before:h-[5px] before:w-[5px] before:bg-white before:left-0 before:top-[10px] w-full max-w-[1220px] text-left mt-[12px]"
          >
            {t('howToParticipate.annotation')}
          </p>
        </div>
        <div className="mt-12">
          <Button variant="outline" asChild>
            <Link
              href={getListed}
              target="_blank"
              rel="noreferrer"
            >
              {t('howToParticipate.getListed')}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
