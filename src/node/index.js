// src/node/index.js
import fetch from 'isomorphic-fetch';
import { HttpAgent } from '@dfinity/agent';
import { createRequire } from 'node:module';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { Principal } from '@dfinity/principal';
import { canisterId, createActor } from '../declarations/borrow/index.js';
import { identity } from './identity.js';

const uri = 'mongodb+srv://devckx:8e1PWJamFy8iM3o3@cluster0.8uitpxr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Require syntax is needed for JSON file imports
const require = createRequire(import.meta.url);
const localCanisterIds = require('../../.dfx/local/canister_ids.json');

// Use `process.env` if available provoded, or fall back to local
const effectiveCanisterId = canisterId?.toString() ?? localCanisterIds.borrow.local;
// const effectiveCanisterId = 'be2us-64aaa-aaaaa-qaabq-cai';

const agent = new HttpAgent({
  identity,
  host: 'http://127.0.0.1:4943',
  fetch,
});

const actor = createActor(effectiveCanisterId, {
  agent,
});

async function main() {
  setInterval(async () => {
    // const update = await actor.updateA();
    // const mintResult1 = await actor.valueA();
    // const mintResult = await actor.user();
    const result = await actor.checkRemoveLP([Principal.fromText('37her-33fjq-rfwha-qivgx-d6vla-k5m2i-h2g4r-nblsc-6adue-7bn7m-sae')]);
    console.log('result: ', result);
  }, [3000]);
}

main();

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db('admin').command({ ping: 1 });
//     console.log('Pinged your deployment. You successfully connected to MongoDB!');
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

// // Define a schema
// const itemSchema = new client.Schema({
//   id: { type: Number, required: true, unique: true },
//   borrower: { type: String, required: true },
// });

// // Create a model
// const Item = client.model('Item', itemSchema);
// // CRUD Operations

// // Create (Add to DB)
// const addItem = async (itemId, borrowerName) => {
//   try {
//     const newItem = new Item({ id: itemId, borrower: borrowerName });
//     await newItem.save();
//     console.log('Item added:', newItem);
//   } catch (error) {
//     console.error('Error adding item:', error);
//   }
// };

// // Read (Find by ID)
// const findItemById = async (itemId) => {
//   try {
//     const item = await Item.findOne({ id: itemId });
//     console.log('Item found:', item);
//   } catch (error) {
//     console.error('Error finding item:', error);
//   }
// };

// // Update (Update borrower by ID)
// const updateBorrowerById = async (itemId, newBorrower) => {
//   try {
//     const item = await Item.findOneAndUpdate(
//       { id: itemId },
//       { borrower: newBorrower },
//       { new: true },
//     );
//     console.log('Item updated:', item);
//   } catch (error) {
//     console.error('Error updating item:', error);
//   }
// };

// // Delete (Remove by ID)
// const deleteItemById = async (itemId) => {
//   try {
//     const item = await Item.findOneAndDelete({ id: itemId });
//     console.log('Item deleted:', item);
//   } catch (error) {
//     console.error('Error deleting item:', error);
//   }
// };

// // Usage
// addItem(1, 'John Doe');
// findItemById(1);
// updateBorrowerById(1, 'Jane Doe');
// deleteItemById(1);
