import React from 'react';
import Modal from 'react-modal';

import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import styles from './index.module.css';
import { useAuth } from '../../../../hooks/use-auth-client';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    color: 'white',
    background: 'linear-gradient(0deg, #1C1D26, #1C1D26), linear-gradient(0deg, #2C2D3B, #2C2D3B)',
    width: '324px',
    height: '222px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid #2C2D3B',
    borderRadius: '16px',
    padding: '32px',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
};

function SupplyPopup({
  isClaimOpen,
  closeClaim,
  value,
  setUpdateUI,
}) {
  const { depositActor, principal } = useAuth();

  const [loading, setLoading] = React.useState(false);

  const closeModal = () => {
    closeClaim();
    setLoading(false);
  };
  const withdrawAllInterest = async () => {
    // withdrawInterestAll
    if (principal) {
      try {
        setLoading(true);
        const tx = await depositActor.withdrawInterestAll();
        if ('Ok' in tx) {
          toast.success('Claim successfull');
          closeModal();
          setLoading(false);
          setUpdateUI((prev) => !prev);
        } else {
          console.log('Claim: ', tx);
          toast.error('Claim failed');
          closeModal();
          setLoading(false);
        }
      } catch (error) {
        console.log('Error in Claim: ', error);
        toast.error('Claim error');
        closeModal();
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isClaimOpen}
      onRequestClose={closeClaim}
      style={customStyles}
    >

      <div>
        <div style={{ textAlign: 'center', fontWeight: 500 }}>
          I confirm claiming of
          {' '}
          {value && Math.round(value * 1000) / 1000}
          {!value && '0'}
          {' '}
          ckETH
        </div>
      </div>

      <button
        type="button"
        className={styles.ButtonContainer}
        style={{ marginBottom: '8px', marginTop: '44px' }}
        disabled={loading}
        onClick={withdrawAllInterest}
      >
        {loading ? 'Loading...' : 'Claim'}
        <div className={styles.Ellipse} />
      </button>
      <button
        type="button"
        style={{
          color: 'rgba(133, 134, 151, 1)',
          fontSize: '14px',
          backgroundColor: 'rgba(28, 29, 38, 1)',
          margin: '0px',
          textAlign: 'center',
          width: '100%',
          padding: '0',
        }}
        onClick={closeClaim}
      >
        Cancel
      </button>
    </Modal>
  );
}

SupplyPopup.propTypes = {
  isClaimOpen: PropTypes.bool.isRequired,
  closeClaim: PropTypes.func.isRequired,
  value: PropTypes.number,
  setUpdateUI: PropTypes.func.isRequired,
};

SupplyPopup.defaultProps = {
  value: 0,
};

export default SupplyPopup;
