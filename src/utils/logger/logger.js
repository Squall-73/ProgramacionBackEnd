import winston from "winston";
import * as dotenv from "dotenv";

dotenv.config();

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "blue",
    http: "cyan",
    debug: "white",
  },
};

const devlogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

const prodlogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./erros.log",
      level: "error",
    }),
  ],
});

export const addLogger = (req, res, next) => {

  req.logger = process.env.ENVIRONMENT === "production" ? prodlogger : devlogger;
  console.log(req.logger);
  let { body } = req;
  let bodyData = { ...body };
  console.log(bodyData);

  if (req.method === "POST" || req.method === "PUT") {
    bodyData = JSON.stringify(bodyData);
  } else {
    bodyData = "";
  }

  req.logger.http(
    `ruta:${req.method} ${
      req.url
    } - ${new Date().toLocaleTimeString()} - data:${bodyData}`
  );
  next();
};
