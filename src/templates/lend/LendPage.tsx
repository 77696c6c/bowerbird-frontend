/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';

import axios from 'axios';

import { GeneralButton } from '../../button/GeneralButton';
import { BUSDLContract } from '../../contracts/BUSDLContract';
import { USDLContract } from '../../contracts/USDLContract';
import ConfirmDialog from '../../dialog/ConfirmDialog';
import LoadingDialog from '../../dialog/LoadingDialog';
import { CopyIcon } from '../../icon/CopyIcon';
import { USDLIcon } from '../../icon/USDLIcon';
import { Meta } from '../../layout/Meta';
import { NeoNotification, NeoNotificationInit } from '../../notification/notification';
import { globalContext } from '../../state/Store';
import { base64MatchesAddress } from '../../utils/account';
import { Config } from '../../utils/Config';
import ConnectWalletDialog from '../../wallet/ConnectWalletDialog';
import DisconnectWalletDialog from '../../wallet/DisconnectWalletDialog';
import {
  EmptyWallet, Wallet, WalletInit, WalletProvider,
} from '../../wallet/wallet';
import { WalletButton } from '../../wallet/WalletButton';
import { Alert } from '../commons/Alert';
import { Footer } from '../commons/Footer';
import { Navbar } from '../commons/Navbar';
import { TransactionStatus } from '../commons/TransactionStatus';
import { WhitePanel } from '../commons/WhitePanel';

function computeDeposits(busdlBalance: number, exchangeRate: number) {
  return (busdlBalance * exchangeRate) / 10 ** 16;
}

function computeAPR(r0: number, underlyingSupply: number, loanedSupply: number) {
  if (loanedSupply === 0) {
    return 0;
  }
  return (r0 * loanedSupply) / ((loanedSupply + underlyingSupply) * 100);
}

const LendPage = () => {
  const transactionBufferMillis = 60000;
  const refreshBalanceDelayMillis = 5000;
  const [transactionStatus, setTransactionStatus] = useState(TransactionStatus.None);
  const [txHash, setTxHash] = useState('');
  const { globalState } = useContext(globalContext);
  const [wallet, setWallet] = useState<Wallet>(EmptyWallet);
  const [notification, setNotification] = useState<NeoNotification | null>(null);
  const [showInitPage, setShowInitPage] = useState(true);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [depositValue, setDepositValue] = useState<string>('');
  const [withdrawValue, setWithdrawValue] = useState<string>('');
  const [openWalletConnect, setOpenWalletConnect] = useState(false);
  const [openWalletDisconnect, setOpenWalletDisconnect] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [transactionFailedTask, setTransactionFailedTask] = useState<NodeJS.Timeout | null>(null);
  const [balanceTask, setBalanceTask] = useState<NodeJS.Timeout | null>(null);

  const [contractState, setContractState] = useState({
    usdlPrice: 0,
    bneoPrice: 0,
    busdlBalance: 0,
    exchangeRate: 0,
    underlyingSupply: 0,
    loanedSupply: 0,
    r0: 0,
  });

  async function isWalletReady(w: Wallet) {
    if (w === EmptyWallet) {
      return false;
    }
    if (globalState.isWalletConnected) {
      if (globalState.walletProvider === WalletProvider.NeoLine) {
        console.log('Ready with NeoLine');
        return w.NeoLineAvailable;
      }
      if (globalState.walletProvider === WalletProvider.O3) {
        console.log('Ready with O3');
        return w.O3Available;
      }
      if (globalState.walletProvider === WalletProvider.WalletConnect) {
        console.log('Ready with WalletConnect');
        return w.WalletConnectAvailable;
      }
      return false;
    }
    console.log('Ready disconnected');
    return true;
  }

  function getPrice() {
    return axios(`${process.env.NEXT_PUBLIC_PRICE_PATH}`).then(
      (result) => result.data,
    );
  }

  async function refreshStats() {
    const priceT = getPrice();
    const exchangeRateT = BUSDLContract.getExchangeRate(wallet);
    const underlyingSupplyT = BUSDLContract.getUnderlyingSupply(wallet);
    const loanedSupplyT = BUSDLContract.getLoanedSupply(wallet);
    const r0T = BUSDLContract.getR0(wallet);
    const results = await Promise.all([
      priceT,
      exchangeRateT,
      underlyingSupplyT,
      loanedSupplyT,
      r0T]);

    const usdlPrice = results[0].USDL as number / 1_000_000;
    const bneoPrice = results[0].bNEO as number / 1_000_000;
    const exchangeRate = results[1] as number;
    const underlyingSupply = results[2] as number;
    const loanedSupply = results[3] as number;
    const r0 = results[4] as number;

    setContractState((prevContractState) => ({
      ...prevContractState,
      usdlPrice,
      bneoPrice,
      exchangeRate,
      underlyingSupply,
      loanedSupply,
      r0,
    }));
  }

  async function setRefreshBalances() {
    const balanceT = setTimeout(() => {
      const priceT = getPrice();
      const busdlBalanceT = BUSDLContract.getBalance(wallet, globalState.walletAddress);
      const exchangeRateT = BUSDLContract.getExchangeRate(wallet);
      const underlyingSupplyT = BUSDLContract.getUnderlyingSupply(wallet);
      const loanedSupplyT = BUSDLContract.getLoanedSupply(wallet);
      const r0T = BUSDLContract.getR0(wallet);
      Promise.all([
        priceT,
        busdlBalanceT,
        exchangeRateT,
        underlyingSupplyT,
        loanedSupplyT,
        r0T]).then((results) => {
        const usdlPrice = results[0].USDL as number / 1_000_000;
        const bneoPrice = results[0].bNEO as number / 1_000_000;
        const busdlBalance = results[1] as number;
        const exchangeRate = results[2] as number;
        const underlyingSupply = results[3] as number;
        const loanedSupply = results[4] as number;
        const r0 = results[5] as number;

        setContractState((prevContractState) => ({
          ...prevContractState,
          usdlPrice,
          bneoPrice,
          busdlBalance,
          exchangeRate,
          underlyingSupply,
          loanedSupply,
          r0,
        }));
      });
    }, refreshBalanceDelayMillis);
    if (balanceTask != null) {
      clearTimeout(balanceTask);
    }
    setBalanceTask(balanceT);
  }

  async function refreshBalances() {
    const priceT = getPrice();
    const busdlBalanceT = BUSDLContract.getBalance(wallet, globalState.walletAddress);
    const exchangeRateT = BUSDLContract.getExchangeRate(wallet);
    const underlyingSupplyT = BUSDLContract.getUnderlyingSupply(wallet);
    const loanedSupplyT = BUSDLContract.getLoanedSupply(wallet);
    const r0T = BUSDLContract.getR0(wallet);
    const results = await Promise.all([
      priceT,
      busdlBalanceT,
      exchangeRateT,
      underlyingSupplyT,
      loanedSupplyT,
      r0T]);

    const usdlPrice = results[0].USDL as number / 1_000_000;
    const bneoPrice = results[0].bNEO as number / 1_000_000;
    const busdlBalance = results[1] as number;
    const exchangeRate = results[2] as number;
    const underlyingSupply = results[3] as number;
    const loanedSupply = results[4] as number;
    const r0 = results[5] as number;

    setContractState((prevContractState) => ({
      ...prevContractState,
      usdlPrice,
      bneoPrice,
      busdlBalance,
      exchangeRate,
      underlyingSupply,
      loanedSupply,
      r0,
    }));
  }

  async function confirmTransaction(txid: string) {
    console.log(`Transaction ${txid} has been confirmed!`);
    refreshBalances();
    setTimeout(refreshBalances, refreshBalanceDelayMillis);
    setTransactionStatus(TransactionStatus.Complete);
  }

  async function failTransaction(txid: string) {
    console.log(`Transaction ${txid} has failed!`);
    refreshBalances();
    setTimeout(refreshBalances, refreshBalanceDelayMillis);
    setTransactionStatus(TransactionStatus.Failed);
  }

  function stopTransactionFailedTask() {
    if (transactionFailedTask != null) {
      clearTimeout(transactionFailedTask);
    }
    setTransactionFailedTask(null);
  }

  function startTransactionFailedTask() {
    // Fail if transaction is pending after 1 minute
    const transactionFailedT = setTimeout(() => {
      setTransactionStatus(TransactionStatus.Failed);
    }, transactionBufferMillis);
    if (transactionFailedTask != null) {
      clearTimeout(transactionFailedTask);
    }
    setTransactionFailedTask(transactionFailedT);
  }

  async function depositCallback(event: { data: string }): Promise<void> {
    const data = JSON.parse(event.data);
    if (data.params && data.params[0].eventname === 'Deposit') {
      const txid = data.params[0].container;
      const addressHash = data.params[0].state.value[0].value;
      const account = await wallet.getAccount(globalState.walletProvider);
      if (base64MatchesAddress(addressHash, account.address)) {
        confirmTransaction(txid);
        notification?.unregisterExecutedCallback(depositCallback);
        notification?.unregisterExecutedCallback(depositFailedCallback);
      }
    }
  }

  async function depositFailedCallback(event: { data: string }): Promise<void> {
    const data = JSON.parse(event.data);
    if (data.params && data.params[0].eventname === 'DepositFailure') {
      const txid = data.params[0].container;
      const addressHash = data.params[0].state.value[0].value;
      const account = await wallet.getAccount(globalState.walletProvider);
      if (base64MatchesAddress(addressHash, account.address)) {
        failTransaction(txid);
        notification?.unregisterExecutedCallback(depositCallback);
        notification?.unregisterExecutedCallback(depositFailedCallback);
      }
    }
  }

  async function redeemCallback(event: { data: string }): Promise<void> {
    const data = JSON.parse(event.data);
    if (data.params && data.params[0].eventname === 'Redeem') {
      const txid = data.params[0].container;
      const addressHash = data.params[0].state.value[0].value;
      const account = await wallet.getAccount(globalState.walletProvider);
      if (base64MatchesAddress(addressHash, account.address)) {
        confirmTransaction(txid);
        notification?.unregisterExecutedCallback(redeemCallback);
        notification?.unregisterExecutedCallback(redeemFailedCallback);
      }
    }
  }

  async function redeemFailedCallback(event: { data: string }): Promise<void> {
    const data = JSON.parse(event.data);
    if (data.params && data.params[0].eventname === 'RedeemFailure') {
      const txid = data.params[0].container;
      const addressHash = data.params[0].state.value[0].value;
      const account = await wallet.getAccount(globalState.walletProvider);
      if (base64MatchesAddress(addressHash, account.address)) {
        failTransaction(txid);
        notification?.unregisterExecutedCallback(redeemCallback);
        notification?.unregisterExecutedCallback(redeemFailedCallback);
      }
    }
  }

  async function submitDeposit(deposit: number) {
    if (!notification?.isOpen()) {
      console.log('Notification service disconnected');
      setAlertText('Notification service disconnected - please refresh and try again.');
      setShowAlert(true);
      return;
    }
    try {
      const depositTokens = Math.round(deposit * 100_000_000);

      if (depositTokens <= 0) {
        setAlertText('Please input a quantity > 0 to deposit.');
        setShowAlert(true);
      } else {
        notification?.registerExecutedCallback(BUSDLContract.getHash(), 'Deposit', depositCallback);
        notification?.registerExecutedCallback(BUSDLContract.getHash(), 'DepositFailure', depositCallback);
        const tx = await USDLContract.deposit(
          wallet,
          globalState.walletProvider,
          depositTokens,
          globalState.walletAddress,
        );
        setDepositValue('');
        setShowDepositDialog(false);
        startTransactionFailedTask();
        setTxHash(tx.txid);
        setTransactionStatus(TransactionStatus.Pending);
      }
    } catch (e) {
      console.log('deposit failure', e);
      setShowDepositDialog(false);
      setAlertText('Transaction was not approved');
      setShowAlert(true);
    }
  }

  async function submitWithdraw(withdrawal: number, exchangeRate: number) {
    if (!notification?.isOpen()) {
      console.log('Notification service disconnected');
      setAlertText('Notification service disconnected - please refresh and try again.');
      setShowAlert(true);
      return;
    }
    try {
      const withdrawalTokens = Math.round((withdrawal * 100_000_000 * 100_000_000) / exchangeRate);
      if (withdrawalTokens <= 0) {
        setAlertText('Please input a quantity > 0 to withdraw.');
        setShowAlert(true);
      } else {
        notification?.registerExecutedCallback(BUSDLContract.getHash(), 'Redeem', redeemCallback);
        notification?.registerExecutedCallback(BUSDLContract.getHash(), 'RedeemFailure', redeemCallback);
        const tx = await BUSDLContract.redeem(
          wallet,
          globalState.walletProvider,
          withdrawalTokens,
          globalState.walletAddress,
        );
        setWithdrawValue('');
        setShowWithdrawDialog(false);
        startTransactionFailedTask();
        setTxHash(tx.txid);
        setTransactionStatus(TransactionStatus.Pending);
      }
    } catch (e) {
      console.log('withdrawal failure', e);
      setShowWithdrawDialog(false);
      setAlertText('Failed to withdraw...please try refreshing your wallet connection.');
      setShowAlert(true);
    }
  }

  async function setWalletConnected() {
    if (globalState.walletProvider === WalletProvider.NeoLine) {
      await wallet?.NeoLineAvailable;
    }
    if (globalState.walletProvider === WalletProvider.O3) {
      await wallet?.O3Available;
    }
    if (globalState.walletProvider === WalletProvider.WalletConnect) {
      await wallet?.WalletConnectAvailable;
    }
    await wallet?.connect(globalState.walletProvider);
    await notification?.available;

    refreshBalances();
    setShowLoadingDialog(false);
  }

  function onExplorerLink(hash: string) {
    const doraUrl = `${process.env.NEXT_PUBLIC_DORA_BASE_PATH}/${hash}`;
    const tab = window.open(doraUrl, '_blank');
    if (tab) {
      tab.focus();
    }
  }

  const transactionPendingPanel = (
    <div className="flex flex-col">
      <div className="text-md font-bold mb-2">Transaction Hash:</div>
      <div className="text-sm break-all mb-2">
        {txHash}
        {' '}
        <span>
          <CopyIcon cn="inline" onClick={() => navigator.clipboard.writeText(txHash)} />
        </span>
      </div>
      <div className="flex items-center justify-center">
        <span>
          <GeneralButton text="View on Explorer" onClick={() => onExplorerLink(txHash)} />
        </span>
      </div>
    </div>
  );

  const transactionFailedPanel = (
    <div className="flex flex-col">
      <div className="text-md mb-6">
        <p className="mb-2">
          The transaction has failed. Please contact us on discord with the following transaction
          hash for investigation.
        </p>
      </div>
      <div className="text-md font-bold mb-2">Transaction Hash:</div>
      <div className="text-sm break-all">
        {txHash}
        {' '}
        <span>
          <CopyIcon cn="inline" onClick={() => navigator.clipboard.writeText(txHash)} />
        </span>
      </div>
    </div>
  );

  const transactionCompletePanel = (
    <div className="flex flex-col">
      <div className="text-md mb-6">
        <p>Everything looks good.</p>
      </div>
      <div className="text-md font-bold mb-2">Transaction Hash:</div>
      <div className="text-sm break-all">
        {txHash}
        {' '}
        <span>
          <CopyIcon cn="inline" onClick={() => navigator.clipboard.writeText(txHash)} />
        </span>
      </div>
    </div>
  );

  const depositPanel = (
    <input
      className="rounded-lg pt-2 pb-1 px-2 bg-white appearance-none ring-1 ring-lyrebird-700 w-full text-xl focus:outline-none focus:bg-white focus:ring-2 leading-tight"
      type="number"
      value={depositValue.toString()}
      placeholder="0.0"
      onChange={(event) => setDepositValue(event.target.value)}
    />
  );

  const withdrawPanel = (
    <input
      className="rounded-lg pt-2 pb-1 px-2 bg-white appearance-none ring-1 ring-lyrebird-700 w-full text-xl focus:outline-none focus:bg-white focus:ring-2 leading-tight"
      type="number"
      value={withdrawValue.toString()}
      placeholder="0.0"
      onChange={(event) => setWithdrawValue(event.target.value)}
    />
  );

  async function setWalletDisconnected() {
    setContractState((prevContractState) => ({
      ...prevContractState,
      busdlBalance: 0,
    }));
    await refreshStats();
    setShowLoadingDialog(false);
  }

  async function initWallets() {
    const walletImpl = await WalletInit();
    setWallet(walletImpl);
  }

  async function initNotification() {
    const notificationImpl = await NeoNotificationInit();
    setNotification(notificationImpl);
  }

  useEffect(() => {
    if (
      transactionStatus === TransactionStatus.Complete
      || transactionStatus === TransactionStatus.Failed
    ) {
      stopTransactionFailedTask();
      refreshBalances();
    }
  }, [transactionStatus]);

  useEffect(() => {
    setRefreshBalances();
  }, [contractState]);

  useEffect(() => {
    setShowLoadingDialog(true);
    initWallets();
    initNotification();
  }, []);

  useEffect(() => {
    if (wallet !== EmptyWallet) {
      setShowLoadingDialog(true);
      if (globalState.isWalletConnected) {
        setWalletConnected();
      } else {
        setWalletDisconnected();
      }
    }
  }, [globalState.isWalletConnected, wallet]);

  if (!isWalletReady(wallet) || notification == null || !notification.available) {
    return (
      <div className="antialiased text-gray-50 flex flex-col h-screen">
        <Meta title={Config.title} description={Config.description} />
        <Navbar />
        <main className="flex flex-grow" />
        <LoadingDialog
          title="Loading..."
          open={showInitPage}
          onClose={() => setShowInitPage(false)}
          canClose={false}
        />
        <Footer />
      </div>
    );
  }
  return (
    <div className="antialiased text-gray-600 flex flex-col h-screen min-w-400">
      <Meta title={Config.title} description={Config.description} />
      <Navbar />
      <main className="flex flex-grow justify-center">
        <div className="max-w-screen-lg w-11/12 md:w-3/4">
          <div className="px-2 pt-6 flex justify-between items-center">
            <span className="text-3xl text-gray-800 font-semibold pt-4">Lend</span>
            <WalletButton
              isWalletConnected={globalState.isWalletConnected}
              walletAddress={globalState.walletAddress}
              walletProvider={globalState.walletProvider}
              onOpenWalletConnect={() => setOpenWalletConnect(true)}
              onOpenWalletDisconnect={() => setOpenWalletDisconnect(true)}
            />
          </div>
          <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <WhitePanel>
              <div className="mx-8 my-4 flex flex-col w-full">
                <div className="mt-4">
                  <span className="text-xl font-medium">My Deposits</span>
                </div>
                <div className="mr-4 mt-6 flex justify-end">
                  <span className="text-lg font-normal flex items-center">
                    <USDLIcon width={24} height={24} className="mr-2" />
                    <span>
                      {computeDeposits(contractState.busdlBalance, contractState.exchangeRate)
                        .toLocaleString(undefined, {
                          minimumFractionDigits: 8, maximumFractionDigits: 8,
                        })}
                      {' '}
                      <span className="font-semibold">
                        USDL
                      </span>
                    </span>
                  </span>
                </div>
                <div className="mr-4 mt-2 flex justify-end">
                  <span className="text-base font-semibold items-center">
                    ~ $
                    {' '}
                    {
                      (contractState.usdlPrice
                      * computeDeposits(contractState.busdlBalance, contractState.exchangeRate)) 
                        .toLocaleString(undefined, {
                          minimumFractionDigits: 2, maximumFractionDigits: 2,
                        })
                    }
                  </span>
                </div>
                <div className="flex h-full" />
                <div className="mb-4 flex w-full justify-end">
                  <span className="mx-2">
                    <GeneralButton text="Deposit" onClick={() => setShowDepositDialog(true)} />
                  </span>
                  <span className="mx-2">
                    <GeneralButton text="Withdraw" onClick={() => setShowWithdrawDialog(true)} />
                  </span>
                </div>
              </div>
            </WhitePanel>
            <WhitePanel>
              <div className="mx-8 my-4 flex flex-col w-full">
                <div className="mt-4">
                  <span className="text-xl font-medium">Lend APR</span>
                </div>
                <div className="mt-6">
                  <span className="text-lg font-normal">
                    {computeAPR(
                      contractState.r0,
                      contractState.underlyingSupply,
                      contractState.loanedSupply,
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2, maximumFractionDigits: 2,
                    })}
                    %
                  </span>
                </div>
              </div>
            </WhitePanel>
          </div>
        </div>
      </main>
      <ConnectWalletDialog
        title="Connect Wallet"
        open={openWalletConnect}
        wallet={wallet}
        onClose={() => {
          setOpenWalletConnect(false);
        }}
      />
      <DisconnectWalletDialog
        title="Disconnect Wallet"
        open={openWalletDisconnect}
        wallet={wallet}
        walletAddress={globalState.walletAddress}
        walletProvider={globalState.walletProvider}
        onClose={() => {
          setOpenWalletDisconnect(false);
        }}
      />
      <LoadingDialog
        title="Loading..."
        open={showLoadingDialog}
        onClose={() => setShowLoadingDialog(false)}
        canClose={false}
      />
      <LoadingDialog
        open={transactionStatus === TransactionStatus.Pending}
        title="Confirming transaction..."
        canClose={false}
      >
        {transactionPendingPanel}
      </LoadingDialog>
      <ConfirmDialog
        open={transactionStatus === TransactionStatus.Failed}
        title="Failed to confirm transaction."
        confirmButtonText="View on Explorer"
        onClose={() => setTransactionStatus(TransactionStatus.None)}
        onConfirm={(hash: string) => onExplorerLink(hash)}
        onConfirmData={txHash}
        canClose
      >
        {transactionFailedPanel}
      </ConfirmDialog>
      <ConfirmDialog
        open={transactionStatus === TransactionStatus.Complete}
        title="Transaction complete!"
        confirmButtonText="View on Explorer"
        onClose={() => setTransactionStatus(TransactionStatus.None)}
        onConfirm={(hash: string) => onExplorerLink(hash)}
        onConfirmData={txHash}
        canClose
      >
        {transactionCompletePanel}
      </ConfirmDialog>
      <ConfirmDialog
        open={showDepositDialog}
        title="Deposit USDL"
        confirmButtonText="Deposit"
        onClose={() => { setDepositValue(''); setShowDepositDialog(false); }}
        onConfirm={(deposit: string) => submitDeposit(+deposit)}
        onConfirmData={depositValue}
        canClose
      >
        {depositPanel}
      </ConfirmDialog>
      <ConfirmDialog
        open={showWithdrawDialog}
        title="Withdraw USDL"
        confirmButtonText="Withdraw"
        onClose={() => { setWithdrawValue(''); setShowWithdrawDialog(false); }}
        onConfirm={(withdrawal: string) => submitWithdraw(+withdrawal, contractState.exchangeRate)}
        onConfirmData={withdrawValue}
        canClose
      >
        {withdrawPanel}
      </ConfirmDialog>
      <Alert text={alertText} open={showAlert} onClose={() => setShowAlert(false)} />
      <Footer />
    </div>
  );
};

export { LendPage };
