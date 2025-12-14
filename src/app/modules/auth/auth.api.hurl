SjAbc1@Bad
# email password  login

POST {{port6011}}/auth/login

{
  "email":"yousufbinhadi@merepost.com",
  "password":"SjAbc1@Bad3",
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
   "otp":"7565"
} 


# reset password

PATCH {{port6011}}/auth/reset-password
Authorization: {{tempToken}}
{
   "newPassword":"SjAbc1@Bad"
}
