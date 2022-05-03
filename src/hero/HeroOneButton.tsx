import React, { ReactNode } from 'react';

type IHeroOneButtonProps = {
  title: ReactNode;
  description?: ReactNode;
};

const HeroOneButton = (props: IHeroOneButtonProps) => (
  <header className="text-center">
    <h1 className="text-4xl md:text-5xl text-gray-50 font-bold whitespace-pre-line leading-hero">
      {props.title}
    </h1>
    <div className="text-2xl md:text-4xl md:font-bold mt-4 mb-8 md:mb-16">{props.description}</div>
  </header>
);

export { HeroOneButton };
