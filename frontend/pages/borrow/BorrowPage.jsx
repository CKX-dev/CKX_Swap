import React from 'react';
import BorrowContainer from './BorrowContainer';
import BorrowContainerForOneToken from './BorrowContainerForOneToken';

function BorrowPage() {
  return (
    <div style={{ paddingBottom: '50px' }}>
      <BorrowContainer pairName="ckBTC<>ckETH" />
      <BorrowContainerForOneToken pairName="ckETH<>d.ckETH" />
      <BorrowContainerForOneToken pairName="ckBTC<>d.ckBTC" />
    </div>
  );
}

export default BorrowPage;
