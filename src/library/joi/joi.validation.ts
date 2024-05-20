import * as joi from "joi";
import * as joiDate from "@joi/date";

export const Joi = joi.extend(joiDate.default(joi)) as typeof joi;
