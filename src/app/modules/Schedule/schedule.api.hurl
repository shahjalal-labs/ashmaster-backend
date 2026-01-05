# create schedule
POST {{port6011}}/schedule/create
Authorization: {{ashRaisa}}
Content-Type: application/json
{
  "dateTime": "2026-01-01T15:30:00Z",
  "title": "Backend Architecture Review",
  "description": "Discussion on service boundaries, database schema, and performance bottlenecks.",
  "guestIds": [
    "64f1c2a9e3b14a8c9d0e1234",
    "64f1c2a9e3b14a8c9d0e5678",
    "64f1c2a9e3b14a8c9d0e9999"
  ],
 "images":[]
}


# get schedules

GET {{port6011}}/schedule?page=1&limit=1
Authorization: {{ashRaisa}}
#Authorization: {{ashsrahim}}


# get schedules

GET {{port6011}}/schedule/current-month-schedules
Authorization: {{ashRaisa}}
#Authorization: {{ashsrahim}}
