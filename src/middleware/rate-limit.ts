import { httpCode } from "@utils/prefix";
import { rateLimit } from "express-rate-limit";

// MAX RATE LIMIT 5 REQUEST PER DETIK
const limiter = rateLimit({
  windowMs: 1000,
  max: 10,
  // skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (request, response, next, options) =>
    response.status(options.statusCode).json({
      code: httpCode.tooManyRequests,
      message: "Too Many Request.",
    }),
});

export default limiter;
