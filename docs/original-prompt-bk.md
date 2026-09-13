I'm in a completely empty branch called pwa-refactor. 

This is because I don't you to see what was implemented before, so we can start entirely from scratch. 

Technical Requirements: 
- I need a PWA Application
- It should be UI only, with the hability to be completely cached in cell phones and tablets using PWA
- It should contain Agent files to save context about the architecture, commands, known how, and commands  being made for the next AI to pick it up. 
- Use React, TypeScript, Tailwind, and Shadcn for most of the generic components of the app. 
- But feel free to create a custom CSS for the specific cardboard scroll behavior, if it's too complex to made it in Tailwind directly. 
- The app should be localized: all texts should be loaded from a JSON file and language can be easily swapped from the UI.
- Create a proper README file with all the details on how to run the app.

Application: 
- It is fully UI application, without backend.
- The App resembles a cardboard tool (I pasted a reference image) where the brown part is the static face mentioning the music modes, and triads, and tetrads, and the white part is an horizontal movable (scroll or swipe) section containing all the notes in fifths (FA, DO, SOL, RE, LA, MI, SI). This sequence is repeated to the left in bemols "b" and to the right in sharp "#". All the way to the left the sequence is repeated in double bemol and all the way to the right is repeated in double sharp. 
- The main feature of the app is that white movable part, it should feel good, easy to move and with auto-snap, it should snap correctly with the modes columns in the face. 
- The app should be responsive. it should look great in mobile and tablet. Ideally forcing a landspace mode. But it should have a minimum supported width, if the viewport is less than 468px (configurable) an overlay should appear asking the user to turn to landscape orientation. 
- The app should be responsive for big screens as well, but of course with a maximum width in "the canvas": "The canvas" is what I call the part of the cardboard.
- Aside from the cardboard, which is the main feature, the app should still have the classical sidebar menu with options for: Selection of Scales (only Major for now), Change language, Switch Dark/Light mode, a "How to Use It" button, a "Fifths Theory" button. That sidebar menu should collapse automatically into the classical mobile drawer in smaller viewports. 

Plan accordingly: 
- Research what's the state of the art template/example or tech stack for an updated PWA stack in 2026.
- Give me a detailed plan description for me to review, do not execute or modify anything until I review the plan. 
- Dump the plan in a /docs/plans document in case I need to recover the session and context another day. 

Implementation: 
- Please also consider E2E tests using Playwright, at least a minimum set to check the UI and the basic behaviors.
- While doing the implementation, the app should be easy testeable using Cursor's browser, so this AI can open it and play with it without human intervention, so you can fix as quick as possible. 
- Same with the E2E Tests, you should be able to run them, see them, and fix them, without human intervention. 