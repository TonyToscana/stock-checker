const createClient = require('@supabase/supabase-js').createClient;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const getProductsSupabase = async () => {
    const {data, error} = await supabase.rpc('getallproducts')
    return data.map(product => {
        const {cod, lastmessageid, ...rest} = product;
        return {
            ...rest,
            lastMessageId: lastmessageid,
            productCode: cod
        }
    });
}

exports.getProducts = async () => {
    return await getProductsSupabase();
};

const updateStockSupabase = async (productId, stock) => {
    await supabase.from('products').update({
        stock
    })
    .match({cod:productId})
}

exports.updateStock = async (productId, stock) => {
    return await updateStockSupabase(productId, stock);
};

const updateLastMessageIdSupabase = async (productId, messageId) => {
    await supabase.from('products').update({
        lastMessageId: messageId
    })
    .match({cod:productId})
};

exports.updateLastMessageId = async (productId, messageId) => {
  return await updateLastMessageIdSupabase(productId, messageId);
};