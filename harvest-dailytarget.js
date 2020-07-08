/**
 * Harvest Daily Target Hours (bookmarklet)
 *
 * Adds number inputs for weekly/daily target hours.
 * Updates daily target based on days left and weekly objective.
 * Shows hours left today and ETA near total.
 *
 * @package   harvest-bookmarklet-dailytarget
 * @author    Stéphane Lavergne <https://github.com/vphantom/>
 * @copyright 2018-2020 Stéphane Lavergne
 * @license   https://opensource.org/licenses/MIT  MIT
 */
(function() {

	// Create input for target hours
	$('.js-timesheet-view').first().prepend(
		'<div><strong>Target Hours</strong> -'
		+ ' Week: <input type="number" id="__w_tgt" value="40" min="0" max="168" step="1">'
		+ ' Daily: <input type="number" id="__d_tgt" min="0" max="24" step="0.01">'
		+ ' Days/week: <input type="number" id="__w_l" value="5" min="1" max="7" step="1">'
		+ ' ETA: <span id="__eta"></span></div>'
	);
	var
		weekly = $('#__w_tgt'),
		weekDays = $('#__w_l'),
		daily = $('#__d_tgt'),
		etas = $('#__eta')
	;

	// Update ETA on daily input change and periodically
	var update_eta = function() {
		var
			dailyVal = Number(daily.val()),
			done     = Number($('.day-view-total span').text()),
			delta    = Math.max(0, dailyVal - done),
			eta      = new Date((new Date()).getTime() + (delta * 3600000)),
			etaTxt   = eta.getHours() + ':' + (eta.getMinutes() < 10 ? '0' : '') + eta.getMinutes()
		;
		etas.html(delta.toFixed(2) + 'h until ' + etaTxt);
	};
	setInterval(update_eta, 2000);
	daily.on('input change', update_eta);

	// Update daily input on weekly input change
	var update_daily = function () {
		var
			weeklyVal    = Number(weekly.val()) - Number($('#day-view-week-nav-total .test-week-total').text()) + Number($('.day-view-week-nav .is-today span').text()),
			now          = new Date(),
			weekDaysLeft = 1 + Number(weekDays.val()) - (now.getDay() == 0 ? 7 : now.getDay());
		;
		daily.val(Number(weeklyVal / weekDaysLeft).toFixed(2));
		update_eta();
	};
	update_daily();
	weekly.on('input change', update_daily);
	weekDays.on('input change', update_daily);
})();
