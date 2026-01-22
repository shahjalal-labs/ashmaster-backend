# create user
POST  {{port6011}}/user/create
Content-type: application/json
{
   "fullname":"Turjo Khan Sani",
   "email":"turjo@merepost.com",
   "password":"Aw32@320",
   "fcmToken":"fcm1"
}



# signup verification
POST  {{port6011}}/user/signup-verification
Content-type: application/json
{
   "email":"salman@merepost.com",
   "otp":"9814"
}


# get all users 

GET {{port6011}}/user


