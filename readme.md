# Testing Summary
Multiple ways to test functions. The labels below are my invention to refer to them more concisely.

- offline: run them within the test environment (jest) and keep them disconnected from firebase services. The docs refer to this as offline mode. An example is: https://github.com/firebase/functions-samples/blob/main/Node-1st-gen/quickstarts/uppercase-rtdb/functions/test/test.offline.js
- online emulator: run them within the test environment (jest) and have them connect to the emulator. There are no docs about this, but the code also refers to this as offline mode at least when describing the `clearFirestoreData` function.
- online real: run them within the test environment (jest) and have them connect to a real firebase project. This is described in the docs. The `clearFirestoreData` function does not work in this case.
- blackbox: load the functions into the emulator and test them by interacting with the emulator and seeing if the right thing(s) change.

# Online Emulator
This is our preferred way. It keeps the data isolated but also lets the functions access Firestore and the realtime database. Something that isn't obvious in this approach is that you need to manually trigger the functions. 

If the function is a http function then it is clear you need to call it as if someone made a request to it. For onRequest example is here:
https://github.com/firebase/functions-samples/blob/main/Node-1st-gen/quickstarts/uppercase-rtdb/functions/test/test.online.js the `addMessage` function uses on request.

If the function is watching a path for changes in the database or Firestore then you have to construct the event that would trigger the function. In other words the functions are not running the in the emulator so making a change to the database in the emulator will not trigger the function which is running in the test environment. An example of this is here:
https://github.com/firebase/functions-samples/blob/main/Node-1st-gen/quickstarts/uppercase-rtdb/functions/test/test.online.js#L54

After the trigger happens, the function will then read and write to the database as normal so the database will need to be pre-configured with the stuff it reads, and then after the function is done the database can be inspected to see if it now has the right information.
