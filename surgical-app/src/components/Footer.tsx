import Link from 'next/link';
import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { IoLogoLinkedin } from 'react-icons/io';

// This member type and info might be used only this file and no shared, so I put it here
type Member = {
  name: string;
  github: string;
  linkedin: string;
};
const memberInfo: Member[] = [
  {
    name: 'Tomoyuki Kishi',
    github: 'https://github.com/kishi1997',
    linkedin: 'https://www.linkedin.com/in/kishi-tomoyuki-287b39355/',
  },
  {
    name: 'Johnny Kim',
    github: 'https://github.com/bellhwi',
    linkedin: 'https://www.linkedin.com/in/jonghwikim/',
  },
  {
    name: 'Lisa Chan',
    github: 'https://github.com/lc1715',
    linkedin: 'http://www.linkedin.com/in/lisa-chan14',
  },
];
export const Footer = () => {
  return (
    <footer className="bg-black text-white w-full">
      <div className="container mx-auto px-6 py-8">
        {/* Upper Section for Team Members */}
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold tracking-wider mb-4">TEAM</h3>
          <ul className="flex justify-center flex-col items-center gap-x-8 gap-y-2 flex-wrap sm:flex-row">
            {memberInfo.map((m: Member, index: number) => (
              <li key={index} className="flex items-center gap-2">
                <span className="font-medium text-gray-200">{m.name}</span>
                <Link
                  href={m.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${m.name}'s Github`}
                >
                  <FaGithub className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                </Link>
                <Link
                  href={m.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${m.name}'s LinkedIn`}
                >
                  <IoLogoLinkedin className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-800 my-6" />

        {/* Bottom Section for Copyright and Brand */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p className="order-2 sm:order-1 mt-4 sm:mt-0">
            © {new Date().getFullYear()} All Rights Reserved.
          </p>
          <div className="order-1 sm:order-2 font-bold text-lg">chingu</div>
        </div>
      </div>
    </footer>
  );
};
