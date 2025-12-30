# Get mentor progress summary
GET {{port6011}}/mentor-progress/
Authorization: {{ashRaisa}}

# Get a specific mentee's checklists
GET {{port6011}}/mentor-progress/mentees/{{menteeId}}/checklists?type=CHECKLIST&page=1&limit=10
Authorization: {{ashRaisa}}

# Get count of unviewed mentees
GET {{port6011}}/mentor-progress/unviewed-count   #/ unviewed
Authorization: {{ashRaisa}}
