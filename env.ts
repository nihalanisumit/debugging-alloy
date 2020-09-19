const envConfig = {
  databaseUrl: process.env.DB_URI ?? '',
};

export default Object.freeze(envConfig);
