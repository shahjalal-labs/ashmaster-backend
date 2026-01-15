# create group
POST {{port6011}}/group/create
Authorization: {{ashRaisa}}
Content-Type: application/json

{
 "title":"Data Science Mentoring",
 "groupPhoto": "https://api.zenexcloud.com/emdadullah/uploads/users/profileImage/1768019205514-v4ull7jpu0e.png",
 "memberIds": ["694a39873340ac9b4e13823d"]
}

# fetch group details
GET {{port6011}}/group/6964e4e1656ea48b225e0eb4
Authorization: {{ashRaisa}}


# update group (creator only)
PATCH {{port6011}}/group/6964e4e1656ea48b225e0eb4
Authorization: {{ashRaisa}}
#Authorization: {{ashsrahim}}

Content-Type: application/json

{
 "title":"Data Science Mentoring"
}


# fetchAllMembers
#/ /members/groupId
GET {{port6011}}/group/members/6964e4e1656ea48b225e0eb4?page=1&limit=20
Authorization: {{ashRaisa}}


#  leave group (member only)
DELETE {{port6011}}/group/6964e4e1656ea48b225e0eb4/leave
#Authorization: {{ashRaisa}}
Authorization: {{ashsrahim}}

#  find members to add
GET {{port6011}}/group/6964e4e1656ea48b225e0eb4/find-members
Authorization: {{ashRaisa}}
#Authorization: {{ashsrahim}}

