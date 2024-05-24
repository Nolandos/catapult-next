import Image from 'next/image';
import {Card, CardContent} from '@/components/ui/card';
import {Project} from '@/utils/types.common';
import {FC} from 'react';
import {DiamondIcon} from '@/components/icons/diamond.svg';
import Button from '@/components/ui/button';
import {useTranslations} from 'next-intl';
import {CryptoCurrencyFormatter} from '@/components/common/Formatters';
import Link from 'next/link';
import {reverse} from 'named-urls';
import urls from '@/utils/urls';

type EndedProjectCardProps = {
  project: Project['attributes']
}

const EndedProjectCard: FC<EndedProjectCardProps> = ({project}) => {
  const t = useTranslations('Index');
  const {projects: {details: {show: showUrl}}} = urls;
  const {
    name,
    totalRaise,
    allTimeHigh,
    oversubscribed,
    slug,
    image: {
      data: {
        attributes: {
          url,
          formats: {
            thumbnail,
          },
        },
      },
    },
  } = project;

  const imageUrl = `${process.env.NEXT_PUBLIC_CMS_ADDRESS}${thumbnail?.url || url || ''}` || '';

  return (
    <Card
      className="
        w-full h-full max-w-[310px] max-h-[350px] md:max-h-[520px] md:max-w-[350px]
        bg-ended-project-card-gradient shadow-ended-project-card-shadow border-2 border-[#575757] rounded-[30px]
      "
    >
      <CardContent className="p-3 pt-3 flex flex-col">
        <div className="hidden w-full h-[135px] justify-center items-center pt-3 md:flex">
          <div
            className="border border-[#1B1C1D] rounded-full relative w-[95px] h-[95px] overflow-hidden"
          >
            <Image
              className="object-cover"
              src={imageUrl}
              layout="fill"
              alt={`${name}-img`}
            />
          </div>
        </div>
        <h3 className="w-full flex justify-center items-center font-bold text-2xl mt-4 md:mt-6">{name}</h3>
        <div
          className="
          relative w-full flex justify-center items-center mt-4 mb-[7px] md:mt-6 md:mb-[12px]
          before:content-[''] before:absolute before:h-[1px] before:w-[125px] before:bg-g-500 before:left-0
          after:content-[''] after:absolute after:h-[1px] after:w-[125px] after:bg-g-500 after:right-0"
        >
          <DiamondIcon />
        </div>
        <div className="my-[9px] flex items-center justify-between text-xl">
          <span>{t('endedProjects.athLabel')}</span>
          <span>{allTimeHigh?.trim().length > 0 ? allTimeHigh : '-'}</span>
        </div>
        <div className="my-[9px] flex items-center justify-between text-xl">
          <span>{t('endedProjects.totalRaiseLabel')}</span>
          <span>
            $
            <CryptoCurrencyFormatter value={parseFloat(totalRaise)} currency="" />
          </span>
        </div>
        <div className="my-[9px] flex items-center justify-between text-xl">
          <span>{t('endedProjects.oversubscribedLabel')}</span>
          <span>
            {oversubscribed && oversubscribed.trim().length > 0
              ? (
                <>
                  <CryptoCurrencyFormatter value={parseFloat(oversubscribed)} currency="" />
                  %
                </>
              )
              : <span>-</span>}
          </span>
        </div>
        <div className="w-full flex justify-center mt-[26px]">
          <Button variant="outline" asChild>
            <Link href={
              reverse(showUrl, {slug})
            }
            >
              {t('endedProjects.detailsBtn')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EndedProjectCard;
