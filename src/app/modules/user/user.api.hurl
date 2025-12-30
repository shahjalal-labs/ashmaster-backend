# create user
POST  {{port6011}}/user/create
Content-type: application/json
{
   "fullname":"Sharif Dada Chirokumary",
   "email":"gokonam915@emaxasp.com",
   "password":"Aw32@320",
   "fcmToken":"checking_fcm_token"
}



# signup verification
POST  {{port6011}}/user/signup-verification
Content-type: application/json
{
   "email":"rasu@merepost.com",
   "otp":"6843"
}


# get all users 

GET {{port6011}}/user


