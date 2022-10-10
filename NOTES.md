all existing json rules:

"root" rules:
* extract from hash - produces array or  string
	split bystr | left part | right part
* extract from hostname - produces array or string
	split bystr | left part | right part
* extract from path - produces array or string
	split bystr | left part | right part
* extract from query string - produces dictionary

"common" rules:
* split                     input: string variable   output: array
* take array part           input: array             output: string
* string key value factory  input: dictionary        output: string
