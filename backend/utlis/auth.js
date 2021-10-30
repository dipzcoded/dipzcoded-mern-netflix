import redis from "redis";
import jwt from "jsonwebtoken";

// redis init
const redisClient = redis.createClient();

export const removeUserRefreshTokens = (userId) => {
  redisClient.get("refreshTokens", (err, tokens) => {
    if (err) throw new Error(err.message);
    if (tokens != null) {
      let refreshTokens = JSON.parse(tokens);
      refreshTokens = refreshTokens.filter(
        (token) =>
          String(jwt.verify(token, process.env.JWT_REFRESH_SECRET).id) !==
          String(userId)
      );
      refreshTokens.push(token);
      redisClient.set("refreshTokens", JSON.stringify(refreshTokens));
    }
  });
};

export const checkUserLogin = (userId) => {
  return new Promise((resolve, reject) => {
    redisClient.get("refreshTokens", (err, token) => {
      if (err) {
        reject(err);
        return;
      }

      if (token == null) {
        resolve(false);
        return;
      } else {
        const refreshTokens = JSON.parse(token);
        const tokenUserFound = refreshTokens.find(
          (token) =>
            String(jwt.verify(token, process.env.JWT_REFRESH_SECRET).id) ===
            String(userId)
        );

        if (tokenUserFound) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
};

const saveRefreshTokenToCache = (token, userId) => {
  redisClient.get("refreshTokens", (err, tokens) => {
    if (err) throw new Error(err.message);
    if (tokens != null) {
      let refreshTokens = JSON.parse(tokens);
      refreshTokens = refreshTokens.filter(
        (token) =>
          String(jwt.verify(token, process.env.JWT_REFRESH_SECRET).id) !==
          String(userId)
      );
      refreshTokens.push(token);
      redisClient.set("refreshTokens", JSON.stringify(refreshTokens));
    } else {
      const tokens = [];
      tokens.push(token);
      redisClient.set("refreshTokens", JSON.stringify(tokens));
    }
  });
};
export const generateAccessToken = (user) => {
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );

  return token;
};

export const generateRefreshToken = (user) => {
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );

  saveRefreshTokenToCache(token, user._id);

  return token;
};
