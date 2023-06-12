import { ExecuteEvent, Transaction, Block, Message } from "../types";
import {
  CosmosEvent,
  CosmosBlock,
  CosmosTransaction,
  CosmosMessage,
} from "@subql/types-cosmos";

export async function handleBlock(block: CosmosBlock): Promise<void> {
  const blockRecord = Block.create({
    id: block.block.id,
    height: BigInt(block.block.header.height),
  });
  await blockRecord.save();
}

export async function handleMsgSend(msg: CosmosMessage): Promise<void> {
  const messageRecord = Message.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    typeUrl: msg.msg.typeUrl,
    value: JSON.stringify(msg.msg.decodedMsg),
    from: msg.msg.decodedMsg.fromAddress,
    hash: msg.tx.hash,
  });
  await messageRecord.save();
}

export async function handleMsgMultiSend(msg: CosmosMessage): Promise<void> {
  const messageRecord = Message.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    typeUrl: msg.msg.typeUrl,
    value: JSON.stringify(msg.msg.decodedMsg),
    from: msg.msg.decodedMsg.inputs[0].address,
    hash: msg.tx.hash,
  });
  await messageRecord.save();
}

export async function handleMsgGrant(msg: CosmosMessage): Promise<void> {
  const messageRecord = Message.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    typeUrl: msg.msg.typeUrl,
    value: JSON.stringify(msg.msg.decodedMsg),
    from: msg.msg.decodedMsg.granter,
    hash: msg.tx.hash,
  });
  await messageRecord.save();
}

export async function handleMsgRevoke(msg: CosmosMessage): Promise<void> {
  const messageRecord = Message.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    typeUrl: msg.msg.typeUrl,
    value: JSON.stringify(msg.msg.decodedMsg),
    from: msg.msg.decodedMsg.granter,
    hash: msg.tx.hash,
  });
  await messageRecord.save();
}

export async function handleMsgExec(msg: CosmosMessage): Promise<void> {
  const messageRecord = Message.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    typeUrl: msg.msg.typeUrl,
    value: JSON.stringify(msg.msg.decodedMsg),
    from: msg.msg.decodedMsg.grantee,
    hash: msg.tx.hash,
  });
  await messageRecord.save();
}

export async function handleMsgDelegate(msg: CosmosMessage): Promise<void> {
  const messageRecord = Message.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    typeUrl: msg.msg.typeUrl,
    value: JSON.stringify(msg.msg.decodedMsg),
    from: msg.msg.decodedMsg.delegatorAddress,
    hash: msg.tx.hash,
  });
  await messageRecord.save();
}

export async function handleMsgUndelegate(msg: CosmosMessage): Promise<void> {
  const messageRecord = Message.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    typeUrl: msg.msg.typeUrl,
    value: JSON.stringify(msg.msg.decodedMsg),
    from: msg.msg.decodedMsg.delegatorAddress,
    hash: msg.tx.hash,
  });
  await messageRecord.save();
}

export async function handleMsgBeginRedelegate(msg: CosmosMessage): Promise<void> {
  const messageRecord = Message.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    typeUrl: msg.msg.typeUrl,
    value: JSON.stringify(msg.msg.decodedMsg),
    from: msg.msg.decodedMsg.delegatorAddress,
    hash: msg.tx.hash,
  });
  await messageRecord.save();
}

export async function handleMsgCancelUnbondingDelegation(msg: CosmosMessage): Promise<void> {
  const messageRecord = Message.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    typeUrl: msg.msg.typeUrl,
    value: JSON.stringify(msg.msg.decodedMsg),
    from: msg.msg.decodedMsg.delegatorAddress,
    hash: msg.tx.hash,
  });
  await messageRecord.save();
}

export async function handleMsgCreateValidator(msg: CosmosMessage): Promise<void> {
  const messageRecord = Message.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    typeUrl: msg.msg.typeUrl,
    value: JSON.stringify(msg.msg.decodedMsg),
    from: msg.msg.decodedMsg.validatorAddress,
    hash: msg.tx.hash,
  });
  await messageRecord.save();
}

export async function handleMsgEditValidator(msg: CosmosMessage): Promise<void> {
  const messageRecord = Message.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    typeUrl: msg.msg.typeUrl,
    value: JSON.stringify(msg.msg.decodedMsg),
    from: msg.msg.decodedMsg.validatorAddress,
    hash: msg.tx.hash,
  });
  await messageRecord.save();
}

export async function handleMsgWithdrawDelegatorReward(msg: CosmosMessage): Promise<void> {
  const messageRecord = Message.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    from: msg.msg.decodedMsg.delegatorAddress,
    typeUrl: msg.msg.typeUrl,
    value: JSON.stringify(msg.msg.decodedMsg),
    hash: msg.tx.hash,
  });
  await messageRecord.save();
}

export async function handleTransaction(tx: CosmosTransaction): Promise<void> {
  const transactionRecord = Transaction.create({
    id: tx.hash,
    blockHeight: BigInt(tx.block.block.header.height),
    timestamp: new Date(tx.block.block.header.time.toISOString()),
    memo: tx.decodedTx.body.memo,
  });
  await transactionRecord.save();
}

export async function handleMsgTransfer(msg: CosmosMessage): Promise<void> {
  const messageRecord = Message.create({
    id: `${msg.tx.hash}-${msg.idx}`,
    from: msg.msg.decodedMsg.sender,
    typeUrl: msg.msg.typeUrl,
    value: JSON.stringify(msg.msg.decodedMsg),
    hash: msg.tx.hash,
  });
  await messageRecord.save();
}

export async function handleWasmEvent(event: CosmosEvent): Promise<void> {
  const eventRecord = ExecuteEvent.create({
    id: `${event.tx.hash}-${event.msg.idx}-${event.idx}`,
    blockHeight: BigInt(event.block.block.header.height),
    txHash: event.tx.hash,
    contractAddress: event?.event?.attributes?.find(attr => attr.key === '_contract_address')?.value
  });

  await eventRecord.save();

  let value = "";
  event?.event?.attributes?.forEach(attr => {
    if (attr.key === 'contract_address') {
      return;
    }
    value += `${attr.key}: ${attr.value}\n`;
  });

  if (event?.event?.attributes?.find(attr => attr.key === 'action')?.value === 'buy_credits') {
    const messageRecord = await Message.create({
      id: `${event.tx.hash}-${event.msg.idx}`,
      typeUrl: 'buyCredits',
      value: value,
      from: event?.event?.attributes?.find(attr => attr.key === 'buyer')?.value,
      hash: event.tx.hash
    });
    await messageRecord.save();
  }
}
