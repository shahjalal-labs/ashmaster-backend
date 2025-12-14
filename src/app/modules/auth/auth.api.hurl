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
   "email":"jamalbinabul@merepost.com" 
}


POST {{port6011}}/auth//verify-forgot-otp
{
   "email":"jamalbinabul@merepost.com",
   "otp":3343
} 
