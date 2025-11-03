import { FaPython, FaReact, FaVuejs, FaNodeJs } from 'react-icons/fa';
import {
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiFlutter,
  SiKotlin,
  SiNestjs,
  SiExpress,
  SiPrisma,
  SiGo,
  SiMysql,
} from 'react-icons/si';
import { TbBrandReactNative, TbBrandCpp } from 'react-icons/tb';
import { type ReactNode } from 'react';

export const skillIcons: { [key: string]: ReactNode } = {
  'Next.js': <SiNextdotjs />,
  React: <FaReact />,
  Vue: <FaVuejs />,
  TypeScript: <SiTypescript />,
  JavaScript: <SiJavascript />,
  'React-Native': <TbBrandReactNative />,
  Flutter: <SiFlutter />,
  Kotlin: <SiKotlin />,
  'Nest.js': <SiNestjs />,
  express: <SiExpress />,
  'node.js': <FaNodeJs />,
  Prisma: <SiPrisma />,
  Golang: <SiGo />,
  Python: <FaPython />,
  Cpp: <TbBrandCpp />,
  MySQL: <SiMysql />,
};
