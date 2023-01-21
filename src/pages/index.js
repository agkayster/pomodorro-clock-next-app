import React, { useState, useEffect, useCallback, useRef } from 'react';

export const SetTimer = ({ title, count, handleIncrease, handleDecrease }) => {
	let id = title.toLowerCase();
	return (
		<div className='m-5'>
			<h1
				id={`${id}-label`}
				className="font-['Open_Sans'] text-4xl text-center">
				{title} Length
			</h1>
			<div className='flex flex-row items-center justify-center p-4 space-x-2 text-xl'>
				<button id={`${id}-increment`} onClick={handleIncrease}>
					⬆️
				</button>
				<span
					id={`${id}-length`}
					className={`text-4xl w-12 ${
						count < 10 ? 'px-2.5' : 'px-0.5'
					}`}>
					{count}
				</span>
				<button id={`${id}-decrement`} onClick={handleDecrease}>
					⬇️
				</button>
			</div>
		</div>
	);
};

export default function Home() {
	/* url for audio alarm */
	let url =
		'http://www.peter-weinberg.com/files/1014/8073/6015/BeepSound.wav';

	/* Create state for both counts */
	const [breakCount, setBreakCount] = useState(5);
	const [sessionCount, setSessionCount] = useState(25);
	const [clockCount, setClockCount] = useState(1 * 60);
	const [currentTimer, setCurrentTimer] = useState('Session');
	const [isPlaying, setIsPlaying] = useState(false);
	const [audioSound, setAudioSound] = useState(false);

	/* new Audio() is a constructor function(creating objects), creates and returns HTMLAudioElement.
  URL is the variable assigned the link of the sound/audio to be played */
	const audio = useRef(
		typeof Audio !== 'undefined' ? new Audio(url) : undefined
	);

	/* always place timerId and setInterval inside useEffect or ComponentDidMount 
   When you click on the handlePlay button, it causes the DOM to load and render, then the count down begins*/
	useEffect(() => {
		let timerId = null;

		if (isPlaying) {
			timerId = setInterval(() => {
				/* once clock counts downwards to 0, "Session" should change to "Break" and break count down should begin */
				if (clockCount === 0) {
					setCurrentTimer(
						currentTimer === 'Session' ? 'Break' : 'Session'
					);
					/* break count down begins here */
					setClockCount(
						currentTimer === 'Session'
							? breakCount * 60
							: sessionCount * 60
					);
					/* play alarm when clock count goes to 0 */
					audio.current?.play();
				} else {
					setClockCount(clockCount - 1);
				}
			}, 1000);
		} else {
			clearInterval(timerId);
		}
		return () => {
			clearInterval(timerId);
		};
	}, [
		isPlaying,
		clockCount,
		currentTimer,
		breakCount,
		sessionCount,
		url,
		audioSound,
	]);

	/* Create even handlers for increase and decrease of counts */
	const handleBreakCountIncrease = () => {
		if (isPlaying && currentTimer === 'Break') {
			return;
		} else {
			/* break count lenght should stop at 60 */
			setBreakCount(breakCount < 60 ? breakCount + 1 : 60);
			setClockCount((breakCount + 1) * 60);
		}
	};

	const handleBreakCountDecrease = () => {
		if (isPlaying && currentTimer === 'Break') {
			return;
		} else {
			/* break count should not go below 0 */
			setBreakCount(breakCount > 0 ? breakCount - 1 : 0);
			setClockCount((breakCount - 1) * 60);
		}
	};

	const handleSessionCountIncrease = () => {
		/* if count down has started, we should not be able to increase count */
		if (isPlaying && currentTimer === 'Session') {
			return;
		} else {
			setSessionCount(sessionCount < 60 ? sessionCount + 1 : 60);
			setClockCount((sessionCount + 1) * 60);
		}
	};

	const handleSessionCountDecrease = () => {
		/* if count down has started, we should not be able to decrease count */
		if (isPlaying && currentTimer === 'Session') {
			return;
		} else {
			setSessionCount(sessionCount > 0 ? sessionCount - 1 : 0);
			setClockCount((sessionCount - 1) * 60);
		}
	};

	/* Put break props in an object */
	let breakProps = {
		title: 'Break',
		count: breakCount,
		handleIncrease: handleBreakCountIncrease,
		handleDecrease: handleBreakCountDecrease,
	};

	/* Put session props in an object */
	let sessionProps = {
		title: 'Session',
		count: sessionCount,
		handleIncrease: handleSessionCountIncrease,
		handleDecrease: handleSessionCountDecrease,
	};

	/* Use this function convertToTime to get your stop watch timer */
	function convertToTime(count) {
		let minutes = Math.floor(count / 60);
		let seconds = count % 60;

		seconds = seconds < 10 ? '0' + seconds : seconds;
		minutes = minutes < 10 ? '0' + minutes : minutes;

		return `${minutes}:${seconds}`;
	}

	/* handle the play and pause button to reduce the timer count down and pause the timer count down */
	const handlePlay = () => setIsPlaying(!isPlaying);

	/* handle the reset button. Clock count goes back to 25 * 60 */
	const handleReset = () => {
		setClockCount(25 * 60);
		setCurrentTimer('Session');
		setIsPlaying(false);
		setBreakCount(5);
		setSessionCount(25);
		audio.current?.pause();
		audio.currentTime = 0;
	};

	// console.log('get clock count =>', clockCount);

	return (
		<div className='relative'>
			<div className='flex flex-row'>
				{/* spread break props and session props into the child component */}
				<SetTimer {...breakProps} />
				<SetTimer {...sessionProps} />
			</div>
			<div className='border-2 w-60 p-10 absolute left-36 text-4xl text-center rounded-[28px]'>
				<h1 id='timer-label'>{currentTimer}</h1>
				<p id='time-left'>{convertToTime(clockCount)}</p>
			</div>
			<div className='flex flex-row items-end absolute top-[21rem] left-60'>
				<button id='start_stop' onClick={handlePlay}>
					{isPlaying ? '⏸' : ' ▶️'}
				</button>
				<button id='reset' className='ml-2' onClick={handleReset}>
					🔄
				</button>
			</div>
		</div>
	);
}
// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from '@next/font/google'
// import styles from '@/styles/Home.module.css'

// const inter = Inter({ subsets: ['latin'] })

// export default function Home() {
//   return (
//     <>
//       <Head>
//         <title>Create Next App</title>
//         <meta name="description" content="Generated by create next app" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <main className={styles.main}>
//         <div className={styles.description}>
//           <p>
//             Get started by editing&nbsp;
//             <code className={styles.code}>pages/index.js</code>
//           </p>
//           <div>
//             <a
//               href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               By{' '}
//               <Image
//                 src="/vercel.svg"
//                 alt="Vercel Logo"
//                 className={styles.vercelLogo}
//                 width={100}
//                 height={24}
//                 priority
//               />
//             </a>
//           </div>
//         </div>

//         <div className={styles.center}>
//           <Image
//             className={styles.logo}
//             src="/next.svg"
//             alt="Next.js Logo"
//             width={180}
//             height={37}
//             priority
//           />
//           <div className={styles.thirteen}>
//             <Image
//               src="/thirteen.svg"
//               alt="13"
//               width={40}
//               height={31}
//               priority
//             />
//           </div>
//         </div>

//         <div className={styles.grid}>
//           <a
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <h2 className={inter.className}>
//               Docs <span>-&gt;</span>
//             </h2>
//             <p className={inter.className}>
//               Find in-depth information about Next.js features and&nbsp;API.
//             </p>
//           </a>

//           <a
//             href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <h2 className={inter.className}>
//               Learn <span>-&gt;</span>
//             </h2>
//             <p className={inter.className}>
//               Learn about Next.js in an interactive course with&nbsp;quizzes!
//             </p>
//           </a>

//           <a
//             href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <h2 className={inter.className}>
//               Templates <span>-&gt;</span>
//             </h2>
//             <p className={inter.className}>
//               Discover and deploy boilerplate example Next.js&nbsp;projects.
//             </p>
//           </a>

//           <a
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <h2 className={inter.className}>
//               Deploy <span>-&gt;</span>
//             </h2>
//             <p className={inter.className}>
//               Instantly deploy your Next.js site to a shareable URL
//               with&nbsp;Vercel.
//             </p>
//           </a>
//         </div>
//       </main>
//     </>
//   )
// }
