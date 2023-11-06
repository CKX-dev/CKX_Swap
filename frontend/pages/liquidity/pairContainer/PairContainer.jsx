import React, { useEffect, useState } from 'react';

import PairCard from '../../../components/pairCard/PairCard';

import { useAuth } from '../../../hooks/use-auth-client';

import styles from './index.module.css';

function PairContainer() {
  const {
    swapActor,
  } = useAuth();

  const [pairs, setPairs] = useState([]);

  useEffect(() => {
    const handleGetPairs = async () => {
      const res = await swapActor.getAllPairs();
      setPairs(res);
    };

    if (swapActor) {
      handleGetPairs();
    }
  }, [swapActor]);

  return (
    <div className={styles.PairContainer}>
      {pairs.slice(0, 4).map((pair) => (
        <PairCard key={pair.id} pair={pair} />
      ))}
    </div>
  );
}

export default PairContainer;
