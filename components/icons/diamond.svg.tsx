import {clsx} from 'clsx';

import {IconProperties} from './iconProperties';

export const DiamondIcon = ({className}: IconProperties) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="22"
    viewBox="0 0 14 22"
    className={clsx('text-white', className)}
  >
    <path d="M13.6558 10.8392L7.05808 0.481689L0.442255 10.8392L7.04901 21.1938L13.6558 10.8392Z" fill="#A3A3A3" />
  </svg>
);
