/**
 * Harvest Daily Target Hours (bookmarklet)
 *
 * Adds number inputs for weekly/daily target hours.
 * Updates daily target based on days left and weekly objective.
 * Shows hours left today and ETA near total.
 *
 * @package   harvest-bookmarklet-dailytarget
 * @author    Stéphane Lavergne <https://github.com/vphantom/>
 * @copyright 2018-2023 Stéphane Lavergne
 * @license   https://opensource.org/licenses/MIT  MIT
 */
/* eslint-env browser, jquery */
(function() {
	var hours_per_week = 37.5,
		days_per_week = 5,
		min_ratio = 3 / 5;

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
				'<br>(<i>min: <span id="__meta"></span></i>)</div>'
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
			mdelta = Math.max(0, dailyVal * min_ratio - done),
			eta = new Date(new Date().getTime() + delta * 3600000),
			meta = new Date(new Date().getTime() + mdelta * 3600000);
		etas.html(
			delta.toFixed(2) +
				'h until ' +
				eta.getHours() +
				':' +
				(eta.getMinutes() < 10 ? '0' : '') +
				eta.getMinutes()
		);
		metas.html(
			mdelta.toFixed(2) +
				'h until ' +
				meta.getHours() +
				':' +
				(meta.getMinutes() < 10 ? '0' : '') +
				meta.getMinutes()
		);
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
