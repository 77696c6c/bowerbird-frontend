import React from 'react';

import { Background } from '../../background/Background';
import { HeroOneButton } from '../../hero/HeroOneButton';
import { Section } from '../../layout/Section';
import { Navbar } from '../commons/Navbar';

const Hero = () => (
  <Background color="bg-primary-100">
    <Navbar />
    <Section yPadding="py-12 md:py-28">
      <HeroOneButton
        title={<>{'Build Your Nest Egg\n'}</>}
        description={(
          <>
            DeFi Lending has arrived on
            {' '}
            <span className="text-primary-900">Neo N3</span>
          </>
        )}
      />
    </Section>
  </Background>
);

export { Hero };
