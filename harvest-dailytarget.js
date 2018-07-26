/**
 * Harvest Daily Target Hours (bookmarklet)
 *
 * Adds a number input (default: 8.00) for target daily hours.
 * Shows hours left and dynamic ETA near total.
 *
 * @package   harvest-bookmarklet-dailytarget
 * @author    Stéphane Lavergne <https://github.com/vphantom/>
 * @copyright 2018 Stéphane Lavergne
 * @license   https://opensource.org/licenses/MIT  MIT
 */
(function() {

	// Create input for target hours
	$('.timesheet-header .fl-right').prepend('Target: <input type="number" id="__daily_target" value="8.00" step="0.01" min="0.00" max="24.00" placeholder="8.00">');
	var input = $('#__daily_target');

	// Update ETA
	var update_eta = function() {
		var
			target = Number(input.val()),
			div    = $('.day-view-total'),
			done   = Number(div.find('span').text()),
			delta  = Math.max(0, target - done),
			eta    = new Date((new Date()).getTime() + (delta * 3600000)),
			etaTxt = eta.getHours() + ':' + (eta.getMinutes() < 10 ? '0' : '') + eta.getMinutes()
		;
		div.html('(' + delta.toFixed(2) + ' to ' + etaTxt + ') &nbsp; Total: <span>' + done + '</span>');
	};
	setInterval(update_eta, 2000);
	input.on('input change', update_eta);
})();
