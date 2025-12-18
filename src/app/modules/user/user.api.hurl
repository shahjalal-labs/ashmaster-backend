# create user
POST  {{port6011}}/user/create
Content-type: application/json
{
   "fullname":"Sabbir Rahman",
   "email":"sabbir@merepost.com",
   "password":"SjAbc1@Bad",
   "fcmToken":""
}



# signup verification
POST  {{port6011}}/user/signup-verification
Content-type: application/json
{
   "email":"sabbir@merepost.com",
   "otp":"9865"
}
