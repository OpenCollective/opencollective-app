import Joi from 'joi';
import validate from '../lib/validate';

/**
 * Profile form schema
 */

const schema = Joi.alternatives().try(
    Joi.object().keys({
      name: Joi.string().required()
        .label('Name'),
      website: Joi.string().uri()
        .label('Website'),
      twitterHandle: Joi.string()
        .label('Twitter username')
    }),
    Joi.object().keys({
      name: Joi.string()
        .label('Name'),
      website: Joi.string().uri()
        .label('Website'),
      twitterHandle: Joi.string().required()
        .label('Twitter username')
    }),
);

export default (obj) => validate(obj, schema);