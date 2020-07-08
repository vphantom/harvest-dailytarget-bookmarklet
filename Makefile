harvest-dailytarget.url:	harvest-dailytarget.js
	terser --mangle --warn --comments false $< |sed 's/^/javascript:/;s/;$$//' >$@
