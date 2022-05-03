import React from 'react';

import { Background } from '../../background/Background';
import { BowerbirdIcon } from '../../icon/BowerbirdIcon';
import { Section } from '../../layout/Section';
import { ChartImage } from './ChartImage';
import { DepositImage } from './DepositImage';
import { HeroLogoImage } from './HeroLogoImage';
import { LiquidationImage } from './LiquidationImage';
import { NestImage } from './NestImage';
import { SwapImage } from './SwapImage';
import { VerticalFeatureRow } from './VerticalFeatureRow';

const VerticalFeatures = () => (
  <Background color="bg-gray-50">
    <br />
    <Section title="What is Bowerbird?">
      <VerticalFeatureRow
        description={(
          <div>
            <p>
              Bowerbird is a trustless, frictionless DeFi lending protocol built on Neo N3,
              drawing technical inspiration from
              {' '}
              <a
                className="underline"
                href="https://compound.finance"
              >
                Compound
              </a>
              {' '}
              and market model inspiration from
              {' '}
              <a
                className="underline"
                href="https://anchorprotocol.com"
              >
                Anchor
              </a>
              .
            </p>
            <br />
            <p>
              Bowerbird aims to bridge the needs of two sets of participants
              in the Neo N3 ecosystem:
              those who seek yields on stable assets and those who need liquidity in stable assets.
            </p>
            <br />
            <p>
              Participants who own
              {' '}
              <span className="font-semibold">Lyrebird USD (USDL)</span>
              {' '}
              will be able to deposit their funds into
              Bowerbird. In return for lending out their USDL, they will earn yields accumulated
              as borrowers take out loans and make repayments with interest.
            </p>
            <br />
            <p>
              On the other hand, participants who need liquidity in stable assets may deposit their
              {' '}
              <span className="font-semibold">Burger Neo (bNEO)</span>
              {' '}
              as collateral to Bowerbird.
              They will be able to take out loans in USDL against this collateral.
              Borrowers are free to use the USDL as they wish as long as they make sufficient
              repayments to ensure that their loans maintain a healthy collateral ratio.
            </p>
          </div>
        )}
        reverse
        image={<HeroLogoImage width={384} height={384} />}
      />
    </Section>
    <Section title="How does Bowerbird work?">
      <VerticalFeatureRow
        title="Lending"
        description={(
          <div>
            <p>
              Let&apos;s start with the lender&apos;s point of view. A lender can
              deposit USDL to Bowerbird and receive
              {' '}
              <span className="font-semibold">Bowered USDL (bUSDL)</span>
              {' '}
              in return based on the current USDL_bUSDL exchange rate.
              Conceptually, bUSDL can be thought of as a deposit slip
              or a yield-bearing version of USDL.
              It can be freely transferred to other wallets.
            </p>
            <br />
            <p>
              The total supply of bUSDL is backed by the supply of USDL deposits
              and loan repayments made to Bowerbird. As loan repayments increase
              over time, the USDL_bUSDL exchange rate increases to reflect this change.
            </p>
            <br />
            <p>
              When the depositor is ready to withdraw, they simply convert their bUSDL
              back to USDL. The difference in exchange rates at deposit and withdrawal
              is the interest earned during this period.
            </p>
          </div>
        )}
        image={<DepositImage />}
      />
      <VerticalFeatureRow
        title="Borrowing"
        description={(
          <div>
            <p>
              A borrower first needs to deposit bNEO as collateral to the protocol.
              In order to keep the protocol solvent, a minimum collateralization ratio
              is enforced. For example, if the minimum collateralization ratio is 150&#37;,
              someone who deposits &#36;150 of bNEO would be able to borrow up to 100 USDL.
            </p>
            <br />
            <p>
              The borrower can then take out a loan and receive USDL.
              The value of the loan continuously increases to reflect the interest accrued.
              If the collateralization ratio gets too close to the minimum collateralization ratio,
              the borrower would need to supply more collateral or make a repayment
              to avoid liquidation.
            </p>
          </div>
        )}
        image={<SwapImage />}
        reverse
      />
      <VerticalFeatureRow
        title="Liquidating"
        description={(
          <div>
            <p>
              Liquidators play a crucial role in preserving the health of the Bowerbird protocol.
              Anyone can keep track of loans that fall under the minimum collateralization ratio.
              If this happens, they can initiate a liquidation, partially paying back
              the under-collateralized loan in USDL and receiving a reward.
            </p>
            <br />
            <p>
              This mechanism ensures that the collateral value in the protocol is
              always greater than the outstanding USDL loan value, guaranteeing solvency.
            </p>
          </div>
        )}
        image={<LiquidationImage />}
      />
    </Section>
    <Section title="What makes Bowerbird special?">
      <VerticalFeatureRow
        title="Sustainable High Yields"
        description={(
          <div>
            <p>
              Because bNEO is a yield-bearing asset, lending interest can be
              high without borrow interest being exceptionally high.
              bNEO consistently earns 9-10&#37; APR due to GAS generation through voting.
              Bowerbird will take these rewards, convert them into USDL, and distribute this
              along with the interest from repayments.
            </p>
            <br />
            <p>
              At 150&#37; minimum collateralization ratio and 80&#37; utilization, this means that
              Bowerbird can consistently yield
              {' '}
              <span className="font-semibold">10.8 - 12&#37; </span>
              from GAS rewards alone,
              without even taking the actual interest repayments into acount!
            </p>
          </div>
        )}
        reverse
        image={<ChartImage />}
      />
      <VerticalFeatureRow
        title="Ecosystem Boost"
        description={(
          <div>
            <p>
              Bowerbird brings natural demand to three existing Neo N3 ecosystem projects:
              {' '}
              <a
                className="underline"
                href="https://lyrebird.finance"
              >
                Lyrebird
              </a>
              {', '}
              <a
                className="underline"
                href="https://neoburger.io"
              >
                NeoBurger
              </a>
              {', and '}
              <a
                className="underline"
                href="https://flamingo.finance"
              >
                Flamingo
              </a>
              . If Bowerbird is successful, it will generate demand for Lyrebird&apos;s
              USDL stablecoin as yield farmers will seek it to earn interest.
              Next, it will generate demand for NeoBurger&apos;s bNEO to be used as collateral.
              Finally, it will generate fees for Flamingo as the GAS rewards
              from the collateralized bNEO are converted into USDL through Flamingo swaps.
            </p>
            <br />
            <p>
              Furthermore, Bowerbird can easily support any NEP-17 token as collateral
              in the future, as long as it has a yield-earning mechanism.
              Bowerbird plans to support FLM and LRB, entering the Flund with the former
              and staking the latter to boost lending yields.
            </p>
          </div>
        )}
        image={<NestImage />}
      />
      <VerticalFeatureRow
        title="Community Commitment"
        description={(
          <div>
            <p>
              Bowerbird is committed to community ownership.
              Bowerbird will be governed through the
              {' '}
              <span className="font-semibold">Bowerbird Token (BWB)</span>
              , the majority of which will be distributed to early users of the protocol.
            </p>
            <br />
            <p>
              Bowerbird will shift to DAO ownership as soon as practicable such that
              the community can decide on tunable parameters such as the interest rate function,
              target utilization ratio, and support for new collateral assets.
            </p>
          </div>
        )}
        reverse
        image={<BowerbirdIcon width={256} height={256} />}
      />
    </Section>
  </Background>
);

export { VerticalFeatures };
