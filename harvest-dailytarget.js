/**
 * Harvest Daily Target Hours (bookmarklet)
 *
 * Adds number inputs for monthly/daily target hours.
 * Shows hours left this month.
 * Shows hours left today and ETA near total.
 *
 * @package   harvest-bookmarklet-dailytarget
 * @author    Stéphane Lavergne <https://github.com/vphantom/>
 * @copyright 2018 Stéphane Lavergne
 * @license   https://opensource.org/licenses/MIT  MIT
 */
(function() {

	// Create input for target hours
	$('.timesheet-header .fl-right').prepend(
		'<B>Targets:</B> '
		+ ' Month: <input type="number" id="__m_tgt" value="0" min="0" max="744" step="1">'
		+ ' Daily: <input type="number" id="__d_tgt" value="8.00" min="0" max="24" step="0.01">'
	);
	var
		monthly = $('#__m_tgt'),
		daily = $('#__d_tgt')
	;

	// Update ETA on daily input change and periodically
	var update_eta = function() {
		var
			dailyVal = Number(daily.val()),
			div      = $('.day-view-total'),
			done     = Number(div.find('span').text()),
			delta    = Math.max(0, dailyVal - done),
			eta      = new Date((new Date()).getTime() + (delta * 3600000)),
			etaTxt   = eta.getHours() + ':' + (eta.getMinutes() < 10 ? '0' : '') + eta.getMinutes()
		;
		div.html('(' + delta.toFixed(2) + 'h until ' + etaTxt + ') &nbsp; Total: <span>' + done.toFixed(2) + '</span>');
	};
	setInterval(update_eta, 2000);
	daily.on('input change', update_eta);

	// Update daily input on monthly input change
	var update_daily = function () {
		var
			monthlyVal    = Number(monthly.val()),
			now           = new Date(),
			monthDaysLeft = (new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()) - now.getDate()
		;
		daily.val(Number(monthlyVal / monthDaysLeft).toFixed(2));
		update_eta();
	};
	monthly.on('input change', update_daily);
})();
