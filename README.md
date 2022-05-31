# Quick Capture

Quick Capture is a mobile web app for quickly capturing notes. 

The main purpose is to prototype a new workflow for notes whose purpose is to solve a problem that many note-taking tools have: notes go in but they're never seen again.

Quick capture has two views: a full list of all your notes, and an inbox.


The inbox view has a list of notes which are due for review. Whenever you add a note to the app, it becomes due for review the same day.

The default action to process an item in your inbox is to "keep" it. When you keep an item, the app will reschedule it for a later date 

The "keep" action is like the snooze feature which many email clients have. But instead of deciding on an exact date to snooze the item until, you just tell the app you want to keep it around, and it'll choose a date for you.

The scheduler is the same is many populate [spaced repeition apps]. Every time you review an item, it gets rescheduled further and further into the future. So each time you review the inbox, you're mostly seeing what you added recently but also interleaved which notes you took a while ago.   



When an item is in the inbox, you can process it in one of two ways: you can archive it, meaning you 



Every note that you add 




It's mostly a prototype 


The two main design considerations were:
- Make entering a new note as quick as possible
- Reliably bring notes back to your attention 


Spaced repetition flashcard apps use an scheduler which 
When you first study a card, you'll see it the next day, then next time you study it you'll see it in 2 days, and then 4 days, a week, 2 weeks, etc.

This is where the "spaced repetition" comes from. You repeatedly see the same card, but the space to the next review keeps growing after each succesful review.


Take a quick capturing a todo for example. If you have some inbox for capturing tasks that come to mind, clearing you inbox requires going through the list and making a decision about what exactly you're going to do with that task e.g. add it to a project-specific task manager? schedule it for the future? assign it to someone? 

This can be very burdensome, and often leads either to an inbox that's always growing or it a many tasks religated to the bin.    








### Environment variables
- `DROPLET_IP`: IP address of droplet server to deploy to
- `DROPLET_USER`: User on the droplet server to deploy to

### Set up prod
TODO

### Update prod 

1. Commit your changes to master
2. Run `source .env.devops && source deploy.sh`

### Deploy demo

```
source .env.devops && source scripts/deploy-demo.sh
```


