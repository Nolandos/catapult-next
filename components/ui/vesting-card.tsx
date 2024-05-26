'use client';

/* eslint-disable jsx-a11y/heading-has-content */
import * as React from 'react';

import {cn} from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({
  className,
  ...properties
}, reference) => (
  <div
    ref={reference}
    className={cn(
      'rounded-3xl text-center flex flex-col items-center',
      'p-[2px] bg-gradient-to-br from-primary to-yellow-500',
      className,
    )}
  >
    <div
      {...properties}
      className="flex flex-col bg-[#202020] w-full h-full text-[#ffffff] bg-opacity-90 rounded-3xl text-center items-center"
    />
  </div>
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({
  className,
  ...properties
}, reference) => (
  <div
    ref={reference}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...properties}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({
  className,
  ...properties
}, reference) => (
  <h3
    ref={reference}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className,
    )}
    {...properties}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({
  className,
  ...properties
}, reference) => (
  <p
    ref={reference}
    className={cn('text-sm text-muted-foreground', className)}
    {...properties}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({
  className,
  ...properties
}, reference) => (
  <div
    ref={reference}
    className={cn(
      'p-6 pt-0 flex flex-col items-center justify-center gap-4',
      className,
    )}
    {...properties}
  />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({
  className,
  ...properties
}, reference) => (
  <div
    ref={reference}
    className={cn('flex items-center p-6 pt-0', className)}
    {...properties}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
};
