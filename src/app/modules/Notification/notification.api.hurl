# send test notification
POST {{port6011}}/notify/send-test
Content-type: application/json
{
   "receiverId":"694a254aad128cabeaf7412f",
   "title":"Send test notification",
   "body":"This is a test notification from postman",
   "type":"SCHEDULE",
   "notificationChannel": "INAPP",
   "senderId":"694a39873340ac9b4e138239",
   "handlerId":"695b3bd3c5fa61f1470e63d8"
}

# my notifications
#/ isRead=> true, false, all
GET {{port6011}}/notify/my?page=1&limit=20&isRead=all
#Authorization: {{ashsrahim}}
Authorization: {{ashsrasu}}

# get single notification and marks as read
GET {{port6011}}/notify/single/697240f164d0478c9ab2f506
#Authorization: {{ashsrahim}}
Authorization: {{ashsrasu}}


# get notification unread count
GET {{port8012}}/notify/unread-count
#Authorization: {{ashsrahim}}
Authorization: {{ashsrasu}}



# mark all as read or unread
PATCH {{port6011}}/notify/mark-all
#Authorization: {{ashsrahim}}
Authorization: {{ashsrasu}}
Content-type: application/json
{
  "isRead":false
}
