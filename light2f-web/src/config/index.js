import dev from './index.dev.js'

const ENV = {
  DEV: 'DEV',
  TEST: 'TEST',
  PROD: 'PROD'
};

const envMapConfig = {
  [ENV.DEV]: dev 
};

export const REACT_APP_ENV = process.env.REACT_APP_ENV || ENV.DEV;

const getConfig = () => {
  return envMapConfig[REACT_APP_ENV];
};

export default getConfig();
