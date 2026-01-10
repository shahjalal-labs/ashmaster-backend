# fetch mentor checklist view
GET {{port6011}}/mentor-progress/checklist-view?page=1&limit=100
Authorization: {{ashRaisa}}



# fetch mentor endgoals view
GET {{port6011}}/mentor-progress/checklist-view?type=ENDGOALS&page=1&limit=100
Authorization: {{ashRaisa}}

 
# view specific mentee checklists 
GET {{port6011}}/mentor-progress/694a793d6f65b4f863400d6a?type=CHECKLIST&page=1&limit=100
Authorization: {{ashRaisa}}


# view specific mentee endgoals 
GET {{port6011}}/mentor-progress/694a793d6f65b4f863400d6a?type=ENDGOALS&page=1&limit=100
Authorization: {{ashRaisa}}

# mentor progress count
GET {{port6011}}/mentor-progress/progress-count 
Authorization: {{ashRaisa}}

