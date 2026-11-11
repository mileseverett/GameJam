# University of Aberdeen GameJam 2027 website

This is the website for the University of Aberdeen GameJam 2027. It is a single static page with no build step, published with GitHub Pages from the `main` branch.

## Previewing

Open `index.html` in a browser. To see how the page looks on a different date, add `?now=` and a date to the address, for example `index.html?now=2027-01-27T09:00:00Z`.

## Editing

All of the content is in `index.html`. Each section starts with a comment that explains how to add to it.

| To change | Where in `index.html` |
|---|---|
| Sign-up form link | The `href` of the `signup-link` button in the Sign up section. The Sign up buttons in the navigation bar and at the top of the page pick it up from there. |
| Dates and times | The `data-at` and `data-until` attributes on each timeline entry, plus the dates written in the text. Times are UK time. |
| Rules | Add an `<li>` to the list in the Rules section. |
| FAQs | Copy a `<details class="faq">` block in the FAQs section. |
| Sponsors | Save the logo in `assets/sponsors/`, then copy the template from the comment above the Sponsors section. |
| Contact details | Copy a line from the comment above the Contact section into the list. |

Colours and layout are in `styles.css`. The countdowns and the timeline status labels are driven by `script.js`, which reads the dates from `index.html`.

`GameJam_Single Colour.svg` is the original logo. The files in `assets/` are made from it.

## Publishing

Pushing to `main` updates the live site within a minute or two. GitHub Pages is set to deploy from the `main` branch and the root folder (repository Settings, then Pages).
