import React from 'react';
import {
  DepositIcon,
} from '../Utils';
import styles from './index.module.css';

function Deposit() {
  return (
    <div>
      <div className={styles.RightHeader}>
        <DepositIcon />
        Deposit
      </div>
      <div>
        Deposit tokens to start earning trading fees and more rewards.
      </div>
      <div style={{ marginTop: '32px' }}>
        <img src="/frontend/assets/deposit.png" width="60%" alt="" />
      </div>
      {/* <div className={styles.Deposit}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className={styles.RightTitle}>TOKEN TO DEPOSIT</div>
          <svg style={{ marginLeft: '10px', cursor: 'pointer' }} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.7439 15.7206L20.1043 15.3289V15.3289L20.7439 15.7206ZM19.7893 17.2794L20.429 17.6711V17.6711L19.7893 17.2794ZM3.25608 8.27942L2.61646 7.88775H2.61646L3.25608 8.27942ZM4.21062 6.72057L4.85023 7.11223L4.21062 6.72057ZM6.8185 6.06172L7.17708 5.403L7.17708 5.403L6.8185 6.06172ZM3.95485 10.7383L3.59627 11.397H3.59627L3.95485 10.7383ZM17.1815 17.9383L16.8229 18.597L16.8229 18.597L17.1815 17.9383ZM20.0451 13.2617L19.6865 13.9204V13.9205L20.0451 13.2617ZM4.21062 17.2794L3.57101 17.6711L3.57101 17.6711L4.21062 17.2794ZM3.25607 15.7206L3.89568 15.3289L3.89568 15.3289L3.25607 15.7206ZM19.7893 6.72058L20.429 6.32892V6.32892L19.7893 6.72058ZM20.7439 8.27943L20.1043 8.67109V8.67109L20.7439 8.27943ZM20.0451 10.7383L20.4037 11.397L20.0451 10.7383ZM17.1815 6.06174L17.5401 6.72046V6.72046L17.1815 6.06174ZM3.95485 13.2617L4.31343 13.9205H4.31343L3.95485 13.2617ZM6.8185 17.9383L6.45992 17.2795L6.45992 17.2795L6.8185 17.9383ZM17.08 6.11698L16.7214 5.45825L17.08 6.11698ZM6.91999 6.11697L6.5614 6.77569L6.5614 6.77569L6.91999 6.11697ZM17.08 17.883L17.4386 17.2243L17.4386 17.2243L17.08 17.883ZM6.91998 17.883L7.27856 18.5418L7.27857 18.5418L6.91998 17.883ZM11.0454 3.75H12.9545V2.25H11.0454V3.75ZM12.9545 20.25H11.0454V21.75H12.9545V20.25ZM11.0454 20.25C10.3631 20.25 9.88634 19.7389 9.88634 19.2H8.38634C8.38634 20.6493 9.61905 21.75 11.0454 21.75V20.25ZM14.1136 19.2C14.1136 19.7389 13.6369 20.25 12.9545 20.25V21.75C14.3809 21.75 15.6136 20.6493 15.6136 19.2H14.1136ZM12.9545 3.75C13.6369 3.75 14.1136 4.26107 14.1136 4.8H15.6136C15.6136 3.35071 14.3809 2.25 12.9545 2.25V3.75ZM11.0454 2.25C9.61905 2.25 8.38634 3.35071 8.38634 4.8H9.88634C9.88634 4.26107 10.3631 3.75 11.0454 3.75V2.25ZM20.1043 15.3289L19.1497 16.8878L20.429 17.6711L21.3835 16.1122L20.1043 15.3289ZM3.89569 8.67108L4.85023 7.11223L3.57101 6.32891L2.61646 7.88775L3.89569 8.67108ZM4.85023 7.11223C5.15887 6.6082 5.88053 6.40506 6.45992 6.72045L7.17708 5.403C5.93025 4.72428 4.31674 5.11109 3.57101 6.32891L4.85023 7.11223ZM4.31344 10.0795C3.75745 9.77688 3.60428 9.14696 3.89569 8.67108L2.61646 7.88775C1.8535 9.13373 2.32605 10.7055 3.59627 11.397L4.31344 10.0795ZM19.1497 16.8878C18.8411 17.3918 18.1194 17.5949 17.5401 17.2795L16.8229 18.597C18.0697 19.2757 19.6832 18.8889 20.429 17.6711L19.1497 16.8878ZM21.3835 16.1122C22.1465 14.8663 21.6739 13.2945 20.4037 12.603L19.6865 13.9205C20.2425 14.2231 20.3957 14.853 20.1043 15.3289L21.3835 16.1122ZM4.85023 16.8878L3.89568 15.3289L2.61646 16.1122L3.57101 17.6711L4.85023 16.8878ZM19.1497 7.11225L20.1043 8.67109L21.3835 7.88777L20.429 6.32892L19.1497 7.11225ZM20.1043 8.67109C20.3957 9.14697 20.2425 9.77689 19.6865 10.0795L20.4037 11.397C21.6739 10.7055 22.1465 9.13374 21.3835 7.88777L20.1043 8.67109ZM17.5401 6.72046C18.1194 6.40507 18.8411 6.60822 19.1497 7.11225L20.429 6.32892C19.6832 5.1111 18.0697 4.72429 16.8229 5.40301L17.5401 6.72046ZM3.89568 15.3289C3.60428 14.853 3.75745 14.2231 4.31343 13.9205L3.59627 12.603C2.32604 13.2945 1.8535 14.8663 2.61646 16.1122L3.89568 15.3289ZM3.57101 17.6711C4.31674 18.8889 5.93025 19.2757 7.17708 18.597L6.45992 17.2795C5.88053 17.5949 5.15887 17.3918 4.85023 16.8878L3.57101 17.6711ZM17.4386 6.7757L17.5401 6.72046L16.8229 5.40301L16.7214 5.45825L17.4386 6.7757ZM6.45992 6.72045L6.5614 6.77569L7.27857 5.45824L7.17708 5.403L6.45992 6.72045ZM17.5401 17.2795L17.4386 17.2243L16.7214 18.5417L16.8229 18.597L17.5401 17.2795ZM6.56141 17.2243L6.45992 17.2795L7.17708 18.597L7.27856 18.5418L6.56141 17.2243ZM3.59627 11.397C4.07402 11.6571 4.07402 12.3429 3.59627 12.603L4.31343 13.9205C5.83497 13.0922 5.83497 10.9078 4.31344 10.0795L3.59627 11.397ZM7.27857 18.5418C7.77797 18.2699 8.38634 18.6314 8.38634 19.2H9.88634C9.88634 17.4934 8.06033 16.4084 6.5614 17.2243L7.27857 18.5418ZM15.6136 19.2C15.6136 18.6314 16.222 18.2699 16.7214 18.5417L17.4386 17.2243C15.9396 16.4083 14.1136 17.4934 14.1136 19.2H15.6136ZM20.4037 12.603C19.926 12.3429 19.926 11.6571 20.4037 11.397L19.6865 10.0795C18.165 10.9078 18.165 13.0922 19.6865 13.9204L20.4037 12.603ZM6.5614 6.77569C8.06033 7.59165 9.88634 6.50663 9.88634 4.8H8.38634C8.38634 5.3686 7.77797 5.7301 7.27857 5.45824L6.5614 6.77569ZM16.7214 5.45825C16.222 5.73011 15.6136 5.36861 15.6136 4.8H14.1136C14.1136 6.50663 15.9396 7.59166 17.4386 6.7757L16.7214 5.45825ZM14.25 12C14.25 13.2426 13.2426 14.25 12 14.25V15.75C14.0711 15.75 15.75 14.0711 15.75 12H14.25ZM12 14.25C10.7574 14.25 9.74999 13.2426 9.74999 12H8.24999C8.24999 14.0711 9.92893 15.75 12 15.75V14.25ZM9.74999 12C9.74999 10.7574 10.7574 9.75 12 9.75V8.25C9.92893 8.25 8.24999 9.92893 8.24999 12H9.74999ZM12 9.75C13.2426 9.75 14.25 10.7574 14.25 12H15.75C15.75 9.92893 14.0711 8.25 12 8.25V9.75Z" fill="#858697" />
          </svg>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <img src="/frontend/assets/ckBTC.png" width={24} height={24} alt="" />
              <div style={{ fontSize: '16px' }}>BTC</div>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 300 }}>Balance: 1.17</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Deposit;
