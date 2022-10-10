This branch differs from `main` in that it provides a "pure" js solution that doesn't call out to an external service.

Also provides a UI for url pattern building.


## Regex Pattern Builer

Writing rules to extract parts of a URL is hard. It should be, like...super easy, and stuff.

This is a UI prototype that explores making this process more human friendly:


## TODO
* generate json rules compatible with the existing API
* determine if there are good “boundary” characters before/after selected regions to improve regex pattern
* run against all existing unit test data (top 10 sites) to validate it works
* propose an extension to the pageid template json to include a regexp rule type
* bugfix: cannot select a single character in the URL string (2 char minimum)
* bugfix: when URL strings linewrap the selection handles go a bit ... "wonky"
