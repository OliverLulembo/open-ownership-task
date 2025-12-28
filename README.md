## Getting Started

First install all dependencies by running:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Data Source

The data source used is json objects and therefore, a hard refresh taks all data back to it's original state.

## UX Rationale

Work Interface UX Design Rationale
Date: December 28, 2025
Designer: Oliver Lulembo

---

1. Executive Summary
   The task is to create a guided work environment that support structured processes over time and promotes productivity, support and visibility for the two user contexts (task executor and overseer).

2. The Problem Statement
   • The Challenge: Work Interfaces tend to give information overload and can sometimes leave users lost in terms of what work needs to be done.
   • Success Metrics: Increased productivity and support for users executing tasks and increased visibility for task overseers.
3. User Context & Research

USER PERSONAS

Persona 1: Task Executor
Name: Daniel Role: Task Executor Authority Level: Limited
Primary Goal: Complete assigned work correctly and efficiently
Context: Interruption-heavy, time-bound, accuracy-critical
Profile
• Handles multiple work items daily
• Rarely decides what work exists, only how to complete it
• Often resumes work after interruptions or handovers
Frustrations
• Unsure what is urgent and “what’s next”
• Blocked work looks the same as active work
• Unsure what has changed since the last interaction with the system
Success Looks Like
• View list of tasks with priority
• Execute Task
• See tasks that are
• Clear status of tasks whether these are completed or active

Persona 2: Process Overseer
Name: Miriam Role: Process Overseer Authority Level: Board
Primary Goal: Ensure work flows smoothly across teams
Context: High volume, exception-driven, oversight-focused
Profile
• Oversees multiple work streams simultaneously
• Intervenes only when necessary
• Delegates and reallocates work
• Measures success by system health, not task completion
Frustrations
• Too much low-value detail
• Difficulty spotting real issues
• Forced to open individual items to understand problems
• Micromanagement by interface design
Success Looks Like
• Clear signals
• Fast diagnosis
• Minimal intervention

CUSTOMER NEEDS STATEMENTS

Task Executer
• I want to quickly resume work, understand what has changed since my last interaction,
• I want to distinguish between work waiting on me versus other tasks.
• I want to clearly know the current state of each work item,
• I want to know what is required to move it forward, and whether action is optional, required, or blocked.
• I want help deciding what to do next by surfacing priority and urgency while minimizing cognitive load
• I want to efficiently locate, narrow, and move between work items as volume and complexity increase, without losing context.
Overseers
• I want to immediately be aware of exceptions and meaningful signals.
• I want to be able to easily make interventions without forcing constant action.

4. Design Decisions & Rationale
   Feature A: Kanban board with a twist
   • Rationale: The Kanban board layout has become a familiar layout particularly in project environments. To add a traditional feel to it, the boards are named after the traditional tray layout of desk work where workers have an “in-tray” where files they need to work on are dropped and an “out - tray” where files they have worked on can be picked up and delivered to the next person to take action.
   Feature B: To-do list layout
   • Rationale: The traditional to do list layout orders the tasks by priority and time to due date/time to allow users to just immediately start working on tasks from the top to the bottom
   Feature C: Color Coded progress bar on tasks
   • Rationale: A color coded progress bar shows how much time the user has left to execute a task. It is also color coded according to priority
   Feature D: Notification icons on each task
   • Rationale: The notifications on a task show if there have been any changes to the particular work item since the last time the user worked on it or if there are new comments on a task
   Feature E: Greyed out tasks that blocked
   • Rationale: Greyed out task follow the convention of items that cannot be acted on in computer systems
   Feature F: Color Coded icons and badges for priority and status
   • Rationale: Color coded icons such as a red warnig icon for a task that is overdue, provide early visual cues for intervention
   Feature G: Task timeline for overseers
   • Rationale: Overseers are able to view the timeline of the tasks within a process (including the tasks that are yet to be created) to provide an idea of how far progress on a process has gone.
5. Constraints & Technical Considerations
   • Technical Limits: Several assumptions were made in terms of
   • Business Constraints: Limited timeline for a task with a lot to consider.
6. Accessibility & Inclusivity
   • Compliance: Colour contrast is sufficient for people with mild colour-related visual impairments.

7. Conclusion & Next Steps
   • Validation: prototype can be accessed on
   • Future Iterations: The task is quite the exiting challenge and given more time and more information, I would be able to create a more visually appealing, more comprehensive UI.
