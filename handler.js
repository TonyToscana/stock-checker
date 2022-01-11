const lenovo = require('./lenovoClient');
const telegram = require('./telegramClient');
const products = require('./productRepository');
const messageBuilder = require('./messageBuilder');
const log = require('./logger');

let callQueue = [];
let doUpdate = false;

async function getStock(product) {
  const oldStock = product.stock;
  const currentStock = await lenovo.getStock(product.productCode);

  if(hasStockChanged(oldStock, currentStock)) {
    await products.updateStock(product.productCode, currentStock);
    await log.log('stock', `Old stock: ${oldStock}; New stock: ${currentStock}; Product: ${JSON.stringify(product)}`);
  }

  return currentStock;
}

async function processProduct(product) {
  const stock = await getStock(product);
  const message = messageBuilder.buildMessage(stock, product);
  const notify = hasStockChanged(product.stock, stock);
  doUpdate = notify ? true : doUpdate;
  await log.debug(`doUpdate is: ${doUpdate}`);
  callQueue.push(async () => {
    try {
      const response = await sendMessage(message, stock !== product.stock);
      const messageId = response.result.message_id;
      await products.updateLastMessageId(product.productCode, messageId);
      if(product.lastMessageId) {
        await telegram.removeFromChannel(product.lastMessageId);
      }
    } catch (error) {
      const message = `Error: ${error.message}`;
      
      await log.error(message);
    }
  });
}

async function processItems() {
  const items = await products.getProducts();

  await log.debug(`Retrieved ${items.length} products from the db`)
  for(const item of items) {
    await processProduct(item);
  }
}

async function sendMessage(message, notify) {
  return await telegram.sendToChannel(message, notify);
}

function hasStockChanged(oldStock, newStock) {
  return newStock != oldStock && newStock != 99999;
}

module.exports.checkstock = async event => {
  callQueue = [];
  doUpdate = false;
  await log.debug(`Process started}`);

  await processItems();

  await log.debug(`Queue size is ${callQueue.length}`);

  if(doUpdate) {
    for await (let call of callQueue){
      try {
        await call();
      } catch (error) {
        const message = `Error: ${error.message}`;
        
        await log.error(message);
      }
    }
  }


  return { statusCode: 200 };
};
