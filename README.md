# Angular @NGRX Refactoring
#### A step by step tutorial to migrate your custom made rxjs stores to a REDUX architecture.

***

We will start with custom made stores/services that manages your state dirty and spreaded all over the app.
After I showed you **REAL RACE CONDITIONS** and broken state in the app we will fix this problem by implementing the REDUX pattern and some RxJS operators.

**This is no beginners talk. I expect you to know the basics of REDUX and experienced some pain in statemanagement.**
After this talk you will go home with enought knowledge to improve you redux implementation.

We will:
- implemet te redux pattern strongly typed
- manage state with a redux store
- using browserplugins to do timetravel debugging (boring)
- encapsulate side effects
- handling router states
- splitting statemanagement into feature modules
- implementing optimistic updates
- dealing with form errors => http calls will retur an error and we will find a solution on how to handle user feedback with the REDUX pattern. This is interesting for angular and react! And curreltly there is no clean solution out there. We will change this. ;-)
- select combined state

**[DEMO](https://biophoton.github.io/angular-ngrx-refactoring)**

**[Overview](https://github.com/BioPhoton/angular-ngrx-refactoring/wiki/Angular-@NGRX-Refactoring---Overview)**  

0. [Preconditions](https://github.com/BioPhoton/angular-ngrx-refactoring/wiki/Preconditions) 
1. [Manage state with @ngrx/store](https://github.com/BioPhoton/angular-ngrx-refactoring/wiki/Manage-state-with-@ngrx-store) 
2. [Enable @ngrx/store-devtools](https://github.com/BioPhoton/angular-ngrx-refactoring/wiki/Enable-@ngrx-store-devtools)
3. [Encapsulate side effects with @ngrx/effects](https://github.com/BioPhoton/angular-ngrx-refactoring/wiki/Encapsulate-side-effects-with-@ngrx-effects)  
4. [Handling router state with @ngrx/router-store](https://github.com/BioPhoton/angular-ngrx-refactoring/wiki/Handling-router-state-with-@ngrx-router-store)  

***
![Angular-NGRX-refactoring](https://raw.githubusercontent.com/BioPhoton/angular-ngrx-refactoring/master/resources/demo-gif.gif)
