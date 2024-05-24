import {clsx} from 'clsx';

import {IconProperties} from './iconProperties';

export const NewCardIcon = ({className}: IconProperties) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="19"
    viewBox="0 0 19 19"
    className={clsx('text-white stroke-white', className)}
  >
    <path
      d="M10.7143 1H15.5714C16.9127 1 18 2.08731 18 3.42857V15.5714C18 16.9127 16.9127 18 15.5714 18H3.42857C2.08727 18 1 16.9127 1 15.5714V9.80357M1 1H5.85714M1 1V5.85714M1 1L13.1429 13.1429"
      stroke="#F0BD2F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
