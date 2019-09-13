harvest-dailytarget.url:	harvest-dailytarget.js
	terser --mangle --warn $< |sed 's/^/javascript:/;s/;$$//' >$@
