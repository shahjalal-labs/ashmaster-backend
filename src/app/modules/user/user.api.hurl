# create user
POST  {{port6011}}/user/create
Content-type: application/json
{
   "fullname":"Risa Ahmed",
   "email":"risa@merepost.com",
   "password":"SjAbc1@Bad",
   "fcmToken":""
}



# signup verification
POST  {{port6011}}/user/signup-verification
Content-type: application/json
{
   "email":"rasu@merepost.com",
   "otp":"7656"
}


# get all users 

GET {{port6011}}/user
