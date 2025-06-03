import { FaGithub, FaLinkedin, FaStackOverflow } from 'react-icons/fa';
import { SiCoursera, SiGravatar } from 'react-icons/si';
import { IconType } from 'react-icons';

interface IconMap {
  [key: string]: IconType;
}

export const socialIconMap: IconMap = {
  github: FaGithub,
  linkedin: FaLinkedin,
  stackoverflow: FaStackOverflow,
  coursera: SiCoursera,
  gravatar: SiGravatar
};
