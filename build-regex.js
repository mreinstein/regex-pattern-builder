// helpful   https://rubular.com/

const alpha      = 'abcdefghijklmnopqrstuvwxyz'
const alphaUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const numeric    = '0123456789'


function isWhitespace (ch) {
    return ['\t', ' ', '\n' ].includes(ch)
}


function isWord (type) {
    return [ 'alpha', 'numeric', '_', 'word' ].includes(type)
}


// determine what part of the URL a given needle is in  hostname | pathname | search | hash | undefined
function locateUrlComponent (url, needle) {
    const u = new URL(url)
    return [ 'hostname', 'pathname', 'search', 'hash' ].find((loc) => u[loc].indexOf(needle) >= 0)
}


// build a regular expression that can extract needle pattern from url
// 
// @param String url
// @param String needle
// @return String created regular expression
export function buildRegex (url, needle) {

    // tokenize the string by character into identifiable parts
    const tokens = [ ]

    for (let i=0; i < needle.length; i++) {
        const ch = needle[i]
        let type = 'unknown'

        if (isWhitespace(ch))
            type = 'whitespace'
        else if (alpha.includes(ch))
            type = 'alpha'
        else if (alphaUpper.includes(ch))
            type = 'alpha'
        else if (numeric.includes(ch))
            type = 'numeric'
        else
            type = ch

        tokens.push({ type, ch })
    }

    const patterns = [ ]
    const cp = {
        start: 0,
        end: 0,
        type: '' 
    }

    for (let i=0; i < tokens.length; i++) {
        const t = tokens[i]
        
        if (cp.type === t.type)
            continue

        // determine if we are in a word \w situation
        if (cp.type === 'word') {
            if ([ 'alpha', 'numeric', '_' ].includes(t.type))
                continue
        }
        else if (isWord(t.type) && isWord(cp.type)) {
            cp.type = 'word'
            continue
        }

        if (!cp.type) {
            cp.type = t.type
        }
        else {
            patterns.push({ start: cp.start, end: i-1, type: cp.type })
            cp.type = t.type
            cp.start = i
            cp.end = i
        }
    }

    cp.end = needle.length - 1
    patterns.push({ ...cp })

    // convert the patterns to regular expression string :)
    let rs = ''

    for (const t of patterns) {
        if (t.type === 'word')
            rs += '\\w+'
        else if (t.type === 'numeric')
            rs += '\\d+'
        else if (t.type === 'alpha')
            rs += '[A-Za-z]+'
        else if (t.type === 'whitespace')
            rs += '\\s+'
        else if ('.+*?[]()'.includes(t.type))
            rs += `\\${t.type}+`
        else
            rs += `${t.type}+`
    }

    return `(${rs})`
}


/*
const e = examples[0]

const firstIdx = e.url.indexOf(e.pageid)

const preChar = e.url.substr(firstIdx-1,1)
const postChar = e.url.substr(firstIdx +e.pageid.length, 1)


const examples = [
    {
        url: 'https://costco.com/first/second/98765432.html',
        pageid: '98765432'
    },
    {
        url: 'https://costco.com/first/1234567/third.html',
        pageid: '1234567'
    },
    {
        url: 'https://costco.com/p-8834567/somethin.html',
        pageid: 'p-8834567'
    },
    {
        url: 'abc123_.) (!\tG Bdig   git, SUCKA',
        pageid: 'abc123_.) (!\tG Bdig   git, SUCKA'
    }
]

for (const e of examples) {
    const result =  buildRegexp(e.url, e.pageid)
    const regex = new RegExp(result, 'i')
    const matches = e.url.match(regex)
    console.log('result:', result, 'regexp test:', matches[1])
}
*/
