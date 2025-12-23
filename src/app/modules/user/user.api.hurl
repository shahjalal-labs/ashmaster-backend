# create user
POST  {{port6011}}/user/create
Content-type: application/json
{
   "fullname":"Rahim Sheikh",
   "email":"rahim@merepost.com",
   "password":"SjAbc1@Bad",
   "fcmToken":""
}



# signup verification
POST  {{port6011}}/user/signup-verification
Content-type: application/json
{
   "email":"rahim@merepost.com",
   "otp":"6880"
}


# get all users 

GET {{port6011}}/user
