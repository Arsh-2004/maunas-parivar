# Registration Form - Visual Guide

## 1. FORM VALIDATION - Error Notification (Toast Popup)

When user submits incomplete or invalid form:

```
┌─────────────────────────────────────────────────────┐
│ TOP-RIGHT CORNER                                    │
│ ┌──────────────────────────────────────────────┐   │
│ │ ❌ Please enter your full name                ✕  │
│ └──────────────────────────────────────────────┘   │
│ (Red background, auto-closes after 5 seconds)      │
└─────────────────────────────────────────────────────┘

ENGLISH: "❌ Please enter your full name"
HINDI:   "❌ कृपया अपना पूरा नाम दर्ज करें"
```

---

## 2. FILE UPLOAD ERROR - Notification (Toast Popup)

When user uploads wrong file type:

```
┌─────────────────────────────────────────────────────┐
│ TOP-RIGHT CORNER                                    │
│ ┌──────────────────────────────────────────────┐   │
│ │ ❌ Please upload a JPG/PNG image file only    ✕  │
│ └──────────────────────────────────────────────┘   │
│ (Red background)                                    │
└─────────────────────────────────────────────────────┘

ENGLISH: "❌ Please upload a JPG/PNG image file only"
HINDI:   "❌ कृपया केवल JPG/PNG छवि फ़ाइल अपलोड करें"
```

---

## 3. SUCCESSFUL VALIDATION - Review Modal

When form is valid and all fields filled:

```
╔════════════════════════════════════════════════════╗
║                   POPUP MODAL                      ║
║ ┌──────────────────────────────────────────────┐  ║
║ │               📋 Review Your Details         │  ║
║ │                                              │  ║
║ │ Please check all your information carefully  │  ║
║ │ before confirming:                           │  ║
║ │                                              │  ║
║ ├──────────────────────────────────────────────┤  ║
║ │ Full Name:  John Doe      Father's Name:    │  ║
║ │             Ram Kumar                        │  ║
║ │                                              │  ║
║ │ Date of Birth: 1995-05-15  Gender: Male     │  ║
║ │                                              │  ║
║ │ Email: john@example.com                      │  ║
║ │ Phone: 9876543210                            │  ║
║ │                                              │  ║
║ │ Address: 123 Main Street, Apt 4B             │  ║
║ │                                              │  ║
║ │ City: Mumbai          State: Maharashtra     │  ║
║ │ Pincode: 400001                              │  ║
║ │                                              │  ║
║ │ Occupation: Software Engineer                │  ║
║ │ Education: Graduate                          │  ║
║ │                                              │  ║
║ │ ✓ Documents Uploaded:                        │  ║
║ │   ✓ ID Proof Photo                           │  ║
║ │   ✓ Address Proof Photo                      │  ║
║ │   ✓ Profile Photo                            │  ║
║ │   ✓ Donation Receipt                         │  ║
║ │                                              │  ║
║ ├──────────────────────────────────────────────┤  ║
║ │  [◄ Back to Edit]  [Continue to Confirm ►] │  ║
║ └──────────────────────────────────────────────┘  ║
╚════════════════════════════════════════════════════╝

Options:
- Back to Edit: Returns to form for editing
- Continue to Confirm: Proceeds to final confirmation step
```

---

## 4. FINAL CONFIRMATION - Confirmation Modal

After clicking "Continue to Confirm":

```
╔════════════════════════════════════════════════════╗
║                   POPUP MODAL                      ║
║ ┌──────────────────────────────────────────────┐  ║
║ │              ⚠️ Final Confirmation            │  ║
║ │                                              │  ║
║ │ By clicking "Confirm Registration", you     │  ║
║ │ certify that all the information provided   │  ║
║ │ is true and accurate. Any false information │  ║
║ │ may result in rejection of your application.│  ║
║ │                                              │  ║
║ ├──────────────────────────────────────────────┤  ║
║ │ ☐ I confirm that all details are accurate   │  ║
║ │   and complete                               │  ║
║ │                                              │  ║
║ ├──────────────────────────────────────────────┤  ║
║ │  [◄ Back]  [Confirm Registration] (disabled)│  ║
║ │                                              │  ║
║ │ NOTE: Confirm button is DISABLED until ☑️  │  ║
║ └──────────────────────────────────────────────┘  ║
╚════════════════════════════════════════════════════╝

After checking the checkbox ☑️:
║ │  [◄ Back]  [Confirm Registration] (enabled) │  ║
```

---

## 5. SUCCESSFUL REGISTRATION - Success Modal

After confirming registration:

```
╔════════════════════════════════════════════════════╗
║                   POPUP MODAL                      ║
║ ┌──────────────────────────────────────────────┐  ║
║ │               ✅ Registration Successful!    │  ║
║ │                                              │  ║
║ │ Registration successful! Your application   │  ║
║ │ is pending approval. You will be notified   │  ║
║ │ once approved.                               │  ║
║ │                                              │  ║
║ ├──────────────────────────────────────────────┤  ║
║ │              [OK]                            │  ║
║ └──────────────────────────────────────────────┘  ║
╚════════════════════════════════════════════════════╝

ENGLISH: "Registration successful! Your application is 
         pending approval. You will be notified once approved."
         
HINDI:   "पंजीकरण सफल! आपका आवेदन अनुमोदन के लिए लंबित है। 
         अनुमोदित होने पर आपको सूचित किया जाएगा।"
```

---

## 6. ERROR DURING REGISTRATION - Error Notification

If server error occurs during submission:

```
┌─────────────────────────────────────────────────────┐
│ TOP-RIGHT CORNER                                    │
│ ┌──────────────────────────────────────────────┐   │
│ │ ❌ Connection error. Please try again.        ✕  │
│ └──────────────────────────────────────────────┘   │
│ (Red background, auto-closes after 5 seconds)      │
└─────────────────────────────────────────────────────┘

ENGLISH: "❌ Connection error. Please check if the 
         server is running."
         
HINDI:   "❌ कनेक्शन त्रुटि। कृपया जांचें कि सर्वर चल 
         रहा है।"
```

---

## 7. NOTIFICATION TYPES & COLORS

### Error Notification (Red)
```
┌─────────────────────────────────────┐
│ ❌ Error message here             ✕ │
└─────────────────────────────────────┘
Background: #fadbd8 (Light Red)
Border: #e74c3c (Dark Red)
```

### Success Notification (Green)
```
┌─────────────────────────────────────┐
│ ✅ Success message here           ✕ │
└─────────────────────────────────────┘
Background: #d5f4e6 (Light Green)
Border: #27ae60 (Dark Green)
```

### Warning Notification (Orange)
```
┌─────────────────────────────────────┐
│ ⚠️ Warning message here            ✕ │
└─────────────────────────────────────┘
Background: #fdebd0 (Light Orange)
Border: #f39c12 (Dark Orange)
```

### Info Notification (Blue)
```
┌─────────────────────────────────────┐
│ ℹ️ Information message here        ✕ │
└─────────────────────────────────────┘
Background: #d6eaf8 (Light Blue)
Border: #3498db (Dark Blue)
```

---

## 8. MOBILE VIEW - Responsive Design

### Mobile Toast Notification
```
┌─────────────────────┐
│ ❌ Error message ✕ │
└─────────────────────┘
(Full width on mobile)
(Top: 10px, adapts to screen size)
```

### Mobile Modal
```
┌──────────────────────┐
│                      │
│    Modal Content     │
│    (Responsive)      │
│                      │
│   [Back] [Continue] │
│                      │
└──────────────────────┘
(Adapts to screen size)
(Scrollable if content exceeds height)
```

---

## 9. USER ACTION FLOW WITH NOTIFICATIONS

```
START REGISTRATION
       │
       ▼
FILL FORM
       │
       ├─► EMPTY FIELD?
       │   YES ─────► ❌ Toast: "Please enter [field]"
       │   NO ──┐
       │        │
       ▼        │
   SUBMIT      │
       │        │
       ├────────┘
       │
       ▼
VALIDATION
       │
       ├─► INVALID?
       │   YES ─────► ❌ Toast: "Invalid [field]"
       │   NO ──┐
       │        │
       ▼        │
   FILE CHECK   │
       │        │
       ├────────┘
       │
       ├─► FILE ERROR?
       │   YES ─────► ❌ Toast: "File error"
       │   NO ──┐
       │        │
       ▼        │
   REVIEW       │
  MODAL SHOWN   │
       │        │
       ├────────┘
       │
       ▼
USER REVIEWS
  (Can Edit)
       │
       ├─► CLICK BACK?
       │   YES ─────► Return to form
       │   NO ──┐
       │        │
       ▼        │
  CONFIRM STEP  │
     MODAL      │
       │        │
       ├────────┘
       │
       ▼
USER CHECKS BOX
       │
       ├─► BOX UNCHECKED?
       │   YES ─────► Button DISABLED
       │   NO ──┐
       │        │
       ▼        │
  SUBMIT TO     │
  SERVER        │
       │        │
       ├────────┘
       │
       ├─► SERVER ERROR?
       │   YES ─────► ❌ Toast: Error message
       │   NO ──┐
       │        │
       ▼        │
   SUCCESS!     │
       │        │
       ├────────┘
       │
       ▼
  ✅ Modal: "Registration Successful!"
```

---

## 10. ERROR MESSAGE EXAMPLES

| Field | Error Type | Message |
|-------|-----------|---------|
| Full Name | Empty | ❌ Please enter your full name |
| Full Name | Invalid | ❌ Full name should contain only letters |
| Father's Name | Empty | ❌ Please enter father's name |
| Father's Name | Invalid | ❌ Father's name should contain only letters |
| Date of Birth | Empty | ❌ Please select your date of birth |
| Age | Too Young | ❌ You must be at least 18 years old |
| Age | Too Old | ❌ Please enter a valid date of birth |
| Gender | Empty | ❌ Please select your gender |
| Email | Empty | ❌ Please enter your email address |
| Email | Invalid | ❌ Please enter a valid email address |
| Phone | Empty | ❌ Please enter your phone number |
| Phone | Invalid | ❌ Please enter a valid 10-digit phone number |
| Password | Empty | ❌ Please enter a password |
| Password | Short | ❌ Password must be at least 6 characters |
| Confirm Password | Mismatch | ❌ Passwords do not match! |
| Address | Empty | ❌ Please enter your address |
| Address | Short | ❌ Please enter a complete address (min 10 chars) |
| State | Empty | ❌ Please select or enter your state |
| City | Empty | ❌ Please select or enter your city |
| Pincode | Empty | ❌ Please enter your pincode |
| Pincode | Invalid | ❌ Please enter a valid 6-digit pincode |
| Education | Empty | ❌ Please select your education |
| Occupation | Empty | ❌ Please enter your occupation |
| Occupation | Short | ❌ Please enter a valid occupation |
| ID Proof | Missing | ❌ Please upload your ID proof photo |
| Address Proof | Missing | ❌ Please upload your address proof photo |
| Photo | Missing | ❌ Please upload your photo |
| File Upload | Wrong Type | ❌ Please upload a JPG/PNG image only |
| File Size | Too Large | ❌ File size should be less than 5MB/2MB |
| Server | Error | ❌ Registration failed. Please try again |
| Connection | Error | ❌ Connection error. Server not running |

---

**Version:** 1.0  
**UI Framework:** React  
**Styling:** CSS  
**Status:** ✅ Ready for Production
