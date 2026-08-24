## connection suggestion logic

1. exact match needed (we using AND operator)
2. excluding own profile
3. excluding those are already connected
4. excluding those are already pending (from both side, sender or reciever)
5. match based on interests, checking logged in user interest with other user interest through in operator,
6. match with the preference settings, where array using in operator
7. availability with in operator meaning any slot if matches then get result. if availability doesn't match with anyone still get in suggestions but who matches availability come first in order.
