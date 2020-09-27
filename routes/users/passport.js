const config = require("config");
const passport = require("passport");
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const GoogleTokenStrategy = require("passport-google-token3").Strategy;
const CLIENT_ID = config.get("CLIENT_ID");
const CLIENT_SECRETE = config.get("CLIENT_SECRETE");
const User = require("../../models/User");

passport.use(
  "googleToken",
  new GoogleTokenStrategy(
    {
      clientID: CLIENT_ID,
      clientSecrete: CLIENT_SECRETE,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(accessToken);
        console.log(profile);
        const user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          return done(null, user);
        } else {
          const newUser = new User({
            id: profile.id,
            name:profile.displayName,
            email: profile.emails[0].value,
          });
          await newUser.save();
          done(null, newUser);
        }
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);
