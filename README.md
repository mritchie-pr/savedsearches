# Saved Searches Proposal

This is a proposal for how to implement the Saved Searches in a combination of VanillaJS and React

* The main administration screen would be a React page contained as a route in the main application
* The saved searches selector located in the header on all pages, along with the saved search "add" button on select bookmarkable search results pages, would be VanillaJS web components that would feature progressive enhancement for basic support of older browsers

Web Components look like this:
```
<savedsearch-selector></savedsearch-selector>
```

For browsers that support the technology, custom tags like the above can be registered and then used on the page as if it were a native tag. They can have attributes and events just like standard elements, and can also act as containers. For browsers that don't support the technology natively, there are some approaches we can use as fallbacks:

* The developer can include polyfills that are loaded only if the feature is missing that can provide a semblance of the technology, and then the source code of the custom element can be transpiled into an older version of Javascript. The pro with this approach is that the user experience is closer to the optimal, native one. The con is that there is quite a lot more Javascript that needs to run in order to support older browsers, which needs to be considered in context with the rest of the scripting already on the site.
* The developer can add child content to the custom tags that are suppressed if the browser can handle the custom tags natively, but display if it can't -- similar to what developers do for iframes. The pro with this approach is that there is no additional Javascript needed and in fact is even a bit leaner because the web component script is also ignored. The con is that the experience isn't quite as nice for the user of these browsers.

## Main React Administrative Page
This would be a full page app with a table showing the full, clickable list of available searches, along with administrative controls to delete them. There would also be an interface to create new searches.

## Saved Search Selector
For modern browsers, this would be a component in the header with an open and closed state. The closed state would just show the icon, the summary text and an indicator showing how many saved searches the user has access to. The open state would show the summary as above, and also an attached panel overlay showing a scrollable list of named searches that can be clicked on to launch. Clicking on the component summary section would act as a toggle to change the open/closed state.

For legacy browsers, this would be a simple link showing the icon and summary text only. Clicking on the link would take the user to the main React administrative page where the user would be able to click on any of the existing searches to launch them.

Example:
```
<savedsearch-selector>
  <a href="/savedsearch/" class="savedsearch-selector-legacy">Saved Searches</a>
</savedsearch-selector>
```

## Saved Searches Button
For modern browsers, this would be a component with a button labeled "Save this Search". Clicking on the button would replace it with a panel that would include a text field the user could use to fill in a unique, memorable name for the search, along with a submit button and cancel button. Submitting the info would add the new search to the user's list, would update the button to show the saved status of the current search, and would also update the indicator number of the search selector in the header. Clicking the cancel button would return the component to its previous state.

For legacy browsers, this would be a simple link that would also go to the main React administrative page, with the create form automatically displayed with the URL of the previous results page.

Example:
```
<savedsearch-button>
  <a href="/savedsearch/create?url=somepageetcetc" class="savedsearch-button-legacy">Save this Search</a>
</savedsearch-button>
```
