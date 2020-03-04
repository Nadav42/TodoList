import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

const envFound = dotenv.config();

if (!envFound) {
    throw new Error("Couldn't find .env file");
}

export default {
    port: process.env.PORT,
    databaseURL: process.env.MONGODB_URI,
    api: {
        prefix: '/api',
    },
    prerenderToken: process.env.PRE_RENDER_TOKEN
};
