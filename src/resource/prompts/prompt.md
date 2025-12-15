see in this image, currently user can select available days like, sunday, monday etc

then time, the conflict is user can't select different time for different days.

so how should i do backend so that my backend can work.

```
// Example structure stored in availability field
{
  "monday": [
    {"start": "09:00", "end": "12:00"},
    {"start": "14:00", "end": "17:00"}
  ],
  "tuesday": [
    {"start": "10:00", "end": "15:00"}
  ],
  // ... other days
}
```
