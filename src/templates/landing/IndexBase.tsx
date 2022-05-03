import React from 'react';

import { Meta } from '../../layout/Meta';
import { Config } from '../../utils/Config';
import { Footer } from '../commons/Footer';
import { Hero } from './Hero';
import { VerticalFeatures } from './VerticalFeatures';

const IndexBase = () => (
  <div className="antialiased text-gray-50 flex flex-col h-screen">
    <Meta title={Config.title} description={Config.description} />
    <Hero />
    <VerticalFeatures />
    <main className="flex flex-grow" />
    <Footer />
  </div>
);

export { IndexBase };
