# CampusPilot --- Developer GitHub & Development Guide

> **Core rule:** Everyone works on their own branch. Developers create
> Pull Requests. **Only Arpan merges into `main`.**

## 1. Team Responsibilities

  -----------------------------------------------------------------------
  Developer               Branch                  Primary Responsibility
  ----------------------- ----------------------- -----------------------
  Arpan                   `arpan-dev`             Database, models,
                                                  deployment, repository
                                                  management

  Ankita                  `ankita-dev`            AI integration, chat,
                                                  AI-related schemas

  Soumyadip               `soumyadip-dev`         Backend, Auth,
                                                  `main.py`

  Frontend Developer      `frontend-dev`          Frontend
  -----------------------------------------------------------------------

### Overall Workflow

``` text
DEVELOPER BRANCH
      ↓
Create / edit assigned files
      ↓
Test locally
      ↓
git add → git commit → git push
      ↓
Pull Request → main
      ↓
Arpan reviews
      ↓
Arpan merges
      ↓
main
      ↓
Everyone updates their branch
```

------------------------------------------------------------------------

## 2. Repository Structure

Arpan prepares the agreed project skeleton first. Developers then work
inside the structure instead of inventing duplicate folders.

``` text
CampusPilot/
├── frontend/
├── backend/
│   └── app/
│       ├── main.py
│       ├── core/
│       ├── db/
│       │   └── models/
│       ├── api/
│       │   └── routes/
│       ├── services/
│       └── schemas/
├── tests/
├── .env.example
├── .gitignore
├── README.md
└── requirements.txt
```

### Repository Rule

If a file already exists and belongs to you, edit it.

If an agreed file does not exist yet, the responsible developer creates
it.

**Do not create duplicate files or folders.**

### Branch Ownership

  Person               Branch
  -------------------- -----------------
  Arpan                `arpan-dev`
  Ankita               `ankita-dev`
  Soumyadip            `soumyadip-dev`
  Frontend Developer   `frontend-dev`

------------------------------------------------------------------------

## 3. Arpan --- Database & Deployment

### Responsibilities

  ------------------------------------------------------------------------------
  Area                    Arpan Creates / Maintains      Purpose
  ----------------------- ------------------------------ -----------------------
  Database                `backend/app/db/database.py`   Database connection and
                                                         setup

  Models                  `backend/app/db/models/`       Database model
                                                         definitions

  Deployment              Deployment configuration       Run and deploy the
                          agreed by the team             application

  Repository              `README.md`, `.gitignore`,     Keep the shared project
                          `.env.example`, branch/ruleset organized
                          setup                          
  ------------------------------------------------------------------------------

### Arpan Workflow

``` bash
git switch arpan-dev
git pull origin main

# create/edit assigned files

git status
git add <files>
git commit -m "Describe the change"
git push origin arpan-dev
```

**Arpan is the only developer who merges Pull Requests into `main`.**

### Database Model Example

``` text
backend/
└── app/
    └── db/
        ├── database.py
        └── models/
            ├── user.py
            ├── task.py
            └── note.py
```

Ankita may create some AI-related schema parts, such as
task/note-related schemas, when those parts are part of her AI
integration responsibility. Coordinate when a change crosses ownership.

------------------------------------------------------------------------

## 4. Ankita --- AI Integration

### Responsibilities

  --------------------------------------------------------------------------------
  Area                    Ankita Creates / Maintains       Purpose
  ----------------------- -------------------------------- -----------------------
  Chat                    `backend/app/services/chat.py`   AI chat integration
                          and agreed chat files            

  AI Integration          AI-related service/integration   Connect CampusPilot to
                          files                            the AI layer

  Schemas                 AI-related task/note schema      Represent AI-facing
                          parts when needed                data
  --------------------------------------------------------------------------------

### Example

``` text
backend/
└── app/
    └── services/
        └── chat.py
```

### Ankita Workflow

``` bash
git switch ankita-dev
git pull origin main

# create/edit assigned files

git status
git add <files>
git commit -m "Implement AI chat service"
git push origin ankita-dev
```

After pushing, Ankita creates a Pull Request:

``` text
ankita-dev → main
```

**She does not merge it.**

------------------------------------------------------------------------

## 5. Soumyadip --- Backend & Auth

### Responsibilities

  ----------------------------------------------------------------------------------
  Area                    Soumyadip Creates / Maintains      Purpose
  ----------------------- ---------------------------------- -----------------------
  Backend                 `backend/app/api/` and backend     Application/API logic
                          services assigned to backend       

  Auth                    `backend/app/api/routes/auth.py`   Authentication and
                          and assigned auth files            authorization

  Main                    `backend/app/main.py`              Application entry point

  Integration             Backend integration with other     Connect application
                          modules                            components
  ----------------------------------------------------------------------------------

### Example Files

``` text
backend/app/main.py
backend/app/core/security.py
backend/app/api/routes/auth.py
```

### Soumyadip Workflow

``` bash
git switch soumyadip-dev
git pull origin main

# create/edit assigned files

git status
git add <files>
git commit -m "Implement authentication"
git push origin soumyadip-dev
```

**Soumyadip does not push directly to `main` and does not merge his own
PR.**

------------------------------------------------------------------------

## 6. Frontend Developer

### Responsibilities

  -----------------------------------------------------------------------
  Area                    Frontend Developer      Purpose
                          Creates / Maintains     
  ----------------------- ----------------------- -----------------------
  Frontend                `frontend/`             User interface

  Components              Inside the agreed       Reusable UI pieces
                          frontend structure      

  Pages                   Inside the agreed       Application screens
                          frontend structure      

  Frontend Integration    Assigned API/client     Connect UI to backend
                          files                   
  -----------------------------------------------------------------------

### Frontend Workflow

``` bash
git switch frontend-dev
git pull origin main

# create/edit assigned frontend files

git status
git add <files>
git commit -m "Implement dashboard UI"
git push origin frontend-dev
```

Frontend work stays on `frontend-dev` until the Pull Request is reviewed
and merged by Arpan.

------------------------------------------------------------------------

## 7. Common Daily Workflow

### Before Coding

First update your local `main`:

``` bash
git switch main
git pull origin main
```

Then switch to your development branch:

``` bash
git switch <your-branch>
```

For example:

``` bash
git switch ankita-dev
```

Merge the latest `main` into your working branch:

``` bash
git merge main
```

This brings the latest `main` changes into your working branch.

### Create or Edit Files

Check the existing structure first.

-   Edit an existing file if it already exists.
-   Create a new file only when it belongs to your responsibility.
-   Do not create duplicate files or folders.

### Before Pushing

Check your changes:

``` bash
git status
```

### Commit and Push

``` bash
git add <files>
git commit -m "Short description of change"
git push origin <your-branch>
```

------------------------------------------------------------------------

## 8. Pull Request Workflow

### Developer

``` text
Your branch
    ↓
git push origin <your-branch>
    ↓
GitHub → Pull requests → New pull request
    ↓
base: main
compare: your branch
```

When creating the Pull Request:

1.  Write a short title.
2.  Explain what changed.
3.  Explain how it was tested.

### Arpan Review

``` text
Arpan receives PR
      ↓
Review files
      ↓
Review code
      ↓
Check tests
      ↓
Check security
      ↓
Approve OR request changes
      ↓
Merge when ready
```

**Only Arpan merges into `main`.**

### If Changes Are Requested

Stay on the same branch and fix the requested code:

``` bash
git switch <your-branch>

# fix the requested code

git add <files>
git commit -m "Address review comments"
git push origin <your-branch>
```

The existing Pull Request updates automatically.

**Do not create a second PR for the same work.**

------------------------------------------------------------------------

## 9. GitHub Rules for `main`

The CampusPilot ruleset protects the `main` branch and targets:

``` text
refs/heads/main
```

### Configured Rules

  Rule                      Configured Behavior
  ------------------------- ---------------------------------------
  Pull Request              Required before merging
  Approvals                 1 required
  Stale Approval            Dismissed when new commits are pushed
  Conversation Resolution   Required
  Force Push                Blocked
  Deletion                  Blocked
  Bypass                    Arpan is the configured bypass actor

### Recommended Team Behavior

Even though Arpan has bypass permission, use the Pull Request workflow
for normal changes so the project stays consistent.

### Do Not

-   Do not push normal development directly to `main`.
-   Do not force-push `main`.
-   Do not create duplicate backend folders.
-   Do not commit `.env` files or secrets.
-   Do not modify another owner's files without coordination.
-   Do not merge your own Pull Request.

------------------------------------------------------------------------

## 10. After Arpan Merges

A merge changes GitHub `main`, but it does **not** automatically update
every developer's local branch.

Update your local branch as follows:

``` bash
git switch main
git pull origin main

git switch <your-branch>
git merge main
```

### Example: Soumyadip Updates After Ankita's PR Is Merged

``` bash
git switch main
git pull origin main

git switch soumyadip-dev
git merge main
```

Now Soumyadip has the latest integrated code and can continue his work.

------------------------------------------------------------------------

## 11. Quick Command Sheet

  Command                      Purpose
  ---------------------------- -------------------------------
  `git status`                 See branch and changed files
  `git branch`                 See local branches
  `git switch <branch>`        Switch branches
  `git fetch origin`           Refresh remote information
  `git pull origin main`       Get latest `main`
  `git merge main`             Bring `main` into your branch
  `git add <files>`            Stage files
  `git commit -m "message"`    Create a commit
  `git push origin <branch>`   Push your branch

------------------------------------------------------------------------

## Quick Team Checklist

### Before coding

-   [ ] Switch to `main`
-   [ ] Pull the latest `main`
-   [ ] Switch to your assigned branch
-   [ ] Merge `main` into your branch
-   [ ] Check the existing project structure

### While coding

-   [ ] Work only on assigned files/areas
-   [ ] Avoid duplicate folders/files
-   [ ] Coordinate before changing another owner's files
-   [ ] Never commit secrets or `.env` files

### Before pushing

-   [ ] Run/test the changes locally
-   [ ] Run `git status`
-   [ ] Stage the required files
-   [ ] Create a clear commit message
-   [ ] Push to your own branch

### Pull Request

-   [ ] Create PR from your branch to `main`
-   [ ] Describe what changed
-   [ ] Describe how it was tested
-   [ ] Wait for review
-   [ ] Address review comments on the same branch
-   [ ] Do not merge your own PR

### After a merge

-   [ ] Pull the latest `main`
-   [ ] Merge `main` into your development branch
-   [ ] Continue development from the updated branch
