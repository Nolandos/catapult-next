'use client';

import React, {FC} from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {Project} from '@/utils/types.common';
import {clsx} from 'clsx';
import EndedProjectCard from '@/components/page/index/EndedProject/EndedProjectCard/EndedProjectCard';

type EndedProjectProps = {
  endedProjects: Project[] | undefined
};

const EndedProject: FC<EndedProjectProps> = ({endedProjects}) => {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 3500,
    slidesToShow: (endedProjects && endedProjects?.length < 3) ? endedProjects?.length : 3,
    slidesToScroll: 3,
    nextArrow: <ChevronRight />,
    prevArrow: <ChevronLeft />,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 420,
        settings: {
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const endedProjectSlider = clsx(
    'ended-project-slider w-full md:m-h-[550px] flex flex-col items-center overflow-x-hidden',
  );

  return (
    <div className={endedProjectSlider}>
      {endedProjects && endedProjects.length > 0
        && (
          <Slider className="w-[100%] max-w-[310px] h-[350px] md:h-[520px] md:max-w-[none] md:w-[75%] lg:w-[760px] xl:w-[1140px]" {...settings}>
            {endedProjects?.map(({
              id,
              attributes,
            }) => (
              <div key={id} className="h-[350px] md:h-[520px] w-full test">
                <div className="flex h-full w-full justify-center items-center">
                  <EndedProjectCard project={attributes} />
                </div>
              </div>
            ))}
          </Slider>
        )}
    </div>
  );
};

export default EndedProject;
