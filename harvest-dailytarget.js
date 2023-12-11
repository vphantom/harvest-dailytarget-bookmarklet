/**
 * Harvest Daily Target Hours (bookmarklet)
 *
 * Adds number inputs for weekly/daily target hours.
 * Updates daily target based on days left and weekly objective.
 * Shows hours left today and ETA near total.
 * Estimates current-day productivity and equivalent target.
 *
 * @package   harvest-bookmarklet-dailytarget
 * @author    Stéphane Lavergne <https://github.com/vphantom/>
 * @copyright 2018-2023 Stéphane Lavergne
 * @license   https://opensource.org/licenses/MIT  MIT
 */
/* eslint-env browser, jquery */
(function() {
	var hours_per_week = 37.5,
		days_per_week = 5;

	function output(hrs) {
		// In a day, 90-minute blocks have decreasing productivity output.
		var block_size = 1.5;
		var block_outputs = [1.75, 1.75, 1.5, 0.5, 0.33, 0.25, 0.25, 0.25];
		if (hrs < 0.01 || hrs > 12) return 0;
		var out = 0;
		block_outputs.forEach(function(bo, i) {
			var todo = block_size * i;
			if (hrs > todo) {
				out += Math.min(block_size, hrs - todo) * bo;
			}
		});
		return out;
	}

	function input(hrs) {
		// Guess based reciprocal of output().
		if (hrs < 0.01 || hrs >= 9.87) return 0; // output(8*1.5) = 9.87
		var guess = hrs / 2;
		var diff = hrs - output(guess);
		var i = 0;
		while (i < 100 && Math.abs(diff) > 0.01) {
			i++;
			guess = guess + diff / 2;
			diff = hrs - output(guess);
		}
		if (i >= 100) return 0; // Fail-safe in case something goes horribly wrong
		return guess;
	}

	// Inject CSS
	$('head').append(
		'<style type="text/css">td.entry-time:after{content:attr(title);color:#888;font-size:67%;position:absolute;right:17px;top:60%;}</style>'
	);

	// Create input for target hours
	$('.js-timesheet-view')
		.first()
		.prepend(
			'<div style="background:#f8f8f8;border:1px solid #e0e0e0;padding:0.5em;width:fit-content;margin:0 auto 1em auto;text-align:right"><b style="font-size:150%;margin-right:1em">Targets</b>' +
				' W:<input title="Weekly hours" type="number" id="__w_tgt" value="' +
				hours_per_week +
				'" min="0" max="99" step="1">' +
				' D/W:<input title="Days per week" type="number" id="__w_l" value="' +
				days_per_week +
				'" min="1" max="7" step="1">' +
				' D:<input title="Daily hours" type="number" id="__d_tgt" min="0" max="24" step="0.01">' +
				' <b style="font-size:150%;margin-left:1em">ETA: <span id="__eta"></span></b>' +
				'<br>(<i>#est: <span id="__meta"></span></i>)</div>'
		);
	var weekly = $('#__w_tgt'),
		weekDays = $('#__w_l'),
		daily = $('#__d_tgt'),
		etas = $('#__eta'),
		metas = $('#__meta');
	// Update ETA on daily input change and periodically
	var update_eta = function() {
		var dailyVal = Number(daily.val()),
			done = Number($('.is-today .pds-text-sm').text()),
			delta = Math.max(0, dailyVal - done),
			eta = new Date(new Date().getTime() + delta * 3600000);
		etas.html(
			delta.toFixed(2) +
				'h until ' +
				eta.getHours() +
				':' +
				(eta.getMinutes() < 10 ? '0' : '') +
				eta.getMinutes()
		);
		var mdone = 0,
			sdone = 0;
		$('table#day-view-entries tr.day-view-entry').each(function() {
			var note = $(this)
					.find('div.entry-details div.notes')
					.text(),
				done = Number(
					$(this)
						.find('td.entry-time')
						.text()
				);
			/#est/.test(note) ? (mdone += done) : (sdone += done);
		});
		var mdelta = Math.max(0, input(dailyVal - sdone) - mdone),
			meta = new Date(new Date().getTime() + mdelta * 3600000),
			ratio =
				Math.round((output(mdone) / mdone + Number.EPSILON) * 100) /
				100;
		metas.html(
			mdelta.toFixed(2) +
				'h until ' +
				meta.getHours() +
				':' +
				(meta.getMinutes() < 10 ? '0' : '') +
				meta.getMinutes() +
				' ' +
				ratio +
				'x so far'
		);
		$('table#day-view-entries tr.day-view-entry').each(function() {
			var note = $(this)
				.find('div.entry-details div.notes')
				.text();
			done = Number(
				$(this)
					.find('td.entry-time')
					.text()
			);
			if (/#est/.test(note)) {
				$(this)
					.find('td.entry-time')
					.attr(
						'title',
						Math.round((done * ratio + Number.EPSILON) * 100) / 100
					);
			}
		});
	};
	setInterval(update_eta, 2000);
	daily.on('input change', update_eta);

	// Update daily input on weekly input change
	var update_daily = function() {
		var weeklyVal =
				Number(weekly.val()) -
				Number($('#day-view-week-nav-total .test-week-total').text()) +
				Number($('.is-today .pds-text-sm').text()),
			now = new Date(),
			weekDaysLeft =
				1 +
				Number(weekDays.val()) -
				(now.getDay() == 0 ? 7 : now.getDay());
		daily.val(Number(weeklyVal / weekDaysLeft).toFixed(2));
		update_eta();
	};
	update_daily();
	weekly.on('input change', update_daily);
	weekDays.on('input change', update_daily);
})();
