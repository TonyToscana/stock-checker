const createClient = require('@supabase/supabase-js').createClient;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const LEVEL_INFO = 'info';
const LEVEL_ERROR = 'error';
const LEVEL_DEBUG = 'debug';
const TABLE_NAME = 'logs';
let debugEnabled = false;

exports.info = async (message) => {
    await this.log(LEVEL_INFO, message);
}

exports.error = async (message) => {
    await this.log(LEVEL_ERROR, message);
}

exports.debug = async (message) => {
    if(debugEnabled) {
        await this.log(LEVEL_DEBUG, message);
    }
}

exports.log = async (level, message) => {
    await supabase
        .from(TABLE_NAME)
        .insert({
            level: level,
            message
        });
}