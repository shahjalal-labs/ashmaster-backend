# Simple Network Tests

# Get suggestions
GET {{port6011}}/network/suggestions?page=1&limit=10
Authorization: {{ashsrahim}}
#Authorization: {{ashRaisa}}

# Send request
POST {{port6011}}/network/request
Authorization: {{ashRaisa}}
Authorization: {{ashsrahim}}
Content-Type: application/json

{
  "receiverId": "694a254aad128cabeaf7412f",
  "message": "Hi, let's connect! I have dream to help other"
}


# Get pending requests
GET {{port6011}}/network/request-pending
 Authorization: {{ashsrahim}}
#Authorization: {{ashRaisa}}


# Accept request
PATCH {{port6011}}/network/request/status
Authorization: {{yourToken}}
Content-Type: application/json

{
  "requestId": "requestId123",
  "status": "ACCEPTED"
}
