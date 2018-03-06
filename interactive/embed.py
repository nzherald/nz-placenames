#!/usr/bin/env python

import json
from string import Template

cssTemplate = '@import url("$base$css")'
jsTemplate = '$$.getScript("$base$js");'


base = json.load(open('package.json'))["homepage"].replace('http:', '')
manifest = json.load(open('build/asset-manifest.json'))
js = Template(jsTemplate)
open('build/embed.js', 'w').write(js.substitute(base=base, js=manifest['main.js']))

css = Template(cssTemplate)
open('build/embed.css', 'w').write(css.substitute(base=base, css=manifest['main.css']))
