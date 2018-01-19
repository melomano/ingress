var isRESISTANCE = function(el) {
		return el.querySelector('.nickname').getAttribute('style').includes('0088FF');
	},
	isKOREALatLng = function(el) {
		if (el.querySelectorAll('.help').length !== 1) {return false;}

		var latlng = el.querySelector('.help').href.split('pll=')[1].split(','),
			lat = +latlng[0],
			lng = +latlng[1];

		// 극동 132
		// 극서 123
		// 극남 32
		// 극북 39

		if (lat > 32 && lat < 39 && lng > 123 && lng < 132) {
			return true;
		} else {
			return false;
		}
	},
	isKorea = function(el) {
		if (el.querySelectorAll('.help').length !== 1) {return false;}

		return el.querySelector('.help').getAttribute('title').includes('Korea');
	},
	isCaptured =  function(el) {
		return el.querySelectorAll('td')[2].textContent.includes('captured');
	},
	isAllTrue = function(el) {
		return Boolean(isRESISTANCE(el) && isKOREALatLng(el) && isKorea(el) && isCaptured(el));
	};

artoo.scrape('#chatall tr', {
	player: function() {
		if (isAllTrue(this)) {
			return this.querySelector('.nickname').textContent;
		}
	},
	portal: function() {
		if (isAllTrue(this)) {
			return this.querySelector('.help').textContent;
		}	
	},
	time: function() {
		if (isAllTrue(this)) {
			return this.querySelector('time').getAttribute('title').substr(0, 19);
		}
	}
});





artoo.ajaxSniffer.after(function(req, res) {
	if (req.url === '/r/getPlexts') {
		var plexts = res.data.result,
			plextsLen = plexts.length,
			isRESISTANCE = function(v) {
				if (v === 'RESISTANCE') {
					return true;
				} else {
					return false;
				}
			},
			isKOREALat = function(v) {
				var lat = v / 1E6;

				if (lat > 32 && lat < 39) {
					return true;
				} else {
					return false;
				}
			},
			isKOREALng = function(v) {
				var lng = v / 1E6;

				if (lng > 123 && lng < 132) {
					return true;
				} else {
					return false;
				}
			},
			isKorea = function(v) {
				return v.includes('Korea');
			},
			isCaptured = function(v) {
				return v.includes('captured');
			};

		console.log(JSON.stringify(plexts));

		for (var i = 0; i < plextsLen; i++) {
			if (plexts[i][2].plext.plextType !== 'SYSTEM_BROADCAST') {continue;}
			
			var plext = plexts[i][2].plext,
				team = plext.team,
				lat = plext.markup[2][1].latE6,
				lng = plext.markup[2][1].lngE6,
				address = plext.markup[2][1].address,
				text = plext.markup[1][1].plain;
			
			console.log(plext.text);
			console.log(isRESISTANCE(team));
			console.log(isKOREALat(lat));
			console.log(isKOREALng(lng));
			console.log(isKorea(address));
			console.log(isCaptured(text));
		}
	}
});