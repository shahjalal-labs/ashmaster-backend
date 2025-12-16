# create user
POST  {{port6011}}/user/create
Content-type: application/json
{
   "fullname":"Raisa Ahmed",
   "email":"raisaahmed@merepost.com",
   "password":"SjAbc1@Bad",
   "fcmToken":""
}



# signup verification
POST  {{port6011}}/user/signup-verification
Content-type: application/json
{
   "email":"raisaahmed@merepost.com",
   "otp":"3125"
}
