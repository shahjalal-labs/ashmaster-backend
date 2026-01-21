# Simple Network Tests

# Get suggestions
GET {{port6011}}/network/suggestions?page=1&limit=10
#Authorization: {{ashsrahim}}
#Authorization: {{ashsrasu}}
Authorization: {{ashRaisa}}

# Send request
POST {{port6011}}/network/request
Authorization: {{ashRaisa}}
#Authorization: {{ashsrasu}}
#Authorization: {{ashsrahim}}
Content-Type: application/json

{
  "receiverId": "694a793d6f65b4f863400d6a",
  "message": "Hi, let's connect! I have dream to become a software engineer. I want to know many things from you."
}


# Get pending requests
GET {{port6011}}/network/request-pending?page=1&limit=10
#/ Authorization: {{ashsrahim}}
Authorization: {{ashRaisa}}


# response/remove connection  or cancel sent connection request 

PATCH {{port6011}}/network/response-or-remove

#Authorization: {{ashsrahim}}
Authorization: {{ashRaisa}}

Content-Type: application/json

{
  "requestId": "69536bab48dd3657aaf5eea5",
  "status": "ACCEPTED"
}     #/ ACCEPTED/ REJECTED/REMOVE   // accpet/reject to response the request & remove to delete existing connection or cancel send request


# get connections

GET {{port6011}}/network/connections?page=1&limit=10
Authorization: {{ashsrahim}}
#Authorization: {{ashRaisa}}



# get my connections count

GET {{port6011}}/network/connections-count
#Authorization: {{ashsrahim}}
Authorization: {{ashRaisa}}


