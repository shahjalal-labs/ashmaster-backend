# Simple Network Tests

# Get suggestions
GET {{port6011}}/network/suggestions?page=1&limit=10
Authorization: {{ashRaisa}}

# Send request
POST {{port6011}}/network/request
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "receiverId": "694a39873340ac9b4e138239",
  "message": "Hi, let's connect!"
}

# Accept request
PATCH {{port6011}}/network/request/status
Authorization: {{yourToken}}
Content-Type: application/json

{
  "requestId": "requestId123",
  "status": "ACCEPTED"
}
