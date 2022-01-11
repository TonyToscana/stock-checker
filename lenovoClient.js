const rp = require('request-promise');

async function getStock(productId) {
  const options = {
    method: 'GET',
    uri: `https://www.lenovo.com/es/es/cart/dr/stock/mtm/check?code=${productId}`,
    json: true
  };

  const result = await rp(options);
  const stock = result[productId].stockCount;

  return stock;
}

async function getMultipleStock(...productIds) {
  const ids = productIds.join(',');
  const options = {
    method: 'GET',
    uri: `https://www.lenovo.com/es/es/cart/dr/stock/mtm/check?code=${productId}`,
    json: true
  };
  
  return rp(options);
}

exports.getStock = getStock;