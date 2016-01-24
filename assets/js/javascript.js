// Declare language object
var languageObject = new Object();

// Set language
languageSelected = 'da';

// Setup moment
moment.locale(languageSelected);





// Get ready, set, go
jQuery(document).ready(function()
{

	// Setup language
	initiateLanguage();

	// Set some values
	jQuery("#incidents-header").html(language('PAST_INCIDENTS'))

	// Check if we have any posts
	if(posts !== undefined && posts !== null)
	{

		// Declare parsed posts object and Set service disruption status
		var postsParsed = {}, serviceDisruptionStatus;

		// Add the last three days
		postsParsed[parseInt(moment().subtract(0, 'days').format('YYYYMMDD'))] = [];
		postsParsed[parseInt(moment().subtract(1, 'days').format('YYYYMMDD'))] = [];
		postsParsed[parseInt(moment().subtract(2, 'days').format('YYYYMMDD'))] = [];



		// Iterate through posts
		posts.sort(compare).forEach(function(entry)
		{

			// Get date from entry
			var entryDate = moment(entry.date).format('YYYYMMDD');

			// Check if the entries date are already populated in the parsed object
			if(postsParsed[entryDate] !== undefined)
			{
				// Add the entry in the parsed object
				postsParsed[entryDate].push(entry);

				// Set disruption status
				if(serviceDisruptionStatus === undefined)
					serviceDisruptionStatus = entry.status;
			}

		});



		// Set banner accordingly
		if(serviceDisruptionStatus == 1 || serviceDisruptionStatus == undefined)
		{
			jQuery("#banner").attr("class", "alert alert-success");
			jQuery("#banner .row:last div:first").html("<i class=\"fa fa-4x fa-check-circle text-success\"></i>");
			jQuery("#banner .row:last div:last h4").html(language("ALL_SERVICES_OPERATIONAL"));
			jQuery("#banner .row:last div:last span").html(language("ALL_SERVICES_OPERATIONAL_TEXT"));
		} else if(serviceDisruptionStatus == 2) {
			jQuery("#banner").attr("class", "alert alert-warning");
			jQuery("#banner .row:last div:first").html("<i class=\"fa fa-4x fa-exclamation-circle text-warning\"></i>");
			jQuery("#banner .row:last div:last h4").html(language("TEMPORARY_SERVICE_DISRUPTION"));
			jQuery("#banner .row:last div:last span").html(language("TEMPORARY_SERVICE_DISRUPTION_TEXT"));
		} else if(serviceDisruptionStatus == 3) {
			jQuery("#banner").attr("class", "alert alert-danger");
			jQuery("#banner .row:last div:first").html("<i class=\"fa fa-4x fa-times-circle text-danger\"></i>");
			jQuery("#banner .row:last div:last h4").html(language("SERVICES_DOWN"));
			jQuery("#banner .row:last div:last span").html(language("SERVICES_DOWN_TEXT"));
		}



		// Check if posts has been parsed and that there are something to report on
		if(postsParsed !== undefined && postsParsed !== null)
		{
			// Iterate through posts
			for (var key in postsParsed)
			{
				if (postsParsed.hasOwnProperty(key))
				{

					// Add date header
					jQuery("#incidents div:first").prepend('<div class="col-sm-12 p-t-1 p-b-1" datekey="' + key + '">\
							<h5>' + capitaliseFirstLetter(moment(key).format('dddd D. MMMM YYYY')) + '</h5>\
							<br>\
							<div class="timeline">\
								<div class="row"></div>\
							</div>\
						</div>');

					if(postsParsed[key].length > 0)
					{
						postsParsed[key].sort(compare).forEach(function(entry)
						{

							jQuery("#incidents [datekey='" + key + "'] div.timeline").append('<div class="moment first">\
									<div class="row event">\
										<div class="p-l-1">\
											<div class="status-icon">\
												<i class="fa fa-1x ' + statusIcon(entry.status) + '"></i>\
											</div>\
										</div>\
										<div class="col-xs-11 col-xs-offset-1 incident-details">\
											<div class="card">\
												<div class="card-block">\
													<h6 class="card-title"><span class="label label-default">' + entry.services.map(language).join(', ') + '</span> ' + entry.title + '</h6>\
													<p class="text-muted">' + capitaliseFirstLetter(moment(entry.date).fromNow()) + '</p>\
													<p class="card-text">' + entry.content + '</p>\
												</div>\
											</div>\
										</div>\
									</div>\
								</div>');

						});

					} else {

						jQuery("#incidents [datekey='" + key + "'] div.timeline").html('<div class="row">\
								<div class="col-xs-12">\
									<div class="card">\
										<div class="card-block">\
											<p class="card-text">' + language('NOTHING_TO_REPORT') + '</p>\
										</div>\
									</div>\
								</div>\
							</div>');

					}

				}
			}
		}

	}

});





function initiateLanguage()
{
	if(languageObject !== undefined)
	{
		languageObject.ALL_SERVICES_OPERATIONAL =
		{
			en: "All services operational",
			da: "Alle services kører"
		};

		languageObject.ALL_SERVICES_OPERATIONAL_TEXT =
		{
			en: "If you are experiencing any issues please open a support ticket.",
			da: "Skulle du opleve problemer, så er du velkommen til at sende en besked."
		};



		languageObject.TEMPORARY_SERVICE_DISRUPTION =
		{
			en: "Temporary service disruption",
			da: "Midlertidig service afbrydelse"
		};

		languageObject.TEMPORARY_SERVICE_DISRUPTION_TEXT =
		{
			en: "Some services experience temporary service disruption at the moment.",
			da: "Visse services oplever i øjeblikket et midlertidigt problem."
		};



		languageObject.SERVICES_DOWN =
		{
			en: "Services down",
			da: "Services nede"
		};

		languageObject.SERVICES_DOWN_TEXT =
		{
			en: "One or more of our services experience downtime at the moment. We are notified about the problem and are working hard to resolve it.",
			da: "En eller flere af vore services oplever i øjeblikket nedetid. Vi er notificeret omkring problemet, og arbejder hårdt for at genoprette servicen."
		};



		languageObject.PAST_INCIDENTS =
		{
			en: "Past incidents",
			da: "Tidligere hændelser"
		};

		languageObject.NOTHING_TO_REPORT =
		{
			en: "Nothing to report",
			da: "Intet at rapportere"
		};
	}
}

function language(key)
{
	if(languageObject[key] !== undefined && languageObject[key][languageSelected] !== undefined)
		return languageObject[key][languageSelected];

	if(services[key] !== undefined && services[key][languageSelected] !== undefined)
		return services[key][languageSelected];
}





function compare(a, b)
{
	if (a.date > b.date)
		return -1;
	else if (a.date < b.date)
		return 1;
	else
		return 0;
}

function statusIcon(status)
{
	var icon;

	// Set status icon
	if(status == 1)
		icon = 'fa-check text-success';

	if(status == 2)
		icon = 'fa-exclamation text-warning';

	if(status == 3)
		icon = 'fa-times text-danger';

	return icon;
}





function capitaliseFirstLetter(string)
{
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function nl2br(str)
{
	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
}