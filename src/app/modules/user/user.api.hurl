# create user
POST  {{port6011}}/user/create
Content-type: application/json
{
   "fullname":"Hasan Mir Jaman",
   "email":"hasan@merepost.com",
   "password":"SjAbc1@Bad",
   "fcmToken":""
}



# signup verification
POST  {{port6011}}/user/signup-verification
Content-type: application/json
{
   "email":"hasan@merepost.com",
   "otp":"1798"
}


# get all users 

GET {{port6011}}/user
