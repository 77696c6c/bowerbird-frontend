import React, { ReactNode, useState } from 'react';

import Link from 'next/link';

import { HamburgerIcon } from '../../icon/HamburgerIcon';

type INavbarProps = {
  logo: ReactNode;
  children: ReactNode;
};

const NavbarTwoColumns = (props: INavbarProps) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex flex-wrap justify-between items-center py-0">
      <div>
        <Link href="/">
          <a>{props.logo}</a>
        </Link>
      </div>

      <div className="cursor-pointer md:hidden block">
        <HamburgerIcon
          cn="text-white fill-current"
          width={28}
          height={28}
          onClick={() => setShowMenu(!showMenu)}
        />
      </div>

      <nav
        className={`${showMenu ? '' : 'hidden'}
                    w-full pt-4 md:pt-0 md:flex md:items-center md:w-auto`}
      >
        <ul className="ml-2 md:ml-0 navbar md:flex md:justify-between items-center font-medium text-xl text-gray-50">
          {props.children}
        </ul>
      </nav>

      <style jsx>
        {`
          .navbar :global(li:not(:first-child)) {
            @apply mt-0;
          }

          .navbar :global(li:not(:last-child)) {
            @apply mr-5;
          }
        `}
      </style>
    </div>
  );
};

export { NavbarTwoColumns };
