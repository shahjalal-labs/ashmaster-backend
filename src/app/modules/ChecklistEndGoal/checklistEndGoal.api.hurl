# create checklist / endgoals
POST {{port6011}}/checklist-end-goals/create
Authorization: {{ashRaisa}}
Content-Type: application/json

{
 "title":"Read 3 hours",
 "description": "Study 8 am to 11 am before going to school. And ready for submission.",
 "type": "ENDGOALS"
}

# get my checklist/ endgoals

GET  {{port6011}}/checklist-end-goals?type=ENDGOALS
Authorization: {{ashRaisa}}

