# Get mentor progress summary
GET {{port6011}}/mentor-progress/
Authorization: {{ashRaisa}}

# Mark a mentee as viewed
POST {{port6011}}/mentor-progress/mentees/{{menteeId}}/view
Authorization: {{mentorToken}}

# Get a specific mentee's checklists
GET {{port6011}}/mentor-progress/mentees/{{menteeId}}/checklists?type=CHECKLIST&page=1&limit=10
Authorization: {{mentorToken}}

# Get count of unviewed mentees
GET {{port6011}}/mentor-progress/unviewed-count
Authorization: {{mentorToken}}
