import pino from "pino";

const logger = pino({
  browser: {},
  level: "debug",
  base: {
    env: process.env.NODE_ENV,
  },
});

// export default logger;

export default function getLogger(caller) {
  return {
    info: function (msg = "", data = {}) {
      logger.info({ caller, msg, data });
    },
    warn: function (msg = "", data = {}) {
      logger.warn({ caller, msg, data });
    },
    log: function (msg = "", data = {}) {
      logger.info({ caller, msg, data });
    },
  };
}
