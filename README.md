# FAQ_Session

## Project Overview

This is a FAQ (Frequently Asked Questions) web application with a multi-page structure and authentication system.

## Pages

### Page 1: Public FAQ
- **Access**: Visible to all users (no authentication required)
- **Description**: Displays frequently asked questions that are accessible to everyone

### Page 2: Add FAQ (Authenticated)
- **Access**: Only accessible after user authentication
- **Description**: Allows authenticated users to add their own frequently asked questions to the system

### Page 3: FAQ Replies (Authenticated)
- **Access**: Only accessible after user authentication
- **Description**: Allows authenticated users to view and reply to FAQs posted by other users

## Features

- Public FAQ browsing
- User authentication system
- Add custom FAQs
- Community-driven Q&A with replies

## Layout

```
┌─────────────────────────────────────────────────────┐
│                     Header/Navigation               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │                                              │  │
│  │         Main Content Area                   │  │
│  │                                              │  │
│  │  Page 1: Public FAQ                          │  │
│  │  - Question 1                                │  │
│  │  - Question 2                                │  │
│  │  - Question 3                                │  │
│  │                                              │  │
│  │  OR                                          │  │
│  │                                              │  │
│  │  Page 2: Add FAQ (Authenticated)             │  │
│  │  [Add FAQ Form]                              │  │
│  │                                              │  │
│  │  OR                                          │  │
│  │                                              │  │
│  │  Page 3: FAQ Replies (Authenticated)         │  │
│  │  - FAQ Item with Replies Section             │  │
│  │  - Reply 1                                   │  │
│  │  - Reply 2                                   │  │
│  │                                              │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                     Footer                          │
└─────────────────────────────────────────────────────┘
```

### Navigation Structure

```
Home
├── Public FAQ (Page 1)
└── [Authentication Check]
    ├── Add FAQ (Page 2)
    └── FAQ Replies (Page 3)
```

