import decodeAuthToken from '../utils/decodeAuthToken';

/**
 * This function is used for validating user role.
 * It is an express middleware.
 * It checks that the role of the user is allowed to proceed the request or not.
 * @param {Array} allowed The allowed roles.
 * @throws {Error} If the role is not allowed then it throws an error.
 */
export function checkRole(allowed) {
  return async (req, res, next) => {
    try {
      if (allowed.includes(req.user.role)) return next();
      else throw new Error('Unauthorized.');
    }
    catch (e) {
      res.status(401).send({ status: 401, reason: 'unauthorized' });
    }
  };
}

/**
 * This function is used to authenticate request.
 * After authetication it inserts the user data to reqest object.
 */
export async function auth(req, res, next) {
  try {
    const token = req.cookies?.coredevs || (process.env.NODE_ENV === 'development' ? req.header('Authorization')?.replace('Bearer ', '') : null);
    if (!token) return res.status(401).send({ status: 401, reason: 'Unauthorized' });
    const user = await decodeAuthToken(token);
    if (!user || user.status === 'deactive') return res.status(401).send({ status: 401, reason: 'Unauthorized' });
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).send({ status: 401, reason: 'Unauthorized' });
  }
}
