const config = require("config");
const passport = require("passport");
const GoogleTokenStrategy = require("passport-google-token3").Strategy;
const CLIENT_ID = config.get("CLIENT_ID");
const CLIENT_SECRETE = config.get("CLIENT_SECRETE");
const Psychiatrist = require("../../../models/Psychiatrist");

passport.use(
    "googelToken",
    new GoogleTokenStrategy(
        {
            clientID:CLIENT_ID,
            clientSecrete:CLIENT_SECRETE
        },
       async (accessToken,refreshToken,profle,done) => {
           try {
            //    console.log(accessToken);
            //    console.log(profile);
               const psychiatrist = await Psychiatrist.findOne({
                   email:profle.emails[0].value
               });
               if(psychiatrist) {
                   console.log("psych found",psychiatrist);
                   return done(null,psychiatrist)
               } else {
                   const newPsych = new Psychiatrist({
                       id:profile.id,
                       name:profile.displayName,
                       email:profile.emails[0].value
                   });
                   await newPsych.save();
                   console.log("new psych created",newPsych);
                   done(null,newPsych)
               }
           } catch (error) {
               done(error,false,error.message)
           }
       } 
    ))