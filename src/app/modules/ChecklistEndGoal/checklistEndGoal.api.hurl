# create checklist / endgoals
POST {{port6011}}/checklist-end-goals/create
Authorization: {{ashsrahim}}
#Authorization: {{ashsrasu}}
Content-Type: application/json

{
 "title":"Morality, ethics teach to my son",
 "description": "Study 8 am to 11 am before going to school. And ready for submission.",
 "type": "CHECKLIST"
}


# get my checklist/ endgoals

GET  {{port6011}}/checklist-end-goals/my?type=ENDGOALS&page=1&limit=10&sortBy=title&sortOrder=asc
Authorization: {{ashRaisa}}
#Authorization: {{ashsrahim}}


# get mentee progress count

GET  {{port6011}}/checklist-end-goals/progress
#Authorization: {{ashRaisa}}
Authorization: {{ashsrahim}}



# get user all checklist/ endgoals


GET  {{port6011}}/checklist-end-goals/694a254aad128cabeaf7412f?type=ENDGOALS&page=1&limit=10&sortBy=title&sortOrder=asc
#Authorization: {{ashRaisa}}
Authorization: {{ashsrahim}}



# get 
GET  {{port6011}}/checklist-end-goals?type=CHECKLIST&page=1&limit=10&sortBy=title&sortOrder=asc
Authorization: {{ashRaisa}}



# update checklist
PATCH  {{port6011}}/checklist-end-goals/status
Authorization: {{ashsrahim}}
#/Authorization: {{ashRaisa}}

Content-Type: application/json

{
 "checklistId": "6953996326ae93e4654f0a39",
 "status": "COMPLETE",
 "title": "Read 4 h",
 "description":"Study 4h at night",
 "type": "CHECKLIST"
}


# delete
DELETE  {{port6011}}/checklist-end-goals/694fa0aa8a0113dcfa949157

#Authorization: {{ashsrahim}}
Authorization: {{ashRaisa}}


# eet checklist endgoal by id
GET  {{port6011}}/checklist-end-goals/details/695e8298a06df40ba65b0ecf

#Authorization: {{ashsrahim}}
Authorization: {{ashRaisa}}
