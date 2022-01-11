exports.buildMessage = (stock, product) => {
    return `
  <b>${product.emoji} ${product.title}</b>
  <a href="${product.url}">link</a>
  
  STOCK: ${stock}
  `
  };