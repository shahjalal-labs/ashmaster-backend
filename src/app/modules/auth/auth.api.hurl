SjAbc1@Bad

# email password  login

POST {{port6011}}/auth/login

{
  "email":"raisa@merepost.com",
  "password":"SjAbc1@Bad",
  "fcmToken":""
}

# auth login / google login

POST {{port6011}}/auth/auth-login
{
  "email":"sara@merepost.com",
  "fullname":"Sara Ahmed",
  "fcmToken":""
}

# upload profile image file

PACTH {{port6011}}/auth/profile-image
Authorization: {{ashRaisa}}




# get my profile
GET {{port6011}}/auth/profile
Authorization: {{ashRaisa}}

# get other profile
# profile/userId
GET {{port6011}}/auth/profile/69439c27b63cdd027fe1e8c6
Authorization: {{ashRaisa}}

# Delete Account
# Note: This will permanently delete the user account and all associated data

DELETE {{port6011}}/auth/delete-account
Authorization: {{ashEsha}}

# send forgot password otp

POST {{port6011}}/auth/send-forgot-otp
{
   "email":"yousufbinhadi@merepost.com" 
}

# verify forgot password otp
POST {{port6011}}/auth/verify-forgot-otp
{
   "email":"yousufbinhadi@merepost.com",
   "otp":"7565"
} 


# reset password

PATCH {{port6011}}/auth/reset-password
Authorization: {{tempToken}}
{
   "newPassword":"SjAbc1@Bad"
}


# Complete Profile (Mentee Example)
POST {{port6011}}/auth/complete-profile
Authorization: {{ashrahim}}
Content-Type: application/json

{
  "profile": {
    "about": "I am a frontend engineer passionate about UI/UX design, building accessible and responsive web applications, and mentoring junior developers.",
    "age": 27,
    "ethnicity": "EAST_ASIAN",
    "gender": "FEMALE",
    "profession": "Frontend Engineer",
    "experienceYear": 5,
    "availability": {
      "tuesday": [
        { "start": "10:00", "end": "13:00" },
        { "start": "14:00", "end": "17:00" }
      ],
      "friday": [
        { "start": "09:30", "end": "12:30" }
      ]
    },
    "profileImage": "https://cdn.example.com/profile/female_user.png",
    "interests": [
      "UI Design",
      "Accessibility",
      "React Development"
    ]
  },
  "preference": {
    "careers": [
      "UI/UX Designer",
      "Software Engineer"
    ],
    "genders": [
      "FEMALE",
      "MALE"
    ],
    "ethnicities": [
      "EAST_ASIAN",
      "PACIFIC_ISLANDER"
    ],
    "notes": "Interested in collaborating with creative and driven professionals.",
    "age": {
      "min": 24,
      "max": 32
    }
  },
  "role": "MENTEE"
}






###
# Complete Profile (Mentor Example)
POST {{port6011}}/auth/complete-profile
Authorization: {{accessToken}}
Content-Type: application/json

{
  "profile": {
    "about": "Senior software engineer with 8 years of experience in backend systems, cloud infrastructure, and team leadership. Passionate about mentoring and helping junior developers grow.",
    "age": 32,
    "ethnicity": "HISPANIC",
    "gender": "FEMALE",
    "profession": "Senior Software Engineer",
    "experienceYear": "8+ years",
    "availability": {
      "monday": [
        { "start": "10:00", "end": "12:00" },
        { "start": "14:00", "end": "16:00" }
      ],
      "wednesday": [
        { "start": "09:00", "end": "11:00" },
        { "start": "13:00", "end": "17:00" }
      ],
      "thursday": [
        { "start": "15:00", "end": "18:00" }
      ]
    },
    "profileImage": "https://example.com/mentor-profile.jpg",
    "interests": ["Backend Development", "Cloud Computing", "System Design", "Leadership"]
  },
  "preference": {
    "career": "Tech Industry",
    "gender": "NO_ANSWER",
    "ethnicity": "NO_ANSWER",
    "notes": "Looking to mentor someone who is committed and has basic programming knowledge",
    "age": {
      "min": 20,
      "max": 30
    }
  },
  "role": "MENTOR"
}

###
# Complete Profile (Minimal Example - MENTEE)
POST {{port6011}}/auth/complete-profile
Authorization: {{accessToken}}
Content-Type: application/json

{
  "profile": {
    "about": "Looking to learn and grow in my career",
    "age": 24,
    "ethnicity": "BLACK",
    "gender": "NO_ANSWER",
    "profession": "Junior Developer",
    "experienceYear": "6 months",
    "availability": {
      "saturday": [
        { "start": "10:00", "end": "14:00" }
      ],
      "sunday": [
        { "start": "13:00", "end": "17:00" }
      ]
    },
    "interests": ["Programming", "Learning"]
  },
  "preference": {
    "career": "Software Engineering",
    "gender": "NO_ANSWER",
    "ethnicity": "NO_ANSWER",
    "age": {
      "min": 28,
      "max": 45
    }
  }
}

###
# Complete Profile (Without role - uses existing role)
POST {{port6011}}/auth/complete-profile
Authorization: {{accessToken}}
Content-Type: application/json

{
  "profile": {
    "about": "I am a product manager looking to mentor aspiring product managers",
    "age": 35,
    "ethnicity": "MIDDLE_EASTERN",
    "gender": "MALE",
    "profession": "Product Manager",
    "experienceYear": "7 years",
    "availability": {
      "tuesday": [
        { "start": "19:00", "end": "21:00" }
      ],
      "thursday": [
        { "start": "20:00", "end": "22:00" }
      ]
    },
    "interests": ["Product Management", "Business Strategy", "User Research"]
  },
  "preference": {
    "career": "Product Management",
    "gender": "NO_ANSWER",
    "ethnicity": "NO_ANSWER",
    "age": {
      "min": 22,
      "max": 35
    }
  }
}

###
# Complete Profile (For ADMIN role - optional)
POST {{port6011}}/auth/complete-profile
Authorization: {{accessToken}}
Content-Type: application/json

{
  "profile": {
    "about": "Platform administrator with system management responsibilities",
    "age": 40,
    "ethnicity": "WHITE",
    "gender": "FEMALE",
    "profession": "System Administrator",
    "experienceYear": "12 years",
    "availability": {
      "monday": [
        { "start": "09:00", "end": "17:00" }
      ],
      "tuesday": [
        { "start": "09:00", "end": "17:00" }
      ],
      "wednesday": [
        { "start": "09:00", "end": "17:00" }
      ],
      "thursday": [
        { "start": "09:00", "end": "17:00" }
      ],
      "friday": [
        { "start": "09:00", "end": "17:00" }
      ]
    },
    "interests": ["System Administration", "Security", "DevOps"]
  },
  "preference": {
    "career": "IT Administration",
    "gender": "NO_ANSWER",
    "ethnicity": "NO_ANSWER",
    "age": {
      "min": 25,
      "max": 50
    }
  },
  "role": "ADMIN"
}


##-------### ------###----## update profile
# ... existing tests ...

###
# Update Profile - Update only user fields
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "fullname": "Raisa Ahmed",
  "role": "MENTOR"
}

###
# Update Profile - Update only profile fields
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "profile": {
    "about": "Updated about section with more details about my experience and goals.",
    "age": 23,
    "profession": "Senior Software Developer",
    "experienceYear": 2,
    "interests": ["Web Development", "Mobile Apps", "UI/UX Design", "Databases", "Cloud Computing"],
    "availability": {
      "monday": [
        { "start": "10:00", "end": "13:00" },
        { "start": "15:00", "end": "18:00" }
      ],
      "wednesday": [
        { "start": "09:00", "end": "12:00" }
      ]
    }
  }
}

###
# Update Profile - Update only preference fields
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "preference": {
    "career": "Tech Startup",
    "gender": "FEMALE",
    "ethnicity": "EAST_ASIAN",
    "notes": "Looking for someone with startup experience",
    "age": {
      "min": 28,
      "max": 45
    }
  }
}

###
# Update Profile - Update mixed fields
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "fullname": "Raisa Ahmed Pro",
  "profile": {
    "profession": "Lead Developer",
    "experienceYear": 3
  },
  "preference": {
    "career": "Enterprise Software",
    "age": {
      "min": 30
    }
  }
}

###
# Update Profile - Clear profile image (set to empty string)
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "profile": {
    "profileImage": ""
  }
}

###
# Update Profile - Clear notes
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "preference": {
    "notes": ""
  }
}

###
# Update Profile - Invalid data (should fail validation)
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "fullname": "A",  // Too short
  "profile": {
    "age": 17  // Too young
  }
}

###
# Update Profile - Empty request (should fail)
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{}

###
# Update Profile - Try to update email (should not be allowed)
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "email": "newemail@example.com"  // This should be ignored or cause error
}

###
# Update Profile - Update availability with invalid time format
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "profile": {
    "availability": {
      "monday": [
        { "start": "25:00", "end": "26:00" }  // Invalid time
      ]
    }
  }
}

###
# Update Profile - Update with invalid age range
PUT {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
Content-Type: application/json

{
  "preference": {
    "age": {
      "min": 50,
      "max": 30  // min > max
    }
  }
}

###
# Update Profile - User without profile/preference (should fail)
# First create a user without completing profile
POST {{port6011}}/auth/auth-login
{
  "email": "newuser@example.com",
  "fullname": "New User",
  "fcmToken": ""
}

@newUserToken = {{response.body.data.accessToken}}

# Try to update profile (should fail because profile doesn't exist)
PUT {{port6011}}/auth/profile
Authorization: Bearer {{newUserToken}}
Content-Type: application/json

{
  "profile": {
    "about": "Trying to update without completing profile"
  }
}

# Complete the profile first
POST {{port6011}}/auth/complete-profile
Authorization: Bearer {{newUserToken}}
Content-Type: application/json

{
  "profile": {
    "about": "I am a new user",
    "age": 25,
    "ethnicity": "EAST_ASIAN",
    "gender": "NO_ANSWER",
    "profession": "Developer",
    "experienceYear": 1,
    "availability": {
      "monday": [
        { "start": "09:00", "end": "12:00" }
      ]
    },
    "interests": ["Programming"]
  },
  "preference": {
    "career": "Software",
    "gender": "NO_ANSWER",
    "ethnicity": "NO_ANSWER",
    "age": {
      "min": 20,
      "max": 30
    }
  }
}

# Now update should work
PUT {{port6011}}/auth/profile
Authorization: Bearer {{newUserToken}}
Content-Type: application/json

{
  "profile": {
    "profession": "Senior Developer"
  }
}

###
# Update Profile - Get updated profile to verify
GET {{port6011}}/auth/profile
Authorization: {{ashRaisa}}
