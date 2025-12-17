# create user
POST  {{port6011}}/user/create
Content-type: application/json
{
   "fullname":"Esha Rahman",
   "email":"esha@merepost.com",
   "password":"SjAbc1@Bad",
   "fcmToken":""
}



# signup verification
POST  {{port6011}}/user/signup-verification
Content-type: application/json
{
   "email":"esha@merepost.com",
   "otp":"1446"
}
