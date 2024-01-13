import Joi from "joi";

export const DnsQueryRequestParams = Joi.object({
  domain: Joi.string().required().domain().label("Domain"),
});
