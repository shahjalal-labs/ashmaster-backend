# create user
POST  {{port6011}}/user/create
Content-type: application/json
{
   "fullname":"Hasan Bin Ali",
   "email":"koyelot367@roastic.com",
   "password":"SjAbc1@Bad"
}



# signup verification
POST  {{port6011}}/user/signup-verification
Content-type: application/json
{
   "email":"koyelot367@roastic.com",
   "otp":"2242"
}
