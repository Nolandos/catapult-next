import {Card, CardContent} from '@/components/ui/card';
import Image from 'next/image';
import Button from '@/components/ui/button';
import {useTranslations} from 'next-intl';
import Link from 'next/link';
import {FC} from 'react';
import {Project} from '@/utils/types.common';
import urls from '@/utils/urls';
import {CryptoCurrencyFormatter} from '@/components/common/Formatters';
import {reverse} from 'named-urls';
import {CountdownTimer} from '@/components/common/Countdown';
import {clsx} from 'clsx';

type LiveAndOngoingProjectsCardTypes = {
  project: Project
}
const ellipsisStyles = clsx('overflow-hidden whitespace-nowrap text-ellipsis');
const counterStyles = clsx(`${ellipsisStyles} text-xl font-bold mt-1 max-[374px]:w-[100px]`);
const subCardStyles = clsx('flex px-4 w-full max-w-[355px] py-2 bg-gradient-card-secondary border border-g-500 rounded-[15px] lg:px-8 md:max-w-[425px] lg:max-w-[415px] lg:h-[80px]');

const LiveAndOngoingProjectsCard: FC<LiveAndOngoingProjectsCardTypes> = ({
  project,
}) => {
  const t = useTranslations('Index.liveAndOngoingProjects');
  const {projects: {details: {show: showUrl}}} = urls;

  const {
    attributes: {
      name,
      blockchain,
      totalRaise,
      initialMarketCap,
      slug,
      idoStarts,
      idoEnds,
      image: {
        data: {
          attributes,
          attributes: {
            formats: {
              small,
            },
          },
        },
      },
    },
  } = project;

  const imageUrl = `${process.env.NEXT_PUBLIC_CMS_ADDRESS}${small?.url || attributes?.url || ''}` || '';

  return (
    <Card
      className="mb-6 min-h-[360px] w-full max-w-[525px] justify-center flex items-center bg-gradient-card shadow-card-shadow card-with-border md:max-w-[550px] lg:max-w-[1150px]"
    >
      <CardContent className="p-3 flex flex-col w-full items-center justify-center lg:flex-row lg:w-full lg:p-6">
        <div className="flex w-full h-[250px] items-center lg:min-w-[472px] lg:w-2/4 lg:h-full">
          <div className="flex w-full w-max-[355px] h-[250px] justify-center items-center overflow-hidden rounded-[15px] lg:w-[540px] lg:h-max-[320px]">
            <Image
              className="rounded-[15px] h-[250px] lg:h-full"
              src={imageUrl}
              alt={`${slug}-img`}
              width={small?.width || attributes?.width || 540}
              height={small?.height || attributes?.height || 320}
            />
          </div>
        </div>
        <div className="flex flex-col w-full h-full items-center lg:min-w-[415px] lg:w-2/4">
          <h3 className="font-bold uppercase text-2xl mt-3.5 lg:w-[415px] lg:pl-[40px]">
            {name}
            <span className="font-normal text-base ml-2">
              (
              {blockchain}
              )
            </span>
          </h3>
          <Card
            className={`mt-6 ${subCardStyles}`}
          >
            <div
              className="flex flex-col relative w-2/4 h-full before:after-[''] before:absolute before:h-full before:w-[1px] before:bg-g-500 before:right-0"
            >
              <p className={ellipsisStyles}>
                {t('totalRiseLabel')}
                :
              </p>
              <p className={`text-xl font-bold mt-1 ${ellipsisStyles}`}>
                $
                <CryptoCurrencyFormatter value={parseFloat(totalRaise)} currency="" />
              </p>
            </div>
            <div
              className="flex flex-col pl-3.5 relative w-2/4 h-full lg:pl-5"
            >
              <p className={ellipsisStyles}>
                {t('initialMarketCapLabel')}
                :
              </p>
              <p className={`text-xl font-bold mt-1 ${ellipsisStyles}`}>
                $
                <CryptoCurrencyFormatter value={parseFloat(initialMarketCap)} currency="" />
              </p>
            </div>
          </Card>
          <Card
            className={`mt-3 ${subCardStyles}`}
          >
            <div
              className="flex flex-col relative w-2/4 h-full before:after-[''] before:absolute before:h-full before:w-[1px] before:bg-g-500 before:right-0"
            >
              <p className={ellipsisStyles}>
                {t('startsInLabel')}
                :
              </p>
              <p
                suppressHydrationWarning
                className={`${counterStyles} text-y-500`}
              >
                <CountdownTimer targetDate={new Date(idoStarts).getTime()} />
              </p>
            </div>
            <div
              className="flex flex-col pl-3.5 relative w-2/4 h-full lg:pl-5"
            >
              <p className={ellipsisStyles}>
                {t('endsInLabel')}
                :
              </p>
              <p
                suppressHydrationWarning
                className={`${counterStyles} text-c-500`}
              >
                <CountdownTimer targetDate={new Date(idoEnds).getTime()} />
              </p>
            </div>
          </Card>
          <div className="flex justify-center pt-7 lg:w-full z-10">
            <Button variant="default" asChild>
              <Link href={
                reverse(showUrl, {slug})
              }
              >
                {t('participateBtn')}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveAndOngoingProjectsCard;
