const { ValidateSignature } = require("../../utils");

const { Request as ExpressRequest, Response, NextFunction } = require("express");

module.exports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAuthorized = await ValidateSignature(req);

    if (isAuthorized) {
      return next();
    }
    return res.status(403).json({ message: "Not Authorized" });
  } catch (error: any) {

  }
};
