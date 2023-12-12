import React, { useState } from 'react';
import BorrowPopup from './popups/Borrow/BorrowPopup';
import WithdrawPopup from './popups/Withdraw/WithdrawPopup';
import SupplyPopup from './popups/Supply/SupplyPopup';
import RepayPopup from './popups/Repay/RepayPopup';

function BorrowPage() {
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);

  const openRepayModal = () => {
    setIsRepayModalOpen(true);
  };

  const closeRepayModal = () => {
    setIsRepayModalOpen(false);
  };

  const openBorrowModal = () => {
    setIsBorrowModalOpen(true);
  };

  const closeBorrowModal = () => {
    setIsBorrowModalOpen(false);
  };

  const openWithdrawModal = () => {
    setIsWithdrawModalOpen(true);
  };

  const closeWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
  };

  const openSupplyModal = () => {
    setIsSupplyModalOpen(true);
  };

  const closeSupplyModal = () => {
    setIsSupplyModalOpen(false);
  };

  return (
    <div>
      BorrowPage

      <button type="button" onClick={openBorrowModal}>Open Borrow Modal</button>
      <button type="button" onClick={openWithdrawModal}>Open Withdraw Modal</button>
      <button type="button" onClick={openSupplyModal}>Open Supply Modal</button>
      <button type="button" onClick={openRepayModal}>Open Repay Modal</button>

      <BorrowPopup
        isBorrowModalOpen={isBorrowModalOpen}
        closeBorrowModal={closeBorrowModal}
      />
      <WithdrawPopup
        isWithdrawModalOpen={isWithdrawModalOpen}
        closeWithdrawModal={closeWithdrawModal}
      />
      <SupplyPopup
        isSupplyModalOpen={isSupplyModalOpen}
        closeSupplyModal={closeSupplyModal}
      />
      <RepayPopup
        isRepayModalOpen={isRepayModalOpen}
        closeRepayModal={closeRepayModal}
      />
    </div>
  );
}

export default BorrowPage;
