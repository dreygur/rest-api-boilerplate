import jwt from 'jsonwebtoken';
import * as operations from '../controllers/operations';
import User from '../services/user/user.schema';
import settings from '../../settings.json';

/**
 * This function is used for decoding auth token.
 * @param {String} token The token to decode.
 * @returns returns the decoded user found in database.
 */
export default async function decodeAuthToken(token) {
  try {
    const decoded = jwt.verify(token, settings.secret);
    const user = await operations.findOne({ table: User, key: { id: decoded.id, populate: { path: 'role', select: 'name department' } } });
    if (!user) throw new Error('user not found');
    return user;
  }
  catch (e) {
    console.log(e);
  }
}