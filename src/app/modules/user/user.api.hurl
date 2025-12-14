# create user
POST  {{port6011}}/user/create
Content-type: application/json
{
   "fullname":"Yousuf Ibn Hadi",
   "email":"yousufbinhadi@merepost.com",
   "password":"Yousuf1@"
}



# signup verification
POST  {{port6011}}/user/signup-verification
Content-type: application/json
{
   "email":"yousufbinhadi@merepost.com",
   "otp":"8844"
}
