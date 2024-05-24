import {Project} from '@/utils/types.common';
import {getProjectBySlug} from '@/lib/strapi/project';
import {FC, ReactNode} from 'react';
import Image from 'next/image';
import {
  DiscordIcon,
  GithubIcon, KakaoIcon, NetworkIcon, NewCardIcon, TelegramIcon, TwitterNewIcon,
} from '@/components/icons';
import {clsx} from 'clsx';
import Link from 'next/link';
import InfoChip from '@/components/page/project/InfoChip/InfoChip';
import {getTranslations} from 'next-intl/server';
import {CryptoCurrencyFormatter, formatChipDate} from '@/components/common/Formatters';
import {CURRENCY_ENUM, DATE_STATUS} from '@/utils/enums.common';
import {CountdownTimer} from '@/components/common/Countdown';
import InfoCard from '@/components/page/project/InfoCard/InfoCard';
import {cutAddress} from '@/utils/utils';
import {DiamondIcon} from '@/components/icons/diamond.svg';

type ProjectDetailsProps = {
  params: {
    slug: string;
  }
}

const socialsIcons: { name: string, icon: ReactNode }[] = [
  {
    name: 'network',
    icon: <NetworkIcon />,
  },
  {
    name: 'twitter',
    icon: <TwitterNewIcon />,
  },
  {
    name: 'telegram',
    icon: <TelegramIcon />,
  },
  {
    name: 'github',
    icon: <GithubIcon />,
  },
  {
    name: 'discord',
    icon: <DiscordIcon />,
  },
  {
    name: 'kakao',
    icon: <KakaoIcon />,
  },
];

const ProjectDetails: FC<ProjectDetailsProps> = async ({params}) => {
  const t = await getTranslations('Project');
  const {slug} = params;
  const {USDT} = CURRENCY_ENUM;
  const {
    DURING,
    BEFORE,
    AFTER,
  } = DATE_STATUS;
  const {
    attributes: {
      name,
      shortDescription,
      description,
      socialLinks,
      idoStarts,
      idoEnds,
      listing,
      claimStarts,
      blockchain,
      totalSupply,
      initialMarketCap,
      fullyDilutedMarketCap,
      launchPrice,
      tokenAddress,
      totalLockedCATA,
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
    },
  }: Project = await getProjectBySlug(slug);

  const setDateStatuses = (inputDate: string, toCompareDate: string) => {
    const now = new Date();
    const convertInputDate = new Date(inputDate);
    const convertToCompareDate = new Date(toCompareDate);

    if (now > convertToCompareDate && now <= convertInputDate) return DURING;
    if (now > convertInputDate && now > convertToCompareDate) return AFTER;
    return BEFORE;
  };

  const chipsData: { id: string, label: string, value: string, status: DATE_STATUS }[] = [
    {
      id: 'idoStarts',
      label: t('chips.idoStarts'),
      value: idoStarts,
      status: new Date(idoStarts) >= new Date() ? DURING : AFTER,
    },
    {
      id: 'idoEnds',
      label: t('chips.idoEnds'),
      value: idoEnds,
      status: setDateStatuses(idoEnds, idoStarts),
    },
    {
      id: 'claimStarts',
      label: t('chips.claimStarts'),
      value: claimStarts,
      status: setDateStatuses(claimStarts, idoEnds),
    },
    {
      id: 'listing',
      label: t('chips.listing'),
      value: listing,
      status: setDateStatuses(listing, claimStarts),
    },
  ];
  const cardsData: {
    id: string,
    label: string | ReactNode,
    value: string | ReactNode,
    hidden?: boolean,
    ongoingStatus?: boolean
  }[] = [
    {
      id: 'blockchain',
      label: t('cards.blockchain'),
      value: <span className="uppercase">{blockchain}</span>,
    },
    {
      id: 'totalSupply',
      label: t('cards.totalSupply'),
      value: <CryptoCurrencyFormatter value={parseFloat(totalSupply)} currency="" />,
    },
    {
      id: 'initialMarketCap',
      label: t('cards.initialMarketCap'),
      value: <CryptoCurrencyFormatter value={parseFloat(initialMarketCap)} currency={USDT} />,
    },
    {
      id: 'fullyDilutedMarketCap',
      label: t('cards.fullyDilutedMarketCap'),
      value: <CryptoCurrencyFormatter value={parseFloat(fullyDilutedMarketCap)} currency={USDT} />,
    },
    {
      id: 'launchPrice',
      label: t('cards.launchPrice'),
      value: launchPrice,
    },
    {
      id: 'tokenAddress',
      label: t('cards.tokenAddress'),
      value: (tokenAddress && tokenAddress.trim() !== '') ? (
        <div className="w-full flex justify-end text-y-500">
          <Link
            href={socialLinks?.network || ''}
            target="_blank"
            rel="noreferrer"
          >
            <NewCardIcon />
          </Link>
          <span className="ml-[16px]">{cutAddress(tokenAddress)}</span>
        </div>
      ) : <span className="ml-[16px]">{t('cards.tbaInfo')}</span>,
    },
    {
      id: 'endsIn',
      label: new Date(idoEnds) >= new Date() ? t('cards.endsIn') : t('cards.endedInfo'),
      value: (
        <span className="text-c-500" suppressHydrationWarning>
          {new Date(idoEnds) >= new Date() ? <CountdownTimer targetDate={new Date(idoEnds).getTime()} /> : ''}
        </span>
      ),
      ongoingStatus: new Date(idoEnds) >= new Date() && new Date() > new Date(idoStarts),
    },
    {
      id: 'totalLockedCATA',
      label: t('cards.totalLockedCATA'),
      value: (
        (totalLockedCATA && totalLockedCATA.trim() !== '')
          ? <CryptoCurrencyFormatter value={parseFloat(totalLockedCATA)} currency="" />
          : <span>{t('cards.calculatingInfo')}</span>
      ),
      hidden: new Date(idoEnds) >= new Date(),
      ongoingStatus: new Date(idoEnds) <= new Date(),
    },
  ];

  const imageUrl = `${process.env.NEXT_PUBLIC_CMS_ADDRESS}${thumbnail?.url || url || ''}` || '';

  const socialStyles = clsx('rounded-full bg-[#D9D9D980] w-[32px] h-[32px] mr-[13px] flex items-center justify-center hover:bg-c-600 last:mr-[0]');
  return (
    <div id="project-details" className="flex flex-col container px-4 md:px-8">
      <header className="w-full flex flex-wrap mt-[46px] px-3.5 max-[425px]:justify-center">
        <div
          className="border border-[#1B1C1D] rounded-full relative w-[80px] h-[80px] overflow-hidden"
        >
          <Image
            className="object-cover"
            src={imageUrl}
            layout="fill"
            alt={`${name}-img`}
          />
        </div>
        <div className="ml-[40px] max-[425px]:mt-4 max-[425px]:ml-[0px]">
          <h1 className="font-extrabold text-4xl max-[425px]:text-center max-[425px]:mb-[8px]">{name}</h1>
          <div className="flex mt-[8px] max-[425px]:justify-center">
            {socialLinks && socialsIcons.filter(({name: iconName}) => !!(socialLinks[`${iconName}`] && socialLinks[`${iconName}`]?.trim() !== ''))
              .map(({
                name: iconName,
                icon,
              }) => (
                <Link
                  key={iconName}
                  className={socialStyles}
                  href={socialLinks[`${iconName}`]}
                  target="_blank"
                  rel="noreferrer"
                >
                  {icon}
                </Link>
              ))}
          </div>
        </div>
      </header>
      <div className="w-full flex flex-wrap mt-[32px]">
        <div
          className="w-[calc(60%-20px)] min-w-[555px] mr-[18px] mb-[18px] max-[1250px]:w-[100%] max-[1250px]:mr-[0] max-[1250px]:min-w-[0]"
        >
          <p className="w-full text-[#FFFFFFBF] text-sm">
            {shortDescription}
          </p>
          <div className="flex gap-3 mt-[20px] flex-wrap justify-center md:w-full md:justify-start">
            {chipsData?.map(({
              id,
              label,
              value,
              status,
            }) => (
              <InfoChip
                key={id}
                className={`
                  ${status === BEFORE ? 'text-g-400 border-g-400' : ''}
                  ${status === DURING ? 'text-y-500 border-y-500' : ''}
                  ${status === AFTER ? 'text-g-600 border-g-600' : ''}
                `}
              >
                <div className="h-full flex flex-col items-center w-[240px] md:w-full">
                  <span className="text-[20px] font-bold">{label}</span>
                  <span className="text-[14px]">{formatChipDate(value)}</span>
                </div>
              </InfoChip>
            ))}

          </div>
          <div className="mt-5">
            <h2 className="font-bold text-2xl mb-4">
              {t('overviewTitle')}
              :
              {' '}
            </h2>
            <p>{description}</p>
          </div>
        </div>
        <div
          className="w-[calc(40%-20px)] min-w-[450px] ml-[18px] max-[1250px]:w-[100%] max-[1250px]:ml-[0] max-[1250px]:min-w-[0]"
        >
          <div className="w-full flex flex-wrap gap-[7px] max-[550px]:justify-center">
            {cardsData.filter(({hidden}) => !hidden)
              .map(({
                id,
                ...cardData
              }) => (
                <InfoCard key={id} info={cardData} />
              ))}
          </div>
          <div className="w-full max-w-[450px] flex justify-center max-[1250px]:max-w-[100%] mt-[36px]">
            <div
              className="
                relative w-full max-w-[320px] flex justify-center items-center mt-4 mb-[7px]
                before:content-[''] before:absolute before:h-[1px] before:w-[125px] before:bg-c-500 before:left-0
                after:content-[''] after:absolute after:h-[1px] after:w-[125px] after:bg-c-500 after:right-0"
            >
              <DiamondIcon className="[&>path]:fill-c-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
