/* eslint-disable react/prop-types */
import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import {cn} from '@/lib/utils';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({
  className,
  value,
  ...properties
}, reference) => (
  <ProgressPrimitive.Root
    ref={reference}
    className={cn(
      'relative h-8 w-full overflow-hidden flex items-center justify-center rounded-xl bg-[#202020] border border-white',
      className,
    )}
    {...properties}
  >
    {typeof value === 'number' && (
      <span className="relative z-10 font-semibold text-lg text-white">
        {Math.round((value + Number.EPSILON) * 100) / 100}
        %
      </span>
    )}
    <ProgressPrimitive.Indicator
      className="absolute top-0 left-0 h-full bg-[#45D001] transition-all"
      style={{
        width: `${value}%`,
      }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export {Progress};
