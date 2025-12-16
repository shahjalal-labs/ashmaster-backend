SjAbc1@Bad

# email password  login

POST {{port6011}}/auth/login

{
  "email":"yousufbinhadi@merepost.com",
  "password":"SjAbc1@Bad3",
  "fcmToken":""
}

# auth login / google login

POST {{port6011}}/auth/auth-login
{
  "email":"koyelot367@roastic.com",
  "fullname":"Hasan Bin Ali",
  "fcmToken":""
}

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
Authorization: {{accessToken}}
Content-Type: application/json

{
  "profile": {
    "about": "I am a passionate learner looking for guidance in software development and career growth. I have basic programming knowledge and want to specialize in full-stack development.",
    "age": 22,
    "ethnicity": "EAST_ASIAN",
    "gender": "MALE",
    "profession": "Software Developer",
    "experienceYear": "1 year",
    "availability": {
      "monday": [
        { "start": "09:00", "end": "12:00" },
        { "start": "14:00", "end": "17:00" }
      ],
      "tuesday": [
        { "start": "10:00", "end": "15:00" }
      ],
      "wednesday": [
        { "start": "13:00", "end": "18:00" }
      ],
      "friday": [
        { "start": "09:00", "end": "16:00" }
      ]
    },
    "profileImage": "https://example.com/profile.jpg",
    "interests": ["Web Development", "Mobile Apps", "UI/UX Design", "Databases"]
  },
  "preference": {
    "career": "Software Development",
    "gender": "NO_ANSWER",
    "ethnicity": "NO_ANSWER",
    "notes": "Looking for a mentor with experience in full-stack development and career guidance",
    "age": {
      "min": 25,
      "max": 40
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
