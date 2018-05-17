export { httpsOptions } from './https';

export const verifyConfig = ([...config]) => {
  config.forEach(c => {
    if (!c.config) throw new Error(`${c.name} config is not defined`);
  });
};
