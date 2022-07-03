Challenge #1: Tech stack:

Vue3/Vuex/VueRouter
Typescript
ElementUI/Vuetify/Quasar (if we don't build our own UI Kit)
Jest
Cypress (if it's a FE developer's area of responsibility)
SSR (if needed)
Architecture: Depends on how the app segments (organizations, projects, analytics media assets and much more) differ from each other. And how we're going to manage roles/rights. We can split these segments into separate apps to work on them independently (it brings complexity to the development process and CI/CD but can parallelize the work and make apps smaller)

The easiest/simplest architecture could be

shared level (UI Kit + utils/helpers, types, styles)
own level for each segment (just separate folders for each segment with own components/pages, store modules etc)
roles/rights management system (can be stored on FE or (better) we can rely on some BE API endpoint and then only parse it on FE side)
Code quality: Conventions, style guides, docs, shared code, maybe Sonar

Challenge #2: Notes:

Didn't add fancy stuff (focus only on functionality)
It'd be cool to add a phantom placeholder when reordering elements
It'd be cool to add buttons for removal elements
General logic could be better (the sky's the limit)
It'd be cool to dive deeper into JointJS native styles (more fancy links etc)
Mocking/faking API calls isn't implemented
Would be cool to use Vue3 and Typescript
