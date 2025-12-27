# create checklist / endgoals
POST {{port6011}}/checklist-end-goals/create
Authorization: {{ashRaisa}}
Content-Type: application/json

{
 "title":"Read 3 hours",
 "description": "Study 8 am to 11 am before going to school. And ready for submission.",
 "type": "CHECKLIST"
}

# get all checklist/ endgoals

GET  {{port6011}}/checklist-end-goals/694d1c81f2f85a0ba12ada33?type=ENDGOALS&page=1&limit=10&sortBy=title&sortOrder=asc
Authorization: {{ashRaisa}}




GET  {{port6011}}/checklist-end-goals?type=CHECKLIST&page=1&limit=10&sortBy=title&sortOrder=asc
Authorization: {{ashRaisa}}



# update checklist
PATCH  {{port6011}}/checklist-end-goals/status
#Authorization: {{ashsrahim}}
Authorization: {{ashRaisa}}

Content-Type: application/json

{
 "checklistId": "694d1cadf2f85a0ba12ada34",
 "status": "COMPLETE",
 "title": "Read 4 h",
 "description":"Study 4h at night"
}


DELETE  {{port6011}}/checklist-end-goals/694fa0aa8a0113dcfa949157

#Authorization: {{ashsrahim}}
Authorization: {{ashRaisa}}
