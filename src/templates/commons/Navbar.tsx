import React from 'react';

import { Background } from '../../background/Background';
import { Section } from '../../layout/Section';
import { Logo } from './Logo';
import { NavbarTwoColumns } from './NavbarTwoColumns';

const Navbar = () => (
  <Background color="bg-primary-100">
    <Section yPadding="py-1">
      <NavbarTwoColumns logo={<Logo />}>
        <li>
          <a href="/lend">Lend</a>
        </li>
        <li>
          <a href="/borrow">Borrow</a>
        </li>
      </NavbarTwoColumns>
    </Section>
  </Background>
);

export { Navbar };
