// src/node/index.js
import fetch from 'isomorphic-fetch';
import { HttpAgent } from '@dfinity/agent';
import { createRequire } from 'node:module';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { Principal } from '@dfinity/principal';
import { canisterId, createActor } from '../declarations/borrow/index.js';
import { identity } from './identity.js';

const uri = 'mongodb+srv://minhloc2802:Saikikusuo333@cluster0.budz48r.mongodb.net/';

// Require syntax is needed for JSON file imports
const require = createRequire(import.meta.url);
// const isDev = process.env.DFX_NETWORK !== 'ic';
const isDev = false;
let localCanisterIds;
if (isDev) {
  localCanisterIds = require('../../.dfx/local/canister_ids.json');
} else {
  localCanisterIds = require('../../canister_ids.json');
}

// Use `process.env` if available provoded, or fall back to local
const effectiveCanisterId = canisterId?.toString()
?? (isDev ? localCanisterIds.borrow.local : localCanisterIds.borrow.ic);
const effectiveCanisterId0 = canisterId?.toString()
?? (isDev ? localCanisterIds.borrow0.local : localCanisterIds.borrow0.ic);
const effectiveCanisterId1 = canisterId?.toString()
?? (isDev ? localCanisterIds.borrow1.local : localCanisterIds.borrow1.ic);
// const effectiveCanisterId = 'be2us-64aaa-aaaaa-qaabq-cai';

const agent = new HttpAgent({
  identity: await identity,
  host: 'https://icp-api.io',
  // host: 'http://127.0.0.1:4943',
  fetch,
  timeout: 30000,
});

const actor = createActor(effectiveCanisterId, {
  agent,
});
const actor0 = createActor(effectiveCanisterId0, {
  agent,
});
const actor1 = createActor(effectiveCanisterId1, {
  agent,
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 60000,
  connectTimeoutMS: 60000,
  retryWrites: true,
});

async function withRetry(fn, retries = 5, delay = 1000, backoffFactor = 2) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      console.log(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt < retries) {
        const backoffDelay = delay * backoffFactor ** (attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      } else {
        throw error;
      }
    }
  }
}

const db = client.db('ICP');
const collection = db.collection('CKX');
const collection0 = db.collection('CKX0');
const collection1 = db.collection('CKX1');

async function main() {
  setInterval(async () => {
    await Promise.all([
      processBorrowCanister(actor, collection),
      processBorrowCanister(actor0, collection0),
      processBorrowCanister(actor1, collection1)
    ]);
  }, [60000]);

  setInterval(async () => {
    try {
      console.log('send interest');
      await Promise.all([
        withRetry(() => actor.sendInterestToLendingCanister()).then(result => {
          console.log('actor.sendInterestToLendingCanister result:', result);
          return result;
        }),
        withRetry(() => actor0.sendInterestToLendingCanister()).then(result => {
          console.log('actor0.sendInterestToLendingCanister result:', result);
          return result;
        }),
        withRetry(() => actor1.sendInterestToLendingCanister()).then(result => {
          console.log('actor1.sendInterestToLendingCanister result:', result);
          return result;
        })
      ]);
    } catch (error) {
      console.error('Error in sendInterestToLendingCanister:', error);
    }
  }, 120000); // 3600000
}

async function processBorrowCanister(borrowActor, col) {
  const len = await getLength(col);

  if (len >= 1) {
    const currentLoanId = Number(await borrowActor.getloanId());
    const lastUser = await col.findOne({}, { sort: { _id: -1 } });

    if (lastUser.id < currentLoanId) {
      let i = lastUser.id;
      while (i <= currentLoanId) {
        const newLoan = await borrowActor.getLoanDetail(i);
        if (!newLoan[0].isRepaid) {
          await insertUser(
            col,
            Number(newLoan[0].id),
            (newLoan[0].borrower).toText(),
            newLoan[0].tokenIdBorrow,
            newLoan[0].isRepaid,
          );
        } else {
          // Update MongoDB record to mark loan as repaid
          await updateLoanStatus(col, Number(newLoan[0].id), true);
        }
        i += 1;
      }
    } else {
      // Remove existing records with isRepaid set to true
      let i = lastUser.id;
      while (i <= currentLoanId) {
        const newLoan = await borrowActor.getLoanDetail(i);
        if (!newLoan[0].isRepaid) {
          await insertUser(
            col,
            Number(newLoan[0].id),
            (newLoan[0].borrower).toText(),
            newLoan[0].tokenIdBorrow,
            newLoan[0].isRepaid,
          );
        } else {
          // Update MongoDB record to mark loan as repaid
          await updateLoanStatus(col, Number(newLoan[0].id), true);
        }
        i += 1;
      }

      await removeRepaidRecords(col);

      // Fetch borrower principals for non-repaid loans
      const borrowerList = await getNonRepaidBorrowers(col);

      try {
        const result = await borrowActor.checkRemoveLP(borrowerList);
        console.log('result: ', result);
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    const currentLoanId = await borrowActor.getloanId();
    if (currentLoanId !== 0) {
      let i = 1;
      while (i <= currentLoanId) {
        const newLoan = await borrowActor.getLoanDetail(i);
        if (!newLoan[0].isRepaid) {
          await insertUser(
            col,
            Number(newLoan[0].id),
            (newLoan[0].borrower).toText(),
            newLoan[0].tokenIdBorrow.toText(),
            newLoan[0].isRepaid,
          );
        } else {
          // Update MongoDB record to mark loan as repaid
          await updateLoanStatus(col, Number(newLoan[0].id), true);
        }
        i += 1;
      }
    }
  }
}

main();

async function run() {
  await withRetry(() => client.connect({
    ssl: true,
    tls: true,
  }));
  await client.db('admin').command({ ping: 1 });
  console.log('Pinged your deployment. You successfully connected to MongoDB!');
  getLength(collection);
  getLength(collection0);
  getLength(collection1);
}
run().catch(console.dir);

const insertUser = async (col, userId, borrower, tokenIdBorrow, isRepaid) => {
  const document = {
    id: userId,
    borrower,
    tokenIdBorrow,
    isRepaid,
  };

  // Check if a record with the same id already exists
  const existingRecord = await col.findOne({ id: userId });

  if (existingRecord) {
    // If a record with the same id exists, update it
    await col.updateOne({ id: userId }, { $set: document });
    console.log(`Updated record with id ${userId}`);
  } else {
    // If no record with the same id exists, insert a new one
    await col.insertOne(document);
    console.log(`Inserted record with id ${userId}`);
  }
};

async function updateLoanStatus(col, loanId, isRepaidVa) {
  await col.updateOne({ id: loanId }, { $set: { isRepaid: isRepaidVa } });
}

const getLength = async (col) => {
  const count = await col.countDocuments();
  console.log('Number of users in the collection:', count);
  return count;
};

const removeRepaidRecords = async (col) => {
  const result = await col.deleteMany({ isRepaid: true });
  console.log(`Removed ${result.deletedCount} repaid records`);
};

const getNonRepaidBorrowers = async (col) => {
  const cursor = col.find({ isRepaid: false }, { borrower: 1, _id: 0 });
  const borrowerList = [];
  await cursor.forEach((document) => {
    borrowerList.push(Principal.fromText(document.borrower));
  });
  return borrowerList;
};
