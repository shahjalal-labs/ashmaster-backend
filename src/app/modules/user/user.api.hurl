# create user
POST  {{port6011}}/user/create
Content-type: application/json
{
   "fullname":"Sara Ahmed",
   "email":"sara@merepost.com",
   "password":"SjAbc1@Bad",
   "fcmToken":""
}



# signup verification
POST  {{port6011}}/user/signup-verification
Content-type: application/json
{
   "email":"raisaahmed@merepost.com",
   "otp":"4016"
}
