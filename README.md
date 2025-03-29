# Exclusive Clubhouse

An exclusive clubhouse web application where users can create, view, and manage posts. Membership is required to view author details of posts. Users can join the club by entering a secret passcode. The app allows users to create posts, view posts from other members, and log in or out of the system.

## Features

- **User Authentication**: Users can sign up, log in, and log out of the platform.
- **Membership Activation**: Users can join the club using a secret passcode and gain full access to the platform.
- **Post Creation**: Logged-in users can create new posts with a title and content.
- **Post Viewing**: All users can view posts, but only members can see the author details.
- **User Profiles**: View user details and manage posts based on membership status.

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: Passport.js with session-based authentication
- **Frontend**: EJS for templating
- **Session Management**: `express-session` with PostgreSQL session store

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [PostgreSQL](https://www.postgresql.org/) database running

### Install Dependencies

1. Clone the repository:

   ```bash
   git clone git@github.com:DGUXdesigns/members-only.git
   ```
