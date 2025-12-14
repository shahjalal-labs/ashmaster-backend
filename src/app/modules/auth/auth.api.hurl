# email password  login

POST {{port6011}}/auth/login

{
  "email":"jamalbinabul@merepost.com",
  "password":"SjAbc1@Bad",
  "fcmToken":""
}

# auth login / google login

POST {{port6011}}/auth/auth-login
{
  "email":"koyelot367@roastic.com",
  "fullname":"Hasan Bin Ali"
}

# send forgot password otp

POST {{port6011}}/auth/send-forgot-otp
{
   "email":"yousufbinhadi@merepost.com" 
}

# verify forgot password otp
POST {{port6011}}/auth/verify-forgot-otp
{
   "email":"yousufbinhadi@merepost.com",
   "otp":"8271"
} 


# reset password

PATCH {{port6011}}/auth/reset-password
{
   "email":"yousufbinhadi@merepost.com",
   "otp":"8271"
}
