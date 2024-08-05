import fs from "fs"
import path from "path";
import cors from "cors";
import https from "https";
import log4js from "log4js";
import helmet from "helmet";
import bodyParser from "body-parser";
import compression from "compression";
import express, { Application } from "express";

import apiRoutes from "@routes/api";
import webRoutes from "@routes/web";
import mobileRoutes from "@routes/mobile";

// import db from "@config/database";
import license from "@utils/si-moda";
import getConfig from "@config/dotenv";
import { initSocketIO } from "@config/socket";
import limiter from "@middleware/rate-limit";
import logger, { errorLogger } from "@config/logger";
import { notFound } from "@middleware/error-notfound";
import { errorhandler } from "@middleware/error-handler";
import documentationApi from "./public/documentation-api";

const app: Application = express();
log4js.configure(logger);

/**
 * certificate keys
 */

/**
 * body parser
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * helmet
 */
app.use(helmet());

/**
 * cors
 */
app.use(cors());

/**
 * compression
 */
app.use(compression());

/**
 * limiter
 */
app.use(limiter);

/**
 * dokumen path
 */
app.use("/si-moda/documentation-api", documentationApi)
// app.use(
//   "/public/dokumen",
//   express.static(path.resolve(__dirname, "../public/dokumen"))
// );

/**
 * routes
 */
app.use("/si-moda/api-auth/v1/", apiRoutes);
app.use("/si-moda/api-noauth/v1/", apiRoutes);
app.use("/si-moda/web/", webRoutes);
app.use("/si-moda/mobile/", mobileRoutes);

/**
 * not found
 */
app.use(notFound);

/**
 * error handler
 */
app.use(errorhandler);

try {
  app.listen(getConfig("PORT_SERVER"), () => {
    console.log(license);
    console.log(
      `${String.fromCodePoint(
        0x1f525
      )} SERVER SI-MODA ON PORT : ${getConfig(
        "PORT_SERVER"
      )} ${String.fromCodePoint(0x1f525)}`
    );
  });
} catch (error) {
  errorLogger.error(`SERVER ERROR: ${error}`);
}