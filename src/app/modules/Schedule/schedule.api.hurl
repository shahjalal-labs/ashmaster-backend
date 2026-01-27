# create schedule
POST {{port6011}}/schedule/create
Authorization: {{ashsrahim}}
Content-Type: application/json
{
  "dateTime": "2026-04-01T15:30:00Z",
  "title": "Backend Architecture Review",
  "description": "Discussion on service boundaries, database schema, and performance bottlenecks.",
  "guestIds": [
    "694a254aad128cabeaf7412f",
    "694a793d6f65b4f863400d6a"
  ],
 "images":[]
}


# get my schedules
GET {{port6011}}/schedule?page=1&limit=100
Authorization: {{ashRaisa}}
# Authorization: {{ashsrahim}}


# get schedules for a month

GET {{port6011}}/schedule/schedules-of-month?date=2026-01-01T00:00:00.000Z 
Authorization: {{ashRaisa}}
# Authorization: {{ashsrahim}}


GET {{port6011}}/schedule/current-month-schedules
Authorization: {{ashRaisa}}
#Authorization: {{ashsrahim}}




#  get schedule details

GET {{port6011}}/schedule/details/6965d8252209f2f3a8edf6a5
Authorization: {{ashsrahim}}



