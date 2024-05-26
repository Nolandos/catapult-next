'use client';

// import { useContext } from 'react'
// import Countdown from 'react-countdown'

// import { formatTimePad } from '@/lib/format-time-pad'
// import { PresaleContext } from '@/providers/presale-provider'

interface TgeTimerProperties {
  timestamp: number;
}

export const TgeTimer = ({timestamp}: TgeTimerProperties) => (
// const { fetchPresaleData } = useContext(PresaleContext)

  <p className="hidden">{timestamp}</p>
);

// const renderer = ({
//   days,
//   hours,
//   minutes,
//   seconds,
//   completed,
// }: {
//   days: number
//   hours: number
//   minutes: number
//   seconds: number
//   completed: boolean
// }) => {
//   if (completed) {
//     return
//   } else {
//     // Render a countdown
//     return (
//       <div className="w-full text-center mb-8 space-y-2">
//         <h2 className="text-3xl font-semibold uppercase">
//           CLAIM AVAILABLE IN
//         </h2>

//         <p className="text-2xl space-x-2">
//           {days > 0 && <span>{days} days</span>}
//           {formatUnit(hours, 'hours')}
//           {formatUnit(minutes, 'minutes')}
//           <span>{formatTimePad(seconds)} seconds</span>
//         </p>
//       </div>
//     )
//   }
// }

// const formatUnit = (value: number, name: string) =>
//   value > 0 && (
//     <span>
//       {formatTimePad(value)} {name}
//     </span>
//   )

// return (
//   Number(timestamp) + 3 > Date.now() && (
//     <Countdown
//       date={Number(timestamp) + 3}
//       renderer={renderer}
//       onComplete={() => fetchPresaleData()}
//     />
//   )
// )
