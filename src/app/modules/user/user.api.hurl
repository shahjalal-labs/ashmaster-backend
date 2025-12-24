# create user
POST  {{port6011}}/user/create
Content-type: application/json
{
   "fullname":"Rasu Hossain",
   "email":"rasu@merepost.com",
   "password":"SjAbc1@Bad",
   "fcmToken":""
}



# signup verification
POST  {{port6011}}/user/signup-verification
Content-type: application/json
{
   "email":"rasu@merepost.com",
   "otp":"6843"
}


# get all users 

GET {{port6011}}/user


