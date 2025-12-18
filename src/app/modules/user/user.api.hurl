# create user
POST  {{port6011}}/user/create
Content-type: application/json
{
   "fullname":"Sharif Hasan",
   "email":"sharif@merepost.com",
   "password":"SjAbc1@Bad",
   "fcmToken":""
}



# signup verification
POST  {{port6011}}/user/signup-verification
Content-type: application/json
{
   "email":"sharif@merepost.com",
   "otp":"2448"
}
