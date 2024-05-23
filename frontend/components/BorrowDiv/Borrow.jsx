/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.css';
import BottomBorrow from './BottomBorrow/BottomBorrow';
import * as token0 from '../../../src/declarations/token0';
import * as token1 from '../../../src/declarations/token1';

// import Graph from '../../assets/Graph.png';

function Borrow(
  {
    openBorrowModal,
    openRepayModal,
    openWithdrawModal,
    openSupplyModal,
    tokenBalance,
    borrowInfo,
    balanceLpToken,
    balanceDeposit,
    healthRatio,
    isActive,
    avaiBorrow,
    avaiBorrowTotal,
  },
) {
  const [isShow, setIsShow] = React.useState(false);
  const handleShow = () => {
    setIsShow(!isShow);
  };

  const formatDate = ({ startTime, duration }) => {
    if (startTime == null || duration == null) {
      return 'dd-mm-yyyy';
    }

    const startTimeInMs = Number(startTime) / 1e6;
    const durationInMs = Number(duration) / 1e6;
    const repaymentDate = new Date(startTimeInMs + durationInMs);
    // Format the date as dd-mm-yyyy
    const day = String(repaymentDate.getDate()).padStart(2, '0');
    const month = String(repaymentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = repaymentDate.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  return (
    <div className={styles.Container}>
      <div style={{ textAlign: 'center', fontSize: '24px', marginBottom: '32px' }}>{'ckBTC<>ckETH'}</div>
      {/* <div className={styles.FlexCenter}>
        <div className={styles.TextCenter}>
          <div>
            <div>Average Swap fees APY</div>
            <div>(24hrs)</div>
          </div>
          <div style={{
            marginTop: '32px', paddingTop: '32px', borderTop: '1px solid rgba(44, 45, 59, 1)', color: '#83BD67',
          }}
          >
            NaN%
          </div>
        </div>
        <div className={styles.TextCenter}>
          <div>
            <div>Change to Average Borrow Fee APR </div>
            <div>(24hrs)</div>
          </div>
          <div style={{
            marginTop: '32px', marginBottom: '32px', paddingTop: '32px', borderTop: '1px solid rgba(44, 45, 59, 1)', color: '#BD6767',
          }}
          >
            NaN%
          </div>
        </div>
      </div> */}
      {/* {!isShow ? (
        <div className={styles.ShowMore} aria-hidden="true" onClick={handleShow}>
          <div>Show more</div>
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.1667 8.83358L10 13.0002L5.83334 8.83358" stroke="#858697" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )
        : (
          <div className={styles.ShowMore} aria-hidden="true" onClick={handleShow}>
            <div>Hide</div>
            <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.25 11.75L9 8L12.75 11.75" stroke="#858697" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )} */}
      { (
        <div>
          {/* <img width="100%" src={Graph} alt="" /> */}
          <div className={styles.ModalControls}>
            <div className={styles.ModalControlsItem}>
              <div>Available to supply</div>
              <div style={{ height: '43px' }}>
                <div>
                  <span style={{ fontWeight: 500, fontSize: '18px' }}>
                    {Math.round(Number(((balanceLpToken) / 10 ** 18)) * 10000)
                      / 10000}
                    {/* {parseFloat((Number(((balanceLpToken) / 10 ** 18))).toFixed(3)) || 0} */}
                  </span>
                  <span className={styles.MediumTitle}>
                    {' ckBTC <> ckETH LP token'}
                  </span>
                </div>
                <div style={{ color: '#858697', fontSize: '12px' }}># of ckBTC, # of ckETH</div>
              </div>
              <button type="button" style={{ width: '90%', marginBottom: '12px' }} className={styles.ButtonContainer} onClick={openSupplyModal}>
                Supply
                <div className={styles.Ellipse} />
              </button>
              <div>
                <div className={styles.MediumTitle}>TOTAL SUPPLY</div>
                <div style={{ marginTop: '8px' }}>
                  {Math.round((tokenBalance / 10 ** 18) * 100) / 100}
                  {' '}
                  <span className={styles.MediumTitle}>{'ckBTC <> ckETH LP token'}</span>
                  <div style={{ color: '#858697', fontSize: '12px' }}># of ckBTC, # of ckETH</div>
                </div>
              </div>
            </div>

            <div className={styles.ModalControlsItem}>
              <div>Available to borrow</div>
              <div style={{ display: 'flex', height: '25px' }}>
                <div className={styles.BorrowAvaiItem}>
                  <div style={{ marginBottom: '-8px' }}>
                    <span className={styles.largeNum}>
                      {!isActive
                        ? Math.round(Number(((avaiBorrow[0]) / 10 ** 18)) * 1000) / 1000 : 0}
                    </span>
                    {' '}
                    <span className={styles.MediumTitle}>ckBTC</span>
                  </div>
                  {/* <div className={styles.TextSmall}>{'< $ 0.01'}</div> */}
                </div>
                <div className={styles.BorrowAvaiItem} style={{ paddingLeft: '24px' }}>
                  <div style={{ marginBottom: '-8px' }}>
                    <span className={styles.largeNum}>
                      {!isActive
                        ? Math.round(Number(((avaiBorrow[1]) / 10 ** 18)) * 1000) / 1000 : 0}
                    </span>
                    {' '}
                    <span className={styles.MediumTitle}>ckETH</span>
                  </div>
                  {/* <div className={styles.TextSmall}>{'< $ 0.01'}</div> */}
                </div>
              </div>
              <button type="button" className={styles.ButtonContainer} onClick={openBorrowModal}>
                Borrow
                <div className={styles.Ellipse} />
              </button>
              <div className={styles.TextXSmall}>
                based on available LP, you may borrow up to
                {' '}
                {!isActive
                  ? Math.round(Number(((avaiBorrowTotal[0]) / 10 ** 18)) * 1000) / 1000 : 0}
                {' '}
                ckBTC or
                {' '}
                {!isActive
                  ? Math.round(Number(((avaiBorrowTotal[1]) / 10 ** 18)) * 1000) / 1000 : 0}
                {' '}
                ckETH
              </div>

              <div style={{ display: 'flex', marginTop: '12px' }}>
                <div className={styles.BorrowAvaiItem}>
                  <div className={styles.MediumTitlev2}>
                    OUTSTANDING LOAN
                  </div>
                  <div>
                    <span className={styles.largeNum}>
                      {!borrowInfo.isAllowWithdraw && borrowInfo.isActive
                          && ((parseFloat(Number(borrowInfo.borrow) / 10 ** 18)).toFixed(4))}
                      {borrowInfo.isAllowWithdraw
                        ? 0 : ''}
                    </span>
                    {' '}
                    <span className={styles.MediumTitle}>
                      {borrowInfo
                      && borrowInfo.tokenIdBorrow
                      && borrowInfo.tokenIdBorrow.toText() === token0.canisterId
                        ? 'ckBTC' : borrowInfo
                          && borrowInfo.tokenIdBorrow
                          && borrowInfo.tokenIdBorrow.toText() === token1.canisterId
                          ? 'ckETH' : '-'}
                    </span>
                  </div>
                  <div className={styles.TextXSmall}>
                    This amount will be automatically repaid on
                    {' '}
                    {formatDate(borrowInfo)}
                    {' '}
                    date
                  </div>
                </div>
                <div className={styles.BorrowAvaiItem} style={{ paddingLeft: '24px', paddingRight: '0px' }}>
                  <div className={styles.MediumTitlev2} style={{ display: 'flex' }}>
                    <div>HEALTH RATIO</div>
                    <svg style={{ marginLeft: '2px' }} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.50002 5.1665V5.74984M7.50002 7.20817V9.83317M7.50002 13.3332C10.7217 13.3332 13.3334 10.7215 13.3334 7.49984C13.3334 4.27818 10.7217 1.6665 7.50002 1.6665C4.27836 1.6665 1.66669 4.27818 1.66669 7.49984C1.66669 10.7215 4.27836 13.3332 7.50002 13.3332Z" stroke="#858697" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ color: '#83BD67', fontSize: '18px', fontWeight: 500 }}>
                    {borrowInfo.isActive && healthRatio
                      ? Math.round(Number(healthRatio) * 100) / 100 : 0}
                    %
                  </div>
                </div>
              </div>
              <button type="button" className={styles.ButtonContainer} onClick={openRepayModal}>
                Repay
                <div className={styles.Ellipse} />
              </button>
            </div>

            <div className={styles.ModalControlsItem}>
              <div>Available to withdraw</div>
              <div style={{ height: '43px' }}>
                <div>
                  <span style={{ fontWeight: 500, fontSize: '18px' }}>
                    {!isActive
                      ? Math.round(Number(((balanceDeposit) / 10 ** 18)) * 1000) / 1000 : 0}
                  </span>
                  <span className={styles.MediumTitle}>
                    {' ckBTC <> ckETH LP token'}
                  </span>
                </div>
                {/* <div style={{ color: '#858697', fontSize: '12px' }}>{'< $ 0.01'}</div> */}
              </div>
              <button type="button" style={{ width: '90%', marginBottom: '12px' }} className={styles.ButtonContainer} onClick={openWithdrawModal}>
                Withdraw
                <div className={styles.Ellipse} />
              </button>
              <div className={styles.TextXSmall}>
                Collateral withdrawal only after all loans are paid
              </div>
            </div>
          </div>
          <BottomBorrow />
        </div>
        )}
    </div>
  );
}

Borrow.propTypes = {
  openBorrowModal: PropTypes.func.isRequired,
  openRepayModal: PropTypes.func.isRequired,
  openWithdrawModal: PropTypes.func.isRequired,
  openSupplyModal: PropTypes.func.isRequired,
  tokenBalance: PropTypes.number,
  borrowInfo: PropTypes.object,
  balanceLpToken: PropTypes.number,
  balanceDeposit: PropTypes.number,
  healthRatio: PropTypes.number,
  isActive: PropTypes.bool,
  avaiBorrow: PropTypes.array,
  avaiBorrowTotal: PropTypes.array,
};

Borrow.defaultProps = {
  tokenBalance: 0,
  balanceLpToken: 0,
  balanceDeposit: 0,
  borrowInfo: {},
  healthRatio: 0,
  isActive: false,
  avaiBorrow: [0, 0],
  avaiBorrowTotal: [0, 0],
};

export default Borrow;
