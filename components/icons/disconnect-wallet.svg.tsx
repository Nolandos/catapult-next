import {clsx} from 'clsx';

import {IconProperties} from './iconProperties';

export const DisconnectWalletIcon = ({className}: IconProperties) => (
  <svg
    data-name="Group 1490"
    xmlns="http://www.w3.org/2000/svg"
    width="97.385"
    height="67.782"
    viewBox="0 0 97.385 67.782"
    className={clsx('text-white stroke-white', className)}
  >
    <defs>
      <clipPath id="wallet-disconnect_svg__a">
        <rect
          data-name="Rectangle 765"
          width="15.424"
          height="15.425"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      </clipPath>
    </defs>
    <g data-name="Group 1489" transform="translate(0.5 0.5)">
      <rect
        data-name="Rectangle 1474"
        width="52.526"
        height="32.592"
        rx="3.895"
        transform="translate(0 34.19)"
        fill="none"
        strokeWidth="1"
      />
      <path
        data-name="Path 3477"
        d="M49.156,48.228H81.4A11.617,11.617,0,1,0,77.426,25.7c.011-.238.036-.472.036-.711A15.527,15.527,0,0,0,61.936,9.466H61.9a17.878,17.878,0,0,0-33.239,6.7c-.362-.024-.724-.055-1.093-.055a16.066,16.066,0,0,0-15.9,18.334"
        transform="translate(3.371 -0.5)"
        fill="none"
        strokeWidth="1"
      />
      <path
        data-name="Path 3478"
        d="M11.715,34.67H.5v8.607H11.715a4.3,4.3,0,0,0,0-8.607Z"
        transform="translate(-0.5 11.513)"
        fill="none"
        strokeWidth="1"
      />
      <circle
        data-name="Ellipse 114"
        cx="1.687"
        cy="1.687"
        r="1.687"
        transform="translate(9.479 48.799)"
        fill="none"
        strokeWidth="1"
      />
      <g data-name="Group 1491" transform="translate(26.263 42.773)">
        <g
          data-name="Group 1403"
          transform="translate(0 0)"
          clipPath="url(#wallet-disconnect_svg__a)"
        >
          <path
            data-name="Path 3330"
            d="M15.2,2.743,12.96.5,7.852,5.609,2.743.5.5,2.743,5.609,7.851.5,12.96,2.743,15.2l5.109-5.109L12.96,15.2,15.2,12.96,10.095,7.851Z"
            transform="translate(-0.139 -0.138)"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
          />
        </g>
      </g>
    </g>
  </svg>
);
