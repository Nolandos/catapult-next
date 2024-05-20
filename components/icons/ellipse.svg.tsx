import {clsx} from 'clsx';

import {IconProperties} from './iconProperties';

export const EllipseIcon = ({className}: IconProperties) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="125"
    height="125"
    viewBox="0 0 140 140"
    className={clsx('text-white stroke-white', className)}
  >
    <defs>
      <filter id="blur" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="7.5" />
      </filter>
      <radialGradient id="grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(70 70) rotate(90) scale(47.5)">
        <stop offset="0.2" stopColor="white" />
        <stop offset="0.5" stopColor="#B0B0B0" />
        <stop offset="1" stopColor="#303030" />
      </radialGradient>
    </defs>
    <circle cx="70" cy="70" r="47.5" fill="url(#grad)" filter="url(#blur)" />
  </svg>
);
