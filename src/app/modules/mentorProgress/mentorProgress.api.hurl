# Get mentor progress summary (Progress Page)
GET {{port6011}}/mentor-progress/?page=1&limit=10&sortBy=fullname&sortOrder=asc&type=CHECKLIST
Authorization: {{ashRaisa}}

# Get a specific mentee's checklists (Details Page)
GET {{port6011}}/mentor-progress/mentees/{{menteeId}}/checklists?type=CHECKLIST&page=1&limit=10
Authorization: {{ashRaisa}}

# Mark a mentee as viewed
POST {{port6011}}/mentor-progress/mentees/{{menteeId}}/view
Authorization: {{ashRaisa}}

# Get count of unviewed mentees
GET {{port6011}}/mentor-progress/unviewed-count
Authorization: {{ashRaisa}}
