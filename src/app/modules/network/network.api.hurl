# Network Module API Tests

# Get network stats
GET {{port6011}}/network/stats
Authorization: {{ashEsha}}

# Get suggestions (for home page)
GET {{port6011}}/network/suggestions?page=1&limit=10
Authorization: {{ashRaisa}}

# Get suggestions filtered by role
GET {{port6011}}/network/suggestions?page=1&limit=10&filter=mentors
Authorization: {{ashRaisa}}

# Send connection request
POST {{port6011}}/network/request
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "receiverId": "69439c27b63cdd027fe1e8c6",
  "message": "Hi, I'd like to connect with you for mentorship."
}

# Get pending requests
GET {{port6011}}/network/requests/pending?page=1&limit=10
Authorization: {{ashRaisa}}

# Accept connection request
PATCH {{port6011}}/network/request/status
Authorization: {{ashEsha}} # This should be the receiver of the request
Content-Type: application/json

{
  "requestId": "6943b9bcb63cdd027fe1e8c9",
  "status": "ACCEPTED"
}

# Reject connection request
PATCH {{port6011}}/network/request/status
Authorization: {{ashEsha}}
Content-Type: application/json

{
  "requestId": "6943b9bcb63cdd027fe1e8c9",
  "status": "REJECTED"
}

# Get all connections
GET {{port6011}}/network/connections?page=1&limit=10
Authorization: {{ashRaisa}}

# Remove connection
DELETE {{port6011}}/network/connection/39284920784901237
Authorization: {{ashRaisa}}
