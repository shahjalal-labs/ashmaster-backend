# create user
POST  {{port6011}}/user/create
Content-type: application/json
{
   "fullname":"Jamal Bin Abul",
   "email":"jamalbinabul@merepost.com",
   "password":"SjAbc1@Bad"
}



# signup verification
POST  {{port6011}}/user/signup-verification
Content-type: application/json
{
   "email":"jamalbinabul@merepost.com",
   "otp":"3664"
}
