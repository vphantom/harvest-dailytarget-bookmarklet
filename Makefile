harvest-dailytarget.url:	harvest-dailytarget.js
	uglifyjs --mangle --warn $< |sed 's/^/javascript:/;s/;$$//' >$@
