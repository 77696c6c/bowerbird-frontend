/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react';

import axios from 'axios';

import { GeneralButton } from '../../button/GeneralButton';
import { BUSDLContract } from '../../contracts/BUSDLContract';
import { NestContract } from '../../contracts/NestContract';
import ConfirmDialog from '../../dialog/ConfirmDialog';
import LoadingDialog from '../../dialog/LoadingDialog';
import { BNEOIcon } from '../../icon/BNEOIcon';
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

const BNEO_SCRIPT_HASH = '0x48c40d4666f93408be1bef038b6722404d9a4c2a';

const BorrowPage = () => {
  const transactionBufferMillis = 60000;
  const refreshBalanceDelayMillis = 5000;
  const [transactionStatus, setTransactionStatus] = useState(TransactionStatus.None);
  const [txHash, setTxHash] = useState('');
  const { globalState } = useContext(globalContext);
  const [wallet, setWallet] = useState<Wallet>(EmptyWallet);
  const [notification, setNotification] = useState<NeoNotification | null>(null);
  const [showInitPage, setShowInitPage] = useState(true);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const [showDepositCollateralDialog, setShowDepositCollateralDialog] = useState(false);
  const [showWithdrawCollateralDialog, setShowWithdrawCollateralDialog] = useState(false);
  const [showBorrowDialog, setShowBorrowDialog] = useState(false);
  const [showRepayDialog, setShowRepayDialog] = useState(false);
  const [depositCollateralValue, setDepositCollateralValue] = useState<string>('');
  const [withdrawCollateralValue, setWithdrawCollateralValue] = useState<string>('');
  const [borrowValue, setBorrowValue] = useState<string>('');
  const [repaymentValue, setRepaymentValue] = useState<string>('');
  const [openWalletConnect, setOpenWalletConnect] = useState(false);
  const [openWalletDisconnect, setOpenWalletDisconnect] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [transactionFailedTask, setTransactionFailedTask] = useState<NodeJS.Timeout | null>(null);
  const [balanceTask, setBalanceTask] = useState<NodeJS.Timeout | null>(null);

  const [contractState, setContractState] = useState({
    usdlPrice: 0,
    bneoPrice: 0,
    bneoBalance: 0,
    loanBalance: 0,
    r0: 0,
    bneoLoanToValue: 0,
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

  function computeLoanToValue(
    usdlPrice: number,
    loanBalance: number,
    bneoPrice: number,
    bneoBalance: number,
  ) {
    if (loanBalance === 0.0) {
      return 0.0;
    }
    const usdlValue = usdlPrice * loanBalance;
    const bneoValue = bneoPrice * bneoBalance;
    return (100.0 * usdlValue) / bneoValue;
  }

  function getHealthColor(minLoanToValue: number, loanToValue: number) {
    if (loanToValue < 0.8 * minLoanToValue) {
      return 'text-green-600';
    }
    if (loanToValue < minLoanToValue) {
      return 'text-yellow-600';
    }
    return 'text-red-600';
  }

  function getHealthString(minLoanToValue: number, loanToValue: number) {
    if (loanToValue < 0.8 * minLoanToValue) {
      return 'Healthy';
    }
    if (loanToValue < minLoanToValue) {
      return 'Needs Attention';
    }
    return 'Under-collateralized';
  }

  function getPrice() {
    return axios(`${process.env.NEXT_PUBLIC_PRICE_PATH}?token=LRB`).then(
      (result) => result.data,
    );
  }

  async function refreshStats() {
    const priceT = getPrice();
    const r0T = BUSDLContract.getR0(wallet);
    const bneoLoanToValueT = NestContract.getLoanToValue(wallet, BNEO_SCRIPT_HASH);
    const results = await Promise.all([
      priceT,
      r0T,
      bneoLoanToValueT,
    ]);

    const usdlPrice = results[0].USDL as number / 1_000_000;
    const bneoPrice = results[0].bNEO as number / 1_000_000;
    const r0 = (results[1] as number) / 100;
    const bneoLoanToValue = (results[2] as number) / 100;

    setContractState((prevContractState) => ({
      ...prevContractState,
      usdlPrice,
      bneoPrice,
      r0,
      bneoLoanToValue,
    }));
  }

  async function setRefreshBalances() {
    const balanceT = setTimeout(() => {
      const priceT = getPrice();
      const bneoBalanceT = NestContract.getCollateralBalance(
        wallet,
        globalState.walletProvider,
        BNEO_SCRIPT_HASH,
        globalState.walletAddress,
      );
      const loanBalanceT = BUSDLContract.getLoanBalance(
        wallet,
        globalState.walletProvider,
        globalState.walletAddress,
      );
      const r0T = BUSDLContract.getR0(wallet);
      const bneoLoanToValueT = NestContract.getLoanToValue(wallet, BNEO_SCRIPT_HASH);
      Promise.all([
        priceT,
        bneoBalanceT,
        loanBalanceT,
        r0T,
        bneoLoanToValueT,
      ]).then((results) => {
        const usdlPrice = results[0].USDL as number / 1_000_000;
        const bneoPrice = results[0].bNEO as number / 1_000_000;
        const bneoBalance = (results[1] as number) / 100_000_000;
        const loanBalance = (results[2] as number) / 100_000_000;
        const r0 = (results[3] as number) / 100;
        const bneoLoanToValue = (results[4] as number) / 100;

        setContractState((prevContractState) => ({
          ...prevContractState,
          usdlPrice,
          bneoPrice,
          bneoBalance,
          loanBalance,
          r0,
          bneoLoanToValue,
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
    const bneoBalanceT = NestContract.getCollateralBalance(
      wallet,
      globalState.walletProvider,
      BNEO_SCRIPT_HASH,
      globalState.walletAddress,
    );
    const loanBalanceT = BUSDLContract.getLoanBalance(
      wallet,
      globalState.walletProvider,
      globalState.walletAddress,
    );
    const r0T = BUSDLContract.getR0(wallet);
    const bneoLoanToValueT = NestContract.getLoanToValue(wallet, BNEO_SCRIPT_HASH);
    const results = await Promise.all([
      priceT,
      bneoBalanceT,
      loanBalanceT,
      r0T,
      bneoLoanToValueT,
    ]);

    const usdlPrice = results[0].USDL as number / 1_000_000;
    const bneoPrice = results[0].bNEO as number / 1_000_000;
    const bneoBalance = (results[1] as number) / 100_000_000;
    const loanBalance = (results[2] as number) / 100_000_000;
    const r0 = (results[3] as number) / 100;
    const bneoLoanToValue = (results[4] as number) / 100;

    setContractState((prevContractState) => ({
      ...prevContractState,
      usdlPrice,
      bneoPrice,
      bneoBalance,
      loanBalance,
      r0,
      bneoLoanToValue,
    }));
  }

  async function confirmTransaction(txid: string) {
    console.log(`Transaction ${txid} has been confirmed!`);
    refreshBalances();
    setTimeout(refreshBalances, refreshBalanceDelayMillis);
    setTransactionStatus(TransactionStatus.Complete);
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

  async function depositCollateralCallback(event: { data: string }): Promise<void> {
    const data = JSON.parse(event.data);
    if (data.params && data.params[0].eventname === 'CollateralDeposit') {
      const txid = data.params[0].container;
      const addressHash = data.params[0].state.value[0].value;
      const account = await wallet.getAccount(globalState.walletProvider);
      if (base64MatchesAddress(addressHash, account.address)) {
        confirmTransaction(txid);
        notification?.unregisterExecutedCallback(depositCollateralCallback);
      }
    }
  }

  async function depositCollateral(deposit: number) {
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
        notification?.registerExecutedCallback(
          NestContract.getHash(),
          'CollateralDeposit',
          depositCollateralCallback,
        );
        const tx = await NestContract.depositCollateral(
          wallet,
          globalState.walletProvider,
          BNEO_SCRIPT_HASH,
          depositTokens,
          globalState.walletAddress,
        );
        setDepositCollateralValue('');
        setShowDepositCollateralDialog(false);
        startTransactionFailedTask();
        setTxHash(tx.txid);
        setTransactionStatus(TransactionStatus.Pending);
      }
    } catch (e) {
      console.log('deposit collateral failure', e);
      setShowDepositCollateralDialog(false);
      setAlertText('Transaction was not approved');
      setShowAlert(true);
    }
  }

  async function withdrawCollateralCallback(event: { data: string }): Promise<void> {
    const data = JSON.parse(event.data);
    if (data.params && data.params[0].eventname === 'CollateralWithdraw') {
      const txid = data.params[0].container;
      const addressHash = data.params[0].state.value[0].value;
      const account = await wallet.getAccount(globalState.walletProvider);
      if (base64MatchesAddress(addressHash, account.address)) {
        confirmTransaction(txid);
        notification?.unregisterExecutedCallback(withdrawCollateralCallback);
      }
    }
  }

  async function withdrawCollateral(withdrawal: number) {
    if (!notification?.isOpen()) {
      console.log('Notification service disconnected');
      setAlertText('Notification service disconnected - please refresh and try again.');
      setShowAlert(true);
      return;
    }
    try {
      const withdrawalTokens = Math.round(withdrawal * 100_000_000);
      if (withdrawalTokens <= 0) {
        setAlertText('Please input a quantity > 0 to withdraw.');
        setShowAlert(true);
      } else {
        notification?.registerExecutedCallback(
          NestContract.getHash(),
          'CollateralWithdraw',
          withdrawCollateralCallback,
        );
        const tx = await NestContract.withdrawCollateral(
          wallet,
          globalState.walletProvider,
          BNEO_SCRIPT_HASH,
          withdrawalTokens,
          globalState.walletAddress,
        );
        setWithdrawCollateralValue('');
        setShowWithdrawCollateralDialog(false);
        startTransactionFailedTask();
        setTxHash(tx.txid);
        setTransactionStatus(TransactionStatus.Pending);
      }
    } catch (e) {
      console.log('withdraw collateral failure', e);
      setShowWithdrawCollateralDialog(false);
      setAlertText('Transaction was not approved');
      setShowAlert(true);
    }
  }

  async function borrowUsdlCallback(event: { data: string }): Promise<void> {
    const data = JSON.parse(event.data);
    if (data.params && data.params[0].eventname === 'Loan') {
      const txid = data.params[0].container;
      const addressHash = data.params[0].state.value[0].value;
      const account = await wallet.getAccount(globalState.walletProvider);
      if (base64MatchesAddress(addressHash, account.address)) {
        confirmTransaction(txid);
        notification?.unregisterExecutedCallback(borrowUsdlCallback);
      }
    }
  }

  async function borrowUsdl(borrow: number) {
    if (!notification?.isOpen()) {
      console.log('Notification service disconnected');
      setAlertText('Notification service disconnected - please refresh and try again.');
      setShowAlert(true);
      return;
    }
    try {
      const borrowTokens = Math.round(borrow * 100_000_000);
      if (borrowTokens <= 0) {
        setAlertText('Please input a quantity > 0 to borrow.');
        setShowAlert(true);
      } else {
        notification?.registerExecutedCallback(
          NestContract.getHash(),
          'Loan',
          borrowUsdlCallback,
        );
        const tx = await NestContract.borrow(
          wallet,
          globalState.walletProvider,
          BUSDLContract.getHash(),
          borrowTokens,
          globalState.walletAddress,
        );
        setBorrowValue('');
        setShowBorrowDialog(false);
        startTransactionFailedTask();
        setTxHash(tx.txid);
        setTransactionStatus(TransactionStatus.Pending);
      }
    } catch (e) {
      console.log('borrow failure', e);
      setShowBorrowDialog(false);
      setAlertText('Transaction was not approved');
      setShowAlert(true);
    }
  }

  async function repayUsdlCallback(event: { data: string }): Promise<void> {
    const data = JSON.parse(event.data);
    if (data.params && data.params[0].eventname === 'Repayment') {
      const txid = data.params[0].container;
      const addressHash = data.params[0].state.value[0].value;
      const account = await wallet.getAccount(globalState.walletProvider);
      if (base64MatchesAddress(addressHash, account.address)) {
        confirmTransaction(txid);
        notification?.unregisterExecutedCallback(repayUsdlCallback);
      }
    }
  }

  async function repayUsdl(repay: number) {
    if (!notification?.isOpen()) {
      console.log('Notification service disconnected');
      setAlertText('Notification service disconnected - please refresh and try again.');
      setShowAlert(true);
      return;
    }
    try {
      const repayTokens = Math.round(repay * 100_000_000);
      if (repayTokens <= 0) {
        setAlertText('Please input a quantity > 0 to repay.');
        setShowAlert(true);
      } else {
        notification?.registerExecutedCallback(
          BUSDLContract.getHash(),
          'Repayment',
          repayUsdlCallback,
        );
        const tx = await BUSDLContract.repay(
          wallet,
          globalState.walletProvider,
          repayTokens,
          globalState.walletAddress,
        );
        setRepaymentValue('');
        setShowRepayDialog(false);
        startTransactionFailedTask();
        setTxHash(tx.txid);
        setTransactionStatus(TransactionStatus.Pending);
      }
    } catch (e) {
      console.log('repay failure', e);
      setShowRepayDialog(false);
      setAlertText('Transaction was not approved');
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

  const depositCollateralPanel = (
    <div className="flex flex-col">
      <span className="text-lg font-semibold mb-2 flex">
        <BNEOIcon width={24} height={24} className="mr-2" />
        <span>
          {' '}
          <span className="font-semibold">
            bNEO
          </span>
        </span>
      </span>
      <input
        className="rounded-lg pt-2 pb-1 px-2 bg-white appearance-none ring-1 ring-lyrebird-700 w-full text-xl focus:outline-none focus:bg-white focus:ring-2 leading-tight"
        type="number"
        value={depositCollateralValue.toString()}
        placeholder="0.0"
        onChange={(event) => setDepositCollateralValue(event.target.value)}
      />
    </div>
  );

  const withdrawCollateralPanel = (
    <div className="flex flex-col">
      <span className="text-lg font-semibold mb-2 flex">
        <BNEOIcon width={24} height={24} className="mr-2" />
        <span>
          {' '}
          <span className="font-semibold">
            bNEO
          </span>
        </span>
      </span>
      <input
        className="rounded-lg pt-2 pb-1 px-2 bg-white appearance-none ring-1 ring-lyrebird-700 w-full text-xl focus:outline-none focus:bg-white focus:ring-2 leading-tight"
        type="number"
        value={withdrawCollateralValue.toString()}
        placeholder="0.0"
        onChange={(event) => setWithdrawCollateralValue(event.target.value)}
      />
    </div>
  );

  const borrowPanel = (
    <div className="flex flex-col">
      <span className="text-lg font-semibold mb-2 flex">
        <USDLIcon width={24} height={24} className="mr-2" />
        <span>
          {' '}
          <span className="font-semibold">
            USDL
          </span>
        </span>
      </span>
      <input
        className="rounded-lg pt-2 pb-1 px-2 bg-white appearance-none ring-1 ring-lyrebird-700 w-full text-xl focus:outline-none focus:bg-white focus:ring-2 leading-tight"
        type="number"
        value={borrowValue.toString()}
        placeholder="0.0"
        onChange={(event) => setBorrowValue(event.target.value)}
      />
    </div>
  );

  const repayPanel = (
    <div className="flex flex-col">
      <span className="text-lg font-semibold mb-2 flex">
        <USDLIcon width={24} height={24} className="mr-2" />
        <span>
          {' '}
          <span className="font-semibold">
            USDL
          </span>
        </span>
      </span>
      <input
        className="rounded-lg pt-2 pb-1 px-2 bg-white appearance-none ring-1 ring-lyrebird-700 w-full text-xl focus:outline-none focus:bg-white focus:ring-2 leading-tight"
        type="number"
        value={repaymentValue.toString()}
        placeholder="0.0"
        onChange={(event) => setRepaymentValue(event.target.value)}
      />
    </div>
  );

  async function setWalletDisconnected() {
    // Swap button
    setContractState((prevContractState) => ({
      ...prevContractState,
      usdlPrice: 0,
      bneoPrice: 0,
      bneoBalance: 0,
      loanBalance: 0,
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
    if (wallet !== EmptyWallet) {
      setShowLoadingDialog(true);
      if (globalState.isWalletConnected) {
        setWalletConnected();
      } else {
        setWalletDisconnected();
      }
    }
  }, [globalState.isWalletConnected, wallet]);

  useEffect(() => {
    setRefreshBalances();
  }, [contractState]);

  useEffect(() => {
    setShowLoadingDialog(true);
    initWallets();
    initNotification();
  }, []);

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

  const loanToValue = computeLoanToValue(
    contractState.usdlPrice,
    contractState.loanBalance,
    contractState.bneoPrice,
    contractState.bneoBalance,
  );
  return (
    <div className="antialiased text-gray-600 flex flex-col h-screen min-w-400">
      <Meta title={Config.title} description={Config.description} />
      <Navbar />
      <main className="flex flex-grow justify-center">
        <div className="max-w-screen-lg w-11/12 md:w-3/4">
          <div className="px-2 pt-6 flex justify-between items-center">
            <span className="text-3xl text-gray-800 font-semibold pt-4">Borrow</span>
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
                  <span className="text-xl font-medium">My Collateral</span>
                </div>
                <div className="mr-4 mt-6 flex justify-end">
                  <span className="text-lg font-normal flex items-center">
                    <BNEOIcon width={24} height={24} className="mr-2" />
                    <span>
                      {contractState.bneoBalance}
                      {' '}
                      <span className="font-semibold">
                        bNEO
                      </span>
                    </span>
                  </span>
                </div>
                <div className="mr-4 mt-2 flex justify-end">
                  <span className="text-base font-semibold items-center">
                    ~ $
                    {' '}
                    {(contractState.bneoPrice * contractState.bneoBalance)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2, maximumFractionDigits: 2,
                      })}
                  </span>
                </div>
                <div className="flex h-full" />
                <div className="mb-4 flex w-full justify-end">
                  <span className="mx-2">
                    <GeneralButton text="Deposit" onClick={() => setShowDepositCollateralDialog(true)} />
                  </span>
                  <span className="mx-2">
                    <GeneralButton text="Withdraw" onClick={() => setShowWithdrawCollateralDialog(true)} />
                  </span>
                </div>
              </div>
            </WhitePanel>
            <WhitePanel>
              <div className="mx-8 my-4 flex flex-col w-full">
                <div className="mt-4">
                  <span className="text-xl font-medium">My Loans</span>
                </div>
                <div className="mr-4 mt-6 flex justify-end">
                  <span className="text-lg font-normal flex items-center">
                    <USDLIcon width={24} height={24} className="mr-2" />
                    <span>
                      {contractState.loanBalance.toLocaleString(undefined, {
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
                    {(contractState.usdlPrice * contractState.loanBalance)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2, maximumFractionDigits: 2,
                      })}
                  </span>
                </div>
                <div className="flex h-full" />
                <div className="mb-4 flex w-full justify-end">
                  <span className="mx-2">
                    <GeneralButton text="Borrow" onClick={() => setShowBorrowDialog(true)} />
                  </span>
                  <span className="mx-2">
                    <GeneralButton text="Repay" onClick={() => setShowRepayDialog(true)} />
                  </span>
                </div>
              </div>
            </WhitePanel>
            <WhitePanel>
              <div className="mx-8 my-4 flex flex-col w-full">
                <div className="mt-4">
                  <span className="text-xl font-medium">Loan Health</span>
                </div>
                <div className="mr-4 mt-6 flex justify-between">
                  <span className="text-lg font-normal flex items-center">
                    Current Loan-to-Value:
                  </span>
                  <span className="text-lg font-semibold flex items-center">
                    {loanToValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2, maximumFractionDigits: 2,
                    })}
                    %
                  </span>
                </div>
                <div className="mr-4 mt-2 flex justify-between">
                  <span className="text-lg font-normal flex items-center">
                    Minimum Loan-to-Value:
                  </span>
                  <span className="text-lg font-semibold flex items-center">
                    {contractState.bneoLoanToValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2, maximumFractionDigits: 2,
                    })}
                    %
                  </span>
                </div>
                <div className="mr-4 mt-8 flex justify-between">
                  <span className="text-lg font-semibold flex items-center">
                    Loan Status:
                  </span>
                  <span className={`text-lg font-bold items-center ${getHealthColor(contractState.bneoLoanToValue, loanToValue)}`}>
                    {getHealthString(contractState.bneoLoanToValue, loanToValue)}
                  </span>
                </div>
              </div>
            </WhitePanel>
            <WhitePanel>
              <div className="mx-8 my-4 flex flex-col w-full">
                <div className="mt-4">
                  <span className="text-xl font-medium">Borrow APR</span>
                </div>
                <div className="mt-6">
                  <span className="text-lg font-normal">
                    {contractState.r0.toLocaleString(undefined, {
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
        open={showDepositCollateralDialog}
        title="Deposit Collateral"
        confirmButtonText="Deposit"
        onClose={() => { setDepositCollateralValue(''); setShowDepositCollateralDialog(false); }}
        onConfirm={(deposit: string) => depositCollateral(+deposit)}
        onConfirmData={depositCollateralValue}
        canClose
      >
        {depositCollateralPanel}
      </ConfirmDialog>
      <ConfirmDialog
        open={showWithdrawCollateralDialog}
        title="Withdraw Collateral"
        confirmButtonText="Withdraw"
        onClose={() => { setWithdrawCollateralValue(''); setShowWithdrawCollateralDialog(false); }}
        onConfirm={(withdrawal: string) => withdrawCollateral(+withdrawal)}
        onConfirmData={withdrawCollateralValue}
        canClose
      >
        {withdrawCollateralPanel}
      </ConfirmDialog>
      <ConfirmDialog
        open={showBorrowDialog}
        title="Borrow"
        confirmButtonText="Borrow"
        onClose={() => { setBorrowValue(''); setShowBorrowDialog(false); }}
        onConfirm={(borrow: string) => borrowUsdl(+borrow)}
        onConfirmData={borrowValue}
        canClose
      >
        {borrowPanel}
      </ConfirmDialog>
      <ConfirmDialog
        open={showRepayDialog}
        title="Repay"
        confirmButtonText="Repay"
        onClose={() => { setRepaymentValue(''); setShowRepayDialog(false); }}
        onConfirm={(repayment: string) => repayUsdl(+repayment)}
        onConfirmData={repaymentValue}
        canClose
      >
        {repayPanel}
      </ConfirmDialog>
      <Alert text={alertText} open={showAlert} onClose={() => setShowAlert(false)} />
      <Footer />
    </div>
  );
};

export { BorrowPage };
