// @flow
import * as React from 'react';
import { motion } from 'framer-motion';

const transition = { duration: 0.35, ease: 'easeInOut' };
const leftpage = {
  rest: { transition, transform: 'rotate(0deg) translateX(0px) translateY(0px)' },
  hover: { transition, transform: 'rotate(-2deg) translateX(2px) translateY(-2px)' },
};
const rightpage = {
  rest: { transition, transform: 'rotate(0deg) translateX(0px) translateY(0px)' },
  hover: { transition, transform: 'rotate(2deg) translate(-2px, -2px)' },
};
const centerpage = {
  rest: { transition, transform: 'translateY(0px)' },
  hover: { transition, transform: 'translateY(-5px)' },
};
const left = {
  rest: { transition, transform: 'translate(0px, 0px) rotate(0deg)' },
  hover: { transition, transform: 'translate(-2px, -3px) rotate(-5deg)' },
};
const right = {
  rest: { transition, transform: 'translate(0px, 0px) rotate(0deg)' },
  hover: { transition, transform: 'translate(5px, -5px) rotate(-2deg)' },
};
const Illustration = () => {
  return (
    <motion.svg
      width="124"
      height="124"
      viewBox="0 0 124 124"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <motion.path
        transition={transition}
        style={{ transformOrigin: 'center' }}
        initial={{
          transform: 'scale(1)',
        }}
        animate={{
          transform: 'scale(0.95)',
        }}
        d="M62.0001 109C87.9575 109 109 87.9574 109 62C109 36.0426 87.9575 15 62.0001 15C36.0427 15 15.0001 36.0426 15.0001 62C15.0001 87.9574 36.0427 109 62.0001 109Z"
        fill="#E0EFFF"
      />
      <motion.path
        className="leftpage"
        variants={leftpage}
        d="M52.987 81.3838C53.055 81.637 53.0724 81.9012 53.0382 82.1611C53.0041 82.4211 52.919 82.6718 52.788 82.8989C52.6569 83.126 52.4824 83.325 52.2744 83.4846C52.0663 83.6442 51.8289 83.7613 51.5757 83.8291L25.6583 90.7726C25.4051 90.8405 25.1409 90.8579 24.881 90.8238C24.621 90.7896 24.3703 90.7046 24.1432 90.5735C23.9161 90.4424 23.7171 90.2679 23.5575 90.0599C23.3979 89.8519 23.2808 89.6145 23.2129 89.3612L14.9432 58.4877C14.8066 57.9757 14.8787 57.4304 15.1437 56.9715C15.4087 56.5126 15.845 56.1777 16.3568 56.0401L34.2749 51.241L46.8573 58.5051L52.987 81.3838Z"
        fill="white"
        stroke="#003670"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        className="leftpage"
        variants={leftpage}
        d="M34.2748 51.2388L36.9339 61.162L46.8571 58.5029L34.2748 51.2388Z"
        fill="#C2DFFF"
        stroke="#003670"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        className="leftpage"
        variants={leftpage}
        d="M27.2398 63.7168C27.4146 64.3399 27.4007 65.0008 27.1998 65.6159C26.999 66.2311 26.6203 66.7729 26.1116 67.1728C25.6029 67.5728 24.987 67.8129 24.3419 67.8628C23.6967 67.9128 23.0512 67.7703 22.487 67.4535C21.9228 67.1366 21.4652 66.6595 21.1721 66.0826C20.879 65.5057 20.7635 64.8548 20.8403 64.2123C20.917 63.5698 21.1826 62.9644 21.6034 62.4728C22.0241 61.9812 22.5812 61.6254 23.2042 61.4503C23.618 61.3341 24.0507 61.3005 24.4774 61.3515C24.9042 61.4025 25.3168 61.537 25.6916 61.7475C26.0663 61.958 26.396 62.2402 26.6616 62.5781C26.9273 62.916 27.1237 63.303 27.2398 63.7168Z"
        fill="white"
        stroke="#003670"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        className="leftpage"
        variants={leftpage}
        d="M26.9998 83.0416L29.4277 76.3185C29.5265 76.0455 29.6787 75.795 29.8755 75.5816C30.0723 75.3682 30.3097 75.1962 30.5738 75.0758C30.8379 74.9553 31.1234 74.8887 31.4136 74.88C31.7037 74.8713 31.9927 74.9206 32.2636 75.0249L35.2674 76.1898L37.067 70.047C37.176 69.6751 37.3821 69.3389 37.6641 69.0731C37.9461 68.8073 38.2938 68.6214 38.6715 68.5345C39.0491 68.4476 39.4431 68.463 39.8129 68.5789C40.1827 68.6948 40.5149 68.9071 40.7754 69.194L47.9981 77.1475L26.9998 83.0416Z"
        fill="#C2DFFF"
        stroke="#003670"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        className="rightpage"
        style={{ transformOrigin: 'right top' }}
        variants={rightpage}
        d="M102.842 89.3312C102.774 89.5844 102.657 89.8219 102.498 90.0299C102.338 90.238 102.139 90.4126 101.912 90.5437C101.685 90.6749 101.434 90.76 101.174 90.7942C100.914 90.8284 100.65 90.8111 100.397 90.7432L74.4802 83.7977C74.2269 83.7299 73.9895 83.6129 73.7814 83.4534C73.5734 83.2938 73.3988 83.0948 73.2676 82.8678C73.1365 82.6407 73.0514 82.3901 73.0172 82.1301C72.9829 81.8702 73.0003 81.606 73.0682 81.3528L81.3431 50.4806C81.4808 49.9689 81.8159 49.5327 82.2748 49.2679C82.7338 49.003 83.2791 48.931 83.7911 49.0678L101.708 53.8707L108.973 66.4528L102.842 89.3312Z"
        fill="white"
        stroke="#003670"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        className="rightpage"
        style={{ transformOrigin: 'right top' }}
        variants={rightpage}
        d="M101.709 53.8687L99.0504 63.792L108.974 66.4507L101.709 53.8687Z"
        fill="#C2DFFF"
        stroke="#003670"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        className="rightpage"
        style={{ transformOrigin: 'right top' }}
        variants={rightpage}
        d="M89.1692 64.0794C89.0241 63.945 88.8467 63.8504 88.6543 63.8049C88.4618 63.7595 88.2609 63.7646 88.071 63.8198C87.8811 63.8751 87.7087 63.9785 87.5707 64.1202C87.4327 64.2618 87.3337 64.4368 87.2834 64.628L84.838 73.9207C84.7877 74.112 84.7878 74.313 84.8382 74.5042C84.8886 74.6954 84.9877 74.8703 85.1258 75.0119C85.2639 75.1534 85.4363 75.2568 85.6263 75.312C85.8162 75.3671 86.0171 75.3721 86.2096 75.3265L96.1459 72.9724C96.3479 72.9246 96.5331 72.8227 96.6816 72.6778C96.8302 72.5328 96.9366 72.3502 96.9894 72.1495C97.0422 71.9488 97.0395 71.7375 96.9815 71.5382C96.9236 71.3389 96.8125 71.1591 96.6602 71.018L89.1692 64.0794Z"
        fill="#C2DFFF"
      />
      <motion.path
        className="rightpage"
        style={{ transformOrigin: 'right top' }}
        variants={rightpage}
        d="M89.1692 64.0794C89.0241 63.945 88.8467 63.8504 88.6543 63.8049C88.4618 63.7595 88.2609 63.7646 88.071 63.8198C87.8811 63.8751 87.7087 63.9785 87.5707 64.1202C87.4327 64.2618 87.3337 64.4368 87.2834 64.628L84.838 73.9207C84.7877 74.112 84.7878 74.313 84.8382 74.5042C84.8886 74.6954 84.9877 74.8703 85.1258 75.0119C85.2639 75.1534 85.4363 75.2568 85.6263 75.312C85.8162 75.3671 86.0171 75.3721 86.2096 75.3265L96.1459 72.9724C96.3479 72.9246 96.5331 72.8227 96.6816 72.6778C96.8302 72.5328 96.9366 72.3502 96.9894 72.1495C97.0422 71.9488 97.0395 71.7375 96.9815 71.5382C96.9236 71.3389 96.8125 71.1591 96.6602 71.018L89.1692 64.0794Z"
        stroke="#003670"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        className="centerpage"
        variants={centerpage}
        d="M82.7829 83.8774C82.7788 84.5801 82.496 85.2526 81.9967 85.7471C81.4973 86.2415 80.8222 86.5177 80.1194 86.5149L44.5453 86.3436C43.8427 86.3405 43.17 86.0585 42.6753 85.5596C42.1805 85.0606 41.9042 84.3856 41.9071 83.683L42.1095 41.2949C42.1126 40.5923 42.3947 39.9196 42.8936 39.4249C43.3926 38.9302 44.0676 38.6538 44.7702 38.6567L69.3704 38.7763L82.9302 52.4652L82.7829 83.8774Z"
        fill="white"
        stroke="#003670"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        className="centerpage"
        variants={centerpage}
        d="M69.3712 38.7732L69.3066 52.3975L82.931 52.4621L69.3712 38.7732Z"
        fill="#C2DFFF"
        stroke="#003670"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        className="centerpage"
        variants={centerpage}
        d="M48.8684 53.3139L62.4927 53.3785"
        stroke="#003670"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        className="centerpage"
        variants={centerpage}
        d="M48.8384 60.1235L74.9517 60.2485"
        stroke="#003670"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        className="centerpage"
        variants={centerpage}
        d="M48.8039 66.9379L74.9199 67.0636"
        stroke="#003670"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        className="left"
        variants={left}
        d="M36.5279 37.8503C36.5636 37.986 36.5723 38.1273 36.5535 38.2663C36.5346 38.4054 36.4886 38.5393 36.4179 38.6605C36.3473 38.7817 36.2535 38.8879 36.1419 38.9728C36.0302 39.0578 35.9029 39.1199 35.7673 39.1557L24.0564 42.2418C23.9207 42.2775 23.7794 42.2862 23.6404 42.2674C23.5013 42.2485 23.3674 42.2025 23.2462 42.1318C23.125 42.0612 23.0189 41.9674 22.9339 41.8558C22.8489 41.7441 22.7868 41.6168 22.751 41.4812L19.5154 29.2191C19.4796 29.0834 19.4709 28.9421 19.4898 28.8031C19.5086 28.664 19.5547 28.5301 19.6253 28.4089C19.6959 28.2877 19.7898 28.1816 19.9014 28.0966C20.013 28.0116 20.1403 27.9495 20.276 27.9137L31.9858 24.818C32.1214 24.7823 32.2628 24.7736 32.4018 24.7924C32.5408 24.8113 32.6748 24.8573 32.796 24.928C32.9172 24.9986 33.0233 25.0924 33.1083 25.204C33.1933 25.3157 33.2554 25.443 33.2912 25.5786L36.5279 37.8503Z"
        fill="white"
        stroke="#003670"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        className="left"
        variants={left}
        d="M31.452 27.1916L21.8991 29.7107L24.1532 38.2585L33.7061 35.7394L31.452 27.1916Z"
        fill="#C2DFFF"
        stroke="#003670"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        className="right"
        variants={right}
        d="M101.307 37.4984L89.3458 42.1398C89.223 42.1891 89.0901 42.2079 88.9584 42.1949C88.8267 42.1819 88.7001 42.1373 88.5893 42.065C82.8119 38.1109 80.9047 32.4997 80.0799 26.4182C80.0626 26.2434 80.1041 26.0679 80.198 25.9195C80.2918 25.771 80.4325 25.6582 80.5978 25.5989L92.4576 20.9965C92.5616 20.951 92.6745 20.9296 92.7878 20.9338C92.9012 20.938 93.0122 20.9677 93.1125 21.0208C93.2128 21.0739 93.2998 21.1489 93.367 21.2403C93.4343 21.3317 93.48 21.4371 93.5009 21.5486C94.3805 27.0767 97.1314 31.9656 101.601 36.2685C101.69 36.3586 101.754 36.4698 101.788 36.5917C101.822 36.7136 101.825 36.8422 101.795 36.9652C101.766 37.0883 101.705 37.2018 101.62 37.2951C101.534 37.3884 101.427 37.4583 101.307 37.4984Z"
        fill="white"
        stroke="#003670"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        className="right"
        variants={right}
        d="M85.066 33.1155L93.3472 29.9019"
        stroke="#003670"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        className="right"
        variants={right}
        d="M87.0101 36.0665L95.292 32.8527"
        stroke="#003670"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        className="right"
        variants={right}
        d="M89.2795 38.8919L97.5614 35.678"
        stroke="#003670"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        className="centerarrow"
        variants={centerpage}
        d="M70.5202 81.2908C70.1425 81.6683 69.6303 81.8804 69.0962 81.8804C68.5622 81.8804 68.05 81.6683 67.6723 81.2908L64.5647 78.1831V96.4825C64.5647 97.1502 64.2995 97.7905 63.8273 98.2626C63.3552 98.7348 62.7149 99 62.0472 99C61.3795 99 60.7392 98.7348 60.267 98.2626C59.7949 97.7905 59.5297 97.1502 59.5297 96.4825V78.1831L56.422 81.2908C56.0405 81.6486 55.5347 81.8439 55.0117 81.8354C54.4887 81.8269 53.9895 81.6152 53.6198 81.2452C53.25 80.8752 53.0387 80.3759 53.0306 79.8529C53.0225 79.3299 53.2182 78.8242 53.5762 78.4429L60.6253 71.3939C61.003 71.0163 61.5152 70.8042 62.0492 70.8042C62.5832 70.8042 63.0954 71.0163 63.4731 71.3939L70.5222 78.4429C70.8995 78.8209 71.1112 79.3332 71.1108 79.8673C71.1105 80.4013 70.898 80.9133 70.5202 81.2908Z"
        fill="#C2DFFF"
      />
      <motion.path
        className="centerarrow"
        variants={centerpage}
        d="M70.5202 81.2908C70.1425 81.6683 69.6303 81.8804 69.0962 81.8804C68.5622 81.8804 68.05 81.6683 67.6723 81.2908L64.5647 78.1831V96.4825C64.5647 97.1502 64.2995 97.7905 63.8273 98.2626C63.3552 98.7348 62.7149 99 62.0472 99C61.3795 99 60.7392 98.7348 60.267 98.2626C59.7949 97.7905 59.5297 97.1502 59.5297 96.4825V78.1831L56.422 81.2908C56.0405 81.6486 55.5347 81.8439 55.0117 81.8354C54.4887 81.8269 53.9895 81.6152 53.6198 81.2452C53.25 80.8752 53.0387 80.3759 53.0306 79.8529C53.0225 79.3299 53.2182 78.8242 53.5762 78.4429L60.6253 71.3939C61.003 71.0163 61.5152 70.8042 62.0492 70.8042C62.5832 70.8042 63.0954 71.0163 63.4731 71.3939L70.5222 78.4429C70.8995 78.8209 71.1112 79.3332 71.1108 79.8673C71.1105 80.4013 70.898 80.9133 70.5202 81.2908Z"
        fill="#C2DFFF"
        stroke="#003670"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
};

export default Illustration;
