/* Author:

*/
var xmlActionsURL = '/vui/vui-xml-actions/';

var ACTION_GET_IMAGES_FOR_SERVICE = "si";
var ACTION_GET_SERVICE_LIST_BY_NAME = "sn";
var ACTION_GET_SERVICE_LIST_BY_PLATFORM = "sp";
var ACTION_GET_SERVICE_LIST_BY_NAME_AND_PLATFORM = "snp";
var ACTION_GET_ALL_SERVICE_LIST = "sa";
var ACTION_RATE_SERVICE = "rs";
var ACTION_FAVOURITE_IMAGE = "fi";
var ACTION_UNFAVOURITE_IMAGE = "ufi";

var RESPONSE_SUCCESS = "Success";

var TITLE_ALL_SERVICES = "All Services";
var TITLE_PLATFORM = "#platform#";
var TITLE_PLATFORM_SERVICE = '<a href="#" class="ui-link-platform">#platform#</a> | #service#';
var TITLE_PLATFORM_DEVICE_SERVICE = '<a href="#" class="ui-link-platform">#platform#</a> | <a href="#" class="ui-link-service">#service#</a> | #device#';
var TITLE_SERVICE = "#service#";
var TITLE_IMAGE = "#service# | #device# {#pagetype}";
var TITLE_FAVOURITE = "This is one of your favourite images";
var TITLE_RATING = "rated #n#/10 by #m# users";

var RESIZE_FIX = 0;
var RESIZE_SCROLLBARCORRECTION = 45;
var LEFT_NAV_SCROLL_CORRECT = 3;
var BORDER_CORRECT = 30;

var sizeOfStar = 15;
var starOriginalOffset = -150;
var starVerticalOffset = -45;

var headingHeightSmall = 40;
var headingHeightLarge = 95;

var UIROOT = 'vui/ui';
var currentDataRating = '0.0';

var BaseTitle = "";

$(function () 
{
	 BaseTitle = document.title;

	$(".ui-member-message").show(800);
	 
    $("img.lazy").lazyload();

    $(".ui-grid div.scroll-up").click(function () {
        $(".ui-grid").animate({ "scrollTop": "-=250px" }, 500);
    });
    $(".ui-grid div.scroll-down").click(function () {
        $(".ui-grid").animate({ "scrollTop": "+=250px" }, 500);
    });

    $("#main-ui-grid").scroll(function () {
        $("#main-ui-grid").trigger("resize");
    });

    // $(".ui-list a").lightBox(); // Select all links that contains lightbox in the attribute rel

    $("#main-ui-grid ul li a").on("click", function (event) {
        imageLinkOnClick(event, this);
    });

    // When clicking on a Platform link on the left
    $("nav a.vui-platform").on("click", function (event) 
	{
		var loc = window.location.href;		
		if(loc.indexOf(UIROOT) < 0)
		{
			var REserver = /http:\/\/[A-z0-9\.\-:]+\//;
			var server = REserver.exec(loc);
			window.location = server + UIROOT + "#" + $(this).attr("data-platform");
			return;
		}
        shuffleBlindsPlatformClick(event, this);
    });

	$("nav.right a.ui-function-link").on("click", function (event) {
		event.preventDefault();
		shuffleBlinds(this, 'right');
	});
	
	
    // Clicking on a service link on the left
    $("nav a.vui-service").on("click", function (event) {
        serviceLinkOnClick(event, this);
    });

    $("a.ui-close-to-grid").on("click", function (event) {
        event.preventDefault();
        $("#main-ui-item").removeClass("ui-item-view");
        $("#main-ui-item").empty();
        toggleGridCarousel("grid");
    });

    $("nav.left ul li ul").hover(
        function () {
            var bottom = $(this).children().last().position().top - LEFT_NAV_SCROLL_CORRECT;
            var scrollBottom = $(this).scrollTop() + $(this).height();
            var height = $(this).height();

            // console.log("scrollBottom: " + scrollBottom + " bottom: " + bottom);
            if (bottom < height) {
                showNavArrow(this, "down");
            }
            if ($(this).scrollTop() > 0) {
                showNavArrow(this, "up");
            }
        },
        function () {
            hideNavArrows(this);
        }
    );

    $(document).ajaxStop(function () {
        $("img.lazy").lazyload();
        setTimeout(function () {
            $("#main-ui-grid").trigger("resize");
        }, 100);
    });
	
	loadUI();
	loadHomeElements();
    stretchScreen();
	
	// New Top-Nav Stuff
	$("nav.top ul li").hover(
		function() {
			$(this).find("ul.ui-nav-level-1").show(300);
		},
		function() {
			$(this).find("ul.ui-nav-level-1").hide(300);
		}
	);
	$("nav.top ul li ul.ui-nav-level-1 li").hover(
		function() {
			$(this).addClass("ui-hover-on");
			$(this).find("ul").show(300);
		},
		function() {		
			$(this).removeClass("ui-hover-on");
			$(this).find("ul").hide(300);
		}
	);
	$("nav.top ul li ul li").click(function() {
		$(this).mouseout();
	});
	
});


function loadHomeElements()
{
	if($("#home-bubble-templates").length > 0)
	{
		var bubble1 = $("#home-bubble-templates #ui-bubble-howto").clone();
		$(bubble1).addClass("ui-bubble-howto");
		$("body").prepend(bubble1.wrap("<p>").parent().html());
		$(".ui-bubble-howto").delay(800).fadeIn("800");
	}
}

function loadUI()
{
	console.log("Loading UI for " + window.location.hash);
	var loc = window.location.href;		
	if(loc.indexOf(UIROOT) < 0)
	{
		shuffleBlinds($(".left ul").find("a[data-platform='All']"), 'left');
	}
	else if (window.location.hash != '') 
	{
        var hash = window.location.hash.replace('#', '');
		var uidefaults = hash.split("|");
		
		var platform = "";
		var service = "";
		
		// Service and Platform
		if(uidefaults.length > 1)
		{
			platform = uidefaults[0];
			service  = uidefaults[1];
			
			var li = $("nav ul").find("a[data-platform='" + platform + "']");
			if(li.length > 0)
			{
				var platformli = li[0];
				
			    var platformid = $(platformli).attr("data-id");
				var platformname =  $(platformli).html();
				
				$(".ui-heading").attr("data-platform", platformname);
				$(".ui-heading").attr("data-platformid", platformid);
				
				shuffleBlinds(platformli, 'left');
				//console.log($(platformli).html());
				$(platformli).parent().find("a[data-id='" + service + "']").trigger("click");
			}
		}
		// Platform only
		else if (uidefaults.length == 1)
		{
			console.log("Showing platform");
			platform = uidefaults[0];
			$("nav ul").find("a[data-platform='" + platform + "']").trigger("click");
		}
    }
	else
	{
		$("nav ul").find("a[data-id='All']").trigger("click");
	}
}


function showNavArrow(list, mode) {
    
}


function hideNavArrows(list, mode) {
    
}

function navArrowClick(event, selectedItem, direction) {
    
}


function shuffleBlinds(selectedItem, group)
{
    // Tidy up the left nav
    $(selectedItem).parent().addClass("ui-clicked");
    $("nav." + group + " ul li:not(.ui-clicked) ul").slideUp(500, function () {
        $(selectedItem).parent().children("ul").slideDown(500);
        $(selectedItem).parent().removeClass("ui-clicked");
    });
}

function shuffleBlindsPlatformClick(event, selectedItem) 
{
	shuffleBlinds(selectedItem, 'left');
    platformLinkOnClick(event, selectedItem);
}

// Show ALL services grouped by name, for a platform
function platformLinkOnClick(event, selectedItem) 
{
	
    // Change Main Column to grid view.
    $("#main-ui-item").removeClass("ui-item-view");
    $("#main-ui-item").empty();
    toggleGridCarousel("grid");

    var platformid = $(selectedItem).attr("data-id");
    var platformname =  $(selectedItem).html();
    var action = "";
    var DataObject = {};
    var title = "";

	
	window.location.hash = platformname;
	
	
    if (platformid == "All") {
        // Get all platforms list into grid
        action = ACTION_GET_ALL_SERVICE_LIST;
        title = TITLE_ALL_SERVICES;
		document.title = BaseTitle + " | All Services";

    }
    else {
        action = ACTION_GET_SERVICE_LIST_BY_PLATFORM;
        title = TITLE_PLATFORM.replace("#platform#", platformname);
		document.title = BaseTitle + " | " + platformname;
        DataObject = { "platformid": platformid }
    }

    $.ajax({
        url: xmlActionsURL + "?a=" + action,
        type: "POST",
        dataType: 'json',
        data: DataObject,
        success: function (data) {
            // Draw into a grid

            var output = [];
            $.each(data, function (index, service) {
                var servicehtml = $("#ui-templates .ui-service-template").clone();

                if (service.disabled == "yes") {
                    servicehtml
                            .removeClass("ui-service-template")
                            .addClass("ui-preview-disabled")
                    .find("h2")
                            .html(service.service).end()
                            .find(".ui-image-box")
                            .find("a")
                                .end()
                            .find("img")
                                .attr("data-original", service.img_th).end();
                }
                else {

                    servicehtml
                            .removeClass("ui-service-template")
                            .find("h2")
                                .html(service.service + ' (' + service.numimages + ')').end()
                            .find("a")
                                .attr("href", "#")
                                .attr("data-id", service.service)
                                .attr("data-platformid", platformid)
                                .end()
                            .find("img")
                                .attr("data-id", service.id)
                                .attr("data-original", service.img_th).end();
                }
                output.push(servicehtml.wrap("<p>").parent().html());
            });

			$(".ui-heading").animate( { height: headingHeightSmall+'px' }, 200, function() {
			
				$(".ui-heading").attr("data-platform", platformname);
				$(".ui-heading").attr("data-platformid", platformid);
				$(".ui-heading h1").html(title);
				
				$(".ui-heading .ui-service-info")
					.find(".ui-service-info-desc").html("").end()
					.find(".ui-service-info-region").html("").end()
					.find(".ui-service-info-type").html("").end()
					.hide();	
					
				$(".ui-heading .ui-rating").removeClass("ui-visible");

			});
			
			
            $("#main-ui-grid .ui-list").empty();
            $("#main-ui-grid .ui-list").append(output.join(''));

            $("#main-ui-grid ul li a").on("click", function (event) {
                serviceLinkOnClick(event, this);
            });
        }
    });
}

// Show ALL services/device combinations for a service
function serviceLinkOnClick(event, selectedItem) 
{

    var platformid = $(selectedItem).attr("data-platformid");
    var serviceid = $(selectedItem).attr("data-id");

    var action = "";
    var DataObject = {};

    if (platformid == "All") {
        // Get all platforms list into grid
        action = ACTION_GET_SERVICE_LIST_BY_NAME;
        DataObject = {  "service": serviceid }
		
    }
    else {
        action = ACTION_GET_SERVICE_LIST_BY_NAME_AND_PLATFORM;
        DataObject = { "service": serviceid,
                        "platformid": platformid
        }
    }

	
    // Change Main Column to grid view.
    $("#main-ui-item").removeClass("ui-item-view");
    $("#main-ui-item").empty();
    toggleGridCarousel("grid");


    $.ajax({
        url: xmlActionsURL + "?a=" + action,
        type: "POST",
        dataType: 'json',
        data: DataObject,
        success: function (data) {
            // Draw into a grid

            var output = [];
            $.each(data, function (index, service) {
                var servicehtml = $("#ui-templates .ui-service-template").clone();
                servicehtml
                            .removeClass("ui-service-template")
                            .find("h2")
                                .html(service.service + " | " + service.device  + ' (' + service.numimages + ')').end()
							.find(".ui-service-score")
								.html("VUI Functions: " + service.vuiscore + "/" + $("#ui-num-functions").val()).end()
                            .find("a")
                                .attr("href", "#")
                                .attr("data-id", service.id)
                                .attr("data-device", service.device)
                                .attr("data-service", service.service)
                                .end()
                            .find("img")
                                .attr("data-id", service.id)
                                .attr("data-original", service.img_th).end();

                output.push(servicehtml.wrap("<p>").parent().html());
            });


            var platformname = $(".ui-heading").attr("data-platform");

            if (platformname == undefined || platformname == null) {
                platformname = platformid;
                $(".ui-heading").attr("data-platform", platformname);
            }
			
			
			window.location.hash = platformname + '|' + serviceid;
	
			document.title = BaseTitle + " | " + serviceid + " | " + platformname;

			$(".ui-heading .ui-service-info")
					.find(".ui-service-info-desc").html("").end()
					.find(".ui-service-info-region").html("").end()
					.find(".ui-service-info-type").html("").end()
					.hide();
			
            if (platformname == "All") {
                platformname = TITLE_ALL_SERVICES;
            }
            var title = TITLE_PLATFORM_SERVICE.replace("#platform#", platformname).replace("#service#", serviceid);
			$(".ui-heading").animate( { height: headingHeightSmall+'px' }, 200, function() {
				$(".ui-heading h1").empty().append(title);
				$(".ui-heading").attr("data-service", serviceid);
				$(".ui-heading h1 a.ui-link-platform").attr("data-id", $(".ui-heading").attr("data-platformid"))
				$(".ui-heading .ui-rating").removeClass("ui-visible");
				
				
				$("a.ui-link-platform").on("click", function (event) {
					platformLinkOnClick(event, this);
				});
				
			});

			
            $("#main-ui-grid .ui-list").empty();
            $("#main-ui-grid .ui-list").append(output.join(''));


            $("#main-ui-grid ul li a").on("click", function (event) {
                serviceDeviceLinkOnClick(event, this);
            });
        }
    });
}

// Show the Images for a service / device
function serviceDeviceLinkOnClick(event, selectedItem) 
{
    if ($(location).attr('href').toLowerCase().indexOf("/ui") > 0) {
        event.preventDefault();
        // IF the URL doesn't contain /ui then redirect there.


        var serviceid = $(selectedItem).attr("data-id");
        var DataObject = { "service": serviceid };
        $.ajax({
            url: xmlActionsURL + "?a=" + ACTION_GET_IMAGES_FOR_SERVICE,
            type: "POST",
            dataType: 'json',
            data: DataObject,
            success: function (servicedata) {
                var output = [];

                populateRatingData(servicedata);

                var data = servicedata.images;
				
				var counter = 0;
				var totalcount = data.length;
				
                $.each(data, function (index, image) {
				
					counter++;
				
                    var imagehtml = $("#ui-templates .ui-image-template").clone();
					
					
					
                    imagehtml
						.removeClass("ui-image-template")
						.find("a.ui-lb")
							.attr("href", "#ui-lightbox-" + image.id)
							.attr("rel", "fancybox-group")
							.addClass("ui-lightbox") 
							.removeClass("ui-lb") 
							.end()
						.find("img")
							.attr("data-id", image.id)
							.attr("data-isfavourite", image.isFavourite)
							.attr("data-original", image.img_th)
							.attr("data-platform", image.platform)
							.attr("data-device", image.device)
							.attr("data-service", image.service)
							.attr("data-pagetype", image.pagetype)
							.end()
						.find("div.ui-lightbox-view")
							.attr("id", "ui-lightbox-" + image.id)
							.find("img")
								.attr("src",image.img_full)
								.end()
							.find(".ui-favourite-link")
								.attr("data-id",image.id)
								.end()
							.end()
						.find("div.ui-image-pagetype")
							.html(image.pagetype)
							.end()
						.find("div.ui-image-info")							
							.attr("data-id",image.id)
							.end()
						;
				
					var imageTitle = imagehtml.find("div.ui-lightbox-view h1").html();
					imagehtml
						.find("div.ui-lightbox-view")
  						  .find("h1")
							.html(
								imageTitle
									.replace("#service#",image.service)
									.replace("#device#",image.device)
									.replace("#date#",image.vuidate)
									.replace("#n#",counter)
									.replace("#nn#",totalcount)
							)
							.end()
						  .find("h2")
						    .html(image.pagetype)
						    .end()
				
					if(image.isFavourite == "True") {
						imagehtml
							.find("div.ui-image-info")
								.addClass("ui-favourite")
								.attr("title",TITLE_FAVOURITE)
							.end()
							.find(".ui-favourite-link")
								.addClass("ui-favourite")
								.attr("title",TITLE_FAVOURITE)
							;
					}
                    output.push(imagehtml.wrap("<p>").parent().html());
                });

                // window.location.hash = serviceid;

                var platformid = $(".ui-heading").attr("data-platformid");
                var platformname = $(".ui-heading").attr("data-platform");
                var devicename = $(selectedItem).attr("data-device");
                var servicename = $(selectedItem).attr("data-service");
                if (platformname == "All") {
                    platformname = TITLE_ALL_SERVICES;
                }
                var title = TITLE_PLATFORM_DEVICE_SERVICE.replace("#platform#", platformname).replace("#service#", servicename).replace("#device#", devicename);
				
				document.title = BaseTitle + " | " + servicename + " | " + devicename;
				
				$(".ui-heading").animate( { height: headingHeightLarge+'px' }, 200, function() {
					$(".ui-heading h1").empty().append(title);
					$(".ui-heading h1 a.ui-link-platform").attr("data-id", platformid)
					$(".ui-heading h1 a.ui-link-service").attr("data-id", $(".ui-heading").attr("data-service")).attr("data-platformid", platformid);
					$(".ui-heading .ui-rating").addClass("ui-visible");
					
					
					$(".ui-heading .ui-service-info")
						.find(".ui-service-info-desc").html(servicedata.description).end()
						.find(".ui-service-info-region").html("<em>" + servicedata.region + "</em>").end()
						.find(".ui-service-info-type").html("<em>" + servicedata.types.split(',').join(', ') + "</em>").end()
						.find(".ui-service-info-cat").html("<em>" + servicedata.cats.split(',').join(', ') + "</em>").end()
						.find(".ui-service-info-score").html("VUI Functions: <em>" + servicedata.vuiscore + "/" +  $("#ui-num-functions").val() + "</em>").end()
						.show();
						
						
					$("a.ui-link-platform").on("click", function (event) {
						platformLinkOnClick(event, this);
					});

					$("a.ui-link-service").on("click", function (event) {
						serviceLinkOnClick(event, this);
					});
					
					$(".ui-item-rate a").on("mousemove", function(event) {
						rateItStarsHover(event, this);
					});
					
					$(".ui-item-rate a").on("mouseout", function(event) {
						var yoffset = 0
						if(currentDataRating == '0.0')
						{
							yoffset = starVerticalOffset;
							$(this).parent().find("span").html('');
							$(this).css("background-position",(starOriginalOffset)+'px ' + yoffset + 'px');
						}
						else
						{
							$(this).parent().find("span").html(Math.floor(currentDataRating) + '/10');
							$(this).css("background-position",(starOriginalOffset+(Math.floor(currentDataRating)*sizeOfStar))+'px ' + yoffset + 'px');
						}
					});
					$(".ui-item-rate a").on("click", function (event) {
						rateServiceClick(event, this);
					});
				});
				
                $("#main-ui-grid .ui-list").empty();
                $("#main-ui-grid .ui-list").append(output.join(''));

                $("#main-ui-grid ul li a").on("click", function (event) {
                    imageLinkOnClick2(event, this);
                });

				$("a.ui-favourite-link:not(.ui-favourite)").off("click");
				$("a.ui-favourite-link:not(.ui-favourite)").on("click", function(event) {					
					event.preventDefault();
					event.stopPropagation();
					event.stopImmediatePropagation();
					imageFavouriteClick(event, this);
				});
				
            }
        });
    }
}

function rateItStarsHover(event, selectedItem)
{
	var yoffset = 0
	if(currentDataRating == '0.0')
	{
		yoffset = starVerticalOffset;
	}
	var x = event.pageX - $(selectedItem).offset().left;
	var numStars = Math.floor(x/sizeOfStar)+1;
	$(selectedItem).css("background-position",(starOriginalOffset+(numStars*sizeOfStar))+'px ' + yoffset + 'px');
	$(selectedItem).parent().find("span").html(numStars + '/10')
}


function rateServiceClick(event, selectedItem) 
{
    var x = event.pageX - $(selectedItem).offset().left;
    var rating = Math.floor(x/sizeOfStar)+1;
	
    // var rating = $("#service-rating").val();
    var serviceid = $(selectedItem).parent().attr("data-serviceid");
    var DataObject = { "rating": rating, "serviceid": serviceid };
    $.ajax({
        url: xmlActionsURL + "?a=" + ACTION_RATE_SERVICE,
        type: "POST",
        dataType: 'json',
        data: DataObject,
        success: function (data) {
            if (data.response == RESPONSE_SUCCESS) {
                populateRatingData(data.servicedata);
            }
        }
    });
}


function imageFavouriteClick(event, selectedItem)
{
/*	$.each($(selectedItem).data('events'), function(i, e) {
		console.log(i, e);
	});
*/
	var id = $(selectedItem).attr("data-id");
	var DataObject = { "imageid": id, "action": "ADD" };
	$.ajax({
		url: xmlActionsURL + "?a=" + ACTION_FAVOURITE_IMAGE,
		type: "POST",
		dataType: "json",
		data: DataObject,
		success: function(data) {
			if (data.response == RESPONSE_SUCCESS) {
				$(selectedItem).addClass("ui-favourite");				
				$(".ui-image-info[data-id=" + id + "]")
					.addClass("ui-favourite").attr("title",TITLE_FAVOURITE);
            }
		}
	});
	return false;
}


function populateRatingData(servicedata) {
    $(".ui-heading")
        .find("div.ui-item-rate")
            .attr("data-serviceid", servicedata.id)
			.attr("data-rating", servicedata.ratingPersonal)
			.end()
        .find("div.ui-item-rating")
		    .html(servicedata.ratingOverall).end()
		.find("div.ui-item-overall-rating")
			.html(TITLE_RATING.replace("#n#", servicedata.ratingOverall).replace("#m#", servicedata.ratersOverall)).end();
			
	var yoffset =  starVerticalOffset;
	var xoffset =  starOriginalOffset;
	
	currentDataRating = servicedata.ratingPersonal
	
	if(currentDataRating != '0.0')
	{
		yoffset = 0;
		xoffset = xoffset + currentDataRating * sizeOfStar;
		$(".ui-heading")
			.find("div.ui-item-rate")
				.find("span")
					.html(Math.floor(currentDataRating) + '/10')
					.end()
	}
	else
	{
		$(".ui-heading")
			.find("div.ui-item-rate")
				.find("span")
					.html('')
					.end()
	}
	$(".ui-heading .ui-item-rate a").css("background-position", xoffset+'px ' + yoffset + 'px');
	
//            .html("Personal: " + servicedata.ratingPersonal + ", Team: " + servicedata.ratingTeam + "(" + servicedata.ratersTeam + "), Overall: " + servicedata.ratingOverall + "(" + servicedata.ratersOverall + ")").end();
}

// !Lightbox
function imageLinkOnClick2(event, selectedItem) {
    event.preventDefault();

	$(".ui-heading").addClass("ui-hide-from-print");
	$("#wrapper").addClass("ui-hide-from-print");
	
	$(".ui-lightbox").fancybox({
		fitToView	: false,
		width		: '70%',
		height		: '70%',
		autoSize	: true,
		closeClick	: false,
		arrows      : false,
		helpers     : {
			buttons	: { position: "top"}
		},
		afterClose  : function() { 
			$(".ui-heading").removeClass("ui-hide-from-print");
			$("#wrapper").removeClass("ui-hide-from-print"); 
		}
	});
	
}


function imageLinkOnClick(event, selectedItem) 
{
    event.preventDefault();
    $("#main-ui-grid ul li").removeAttr("class");
    $(selectedItem).parent().attr("class", "ui-item-selected");
    toggleGridCarousel("carousel");
    thumbClicked(selectedItem);
}


function thumbClicked(clickedLink) 
{
	$("#main-ui-grid ul li").removeAttr("class");
	$(clickedLink).parent().attr("class", "ui-item-selected");
	var imageData = {
		img_lg: $(clickedLink).attr("rel"),
		img_full: $(clickedLink).attr("href"),
		img_id: $(clickedLink).find("img").attr("data-id"),
		uiPlatform: $(clickedLink).find("img").attr("data-platform"),
		uiDevice: $(clickedLink).find("img").attr("data-device"),
		uiService: $(clickedLink).find("img").attr("data-service"),
		uiPageType: $(clickedLink).find("img").attr("data-pagetype"),
        ratingPersonal: $(clickedLink).find("img").attr("data-ratingpersonal"),
        ratersPersonal: $(clickedLink).find("img").attr("data-raterspersonal"),
        ratingTeam: $(clickedLink).find("img").attr("data-ratingteam"),
        ratersTeam: $(clickedLink).find("img").attr("data-ratersteam"),
        ratingOverall: $(clickedLink).find("img").attr("data-ratingoverall"),
        ratersOverall: $(clickedLink).find("img").attr("data-ratersoverall")
	};
	openClickedImage(imageData);
}

function toggleGridCarousel(typeToShow)
{
	console.log(typeToShow);
	var currentClass = $("#main-ui-grid-wrapper").attr("class");
	if (typeToShow == "carousel" && currentClass.indexOf("carousel") == -1) 
    {
		$("#main-ui-grid ul").fadeOut(200, function() {
			$("#main-ui-grid-wrapper").attr("class","ui-carousel");
			var listCount = $("ul.ui-list li").size();
			var w = $("ul.ui-list li").first().width();
			$("#main-ui-grid ul").width(listCount * w);
			$("#main-ui-grid ul").fadeIn(200, function() {
				listItemIsScrolledIntoView()
			});
		});
		$("#main-ui-grid-wrapper div.scroll-up").on("click", function(){
			$("#main-ui-grid").animate({"scrollLeft": "-=250px"}, 500);
		});
		$("#main-ui-grid-wrapper div.scroll-down").on("click", function(){
			$("#main-ui-grid").animate({"scrollLeft": "+=250px"}, 500);
        });
        $(".ui-heading .ui-rating").removeClass("ui-visible");
        $(".ui-heading .ui-favourite").addClass("ui-visible");
        $(".ui-heading .ui-close-to-grid").addClass("ui-visible");
	}
	
	if(typeToShow == "grid" && currentClass.indexOf("grid") == -1) {
		$("#main-ui-grid ul").fadeOut(200, function() {
			$("#main-ui-grid-wrapper").attr("class","ui-grid");
			$("#main-ui-grid ul").removeAttr("style");
			$("#main-ui-grid ul").fadeIn(200, function() {
				listItemIsScrolledIntoView();
			});			
		});
		$("#main-ui-grid-wrapper div.scroll-up").on("click", function(){
			$("#main-ui-grid").animate({"scrollTop": "-=250px"}, 500);
		});
		$("#main-ui-grid-wrapper div.scroll-down").on("click", function(){
			$("#main-ui-grid").animate({"scrollTop": "+=250px"}, 500);
		});
        $(".ui-heading .ui-rating").addClass("ui-visible");
        $(".ui-heading .ui-favourite").removeClass("ui-visible");
        $(".ui-heading .ui-close-to-grid").removeClass("ui-visible");
	}
}


function listItemIsScrolledIntoView()
{
	var animationSpeed = 200;
	var item = $("li.ui-item-selected");
	var currentClass = $("#main-ui-grid-wrapper").attr("class");

	if(currentClass.indexOf("carousel") != -1) {
		var carouselLeftEdge = $("#main-ui-grid").scrollLeft();
		console.log("Left edge:" + carouselLeftEdge);
		
		var carouselRightEdge = $("#main-ui-grid").width();
		console.log("Right edge:" + carouselRightEdge);

		if ($(item).position() != null) {
		    var itemLeft = $(item).position().left;
		    var itemRight = $(item).width() + itemLeft;
		    console.log("Item Left:" + itemLeft + " right: " + itemRight);
		    if (itemRight >= carouselRightEdge) {
		        if (itemRight - carouselRightEdge > carouselRightEdge / 2) animationSpeed = 600;
		        $("#main-ui-grid").animate({ "scrollLeft": "+=" + (itemRight - carouselRightEdge) + "px" }, animationSpeed);
		    }
		    if (itemLeft < 0) {
		        $("#main-ui-grid").animate({ "scrollLeft": "-=" + (-itemLeft) + "px" }, animationSpeed);
		    }
		}
    }

	if(currentClass.indexOf("grid") != -1) {
		var gridTopEdge = $("#main-ui-grid").scrollTop();
		console.log("Top edge:" + gridTopEdge);
		
		var gridBottomEdge = $("#main-ui-grid").height();
		console.log("Bottom edge:" + gridBottomEdge);

		if ($(item).position() != null) {
		    var itemTop = $(item).position().top;
		    var itemBottom = $(item).height() + 25 + itemTop;
		    console.log("Item Top:" + itemTop + " bottom: " + itemBottom);
		    if (itemBottom >= gridBottomEdge) {
		        if (itemBottom - gridBottomEdge > gridBottomEdge / 2) animationSpeed = 600;
		        $("#main-ui-grid").animate({ "scrollTop": "+=" + (itemBottom - gridBottomEdge) + "px" }, animationSpeed);
		    }
		    if (itemTop < 0) {
		        $("#main-ui-grid").animate({ "scrollLeft": "-=" + (-itemTop) + "px" }, animationSpeed);
		    }
		}
	}
}



function openClickedImage(imageData) {
	var imageDivConts = $("#ui-templates .main-ui-image-template").clone();

	imageDivConts
		.find("a.lightbox").attr("href", imageData.img_full).end()
		.find("a.lightbox img").attr("src", imageData.img_lg).end()
        .find("div.ui-item-rate").attr("data-imageid", imageData.img_id).end()
        .find("div.ui-item-rating").html("Personal: " + imageData.ratingPersonal + ", Team: " + imageData.ratingTeam + "(" + imageData.ratersTeam + "), Overall: " + imageData.ratingOverall + "(" + imageData.ratersOverall + ")").end();
	
	var nextLi = $("li.ui-item-selected").next();
	if(nextLi.length == 0) {
		imageDivConts.find("a.ui-item-next").hide();
	}
	else {
		imageDivConts.find("a.ui-item-next").show();
	}
	var prevLi = $("li.ui-item-selected").prev();
	if(prevLi.length == 0) {
		imageDivConts.find("a.ui-item-prev").hide();
	}
	else {
		imageDivConts.find("a.ui-item-prev").show();
	}

    $("#main-ui-item").scrollTop(0);

	$("#main-ui-item").fadeOut(200, function () {
	    $("#main-ui-item").empty();
	    $("#main-ui-item").append(imageDivConts.html());
	    $("#main-ui-item").addClass("ui-item-view");
	    $("#main-ui-item a.lightbox").lightBox();


	    $("#main-ui-item").fadeIn(200, function () {
	        var nextLi2 = $("li.ui-item-selected").next();
	        var prevLi2 = $("li.ui-item-selected").prev();

	        listItemIsScrolledIntoView();

	        

	        $("#main-ui-item").on("mouseenter", function (event) {
	            var nextLi2 = $("li.ui-item-selected").next();
	            var prevLi2 = $("li.ui-item-selected").prev();
	            if (nextLi2.length > 0) { $(this).find("a.ui-item-next").fadeIn(200); }
	            if (prevLi2.length > 0) { $(this).find("a.ui-item-prev").fadeIn(200); }
	        });
	        $("#main-ui-item").on("mouseleave", function (event) {
	            $(this).find("a.ui-nav-btn").fadeOut(200);
	        });

	        $("#btn-rate-image").on("click", function (event) {
	            rateImageClick(event, this);
	        });

	    });


	    $("a.ui-item-next").on("click", function (event) {
	        event.preventDefault();
	        var nextLi2 = $("li.ui-item-selected").next();
	        thumbClicked($(nextLi2).find("a"));
	    });
	    $("a.ui-item-prev").on("click", function (event) {
	        event.preventDefault();
	        var prevLi2 = $("li.ui-item-selected").prev();
	        thumbClicked($(prevLi2).find("a"));
	    });
	});
}


function GetData(url, DataObject) {
    var data = $.ajax({
        url: url,
        type: "POST",
        dataType: 'json',
        data: DataObject,
        error: function (x, e) {
            if (x.status == 0) {
                alert('You are offline!!\n Please Check Your Network.');
            } else if (x.status == 404) {
                alert('Requested URL not found.');
            } else if (x.status == 500) {
                alert('Internel Server Error.');
                //		$("#OTGerror").html(x.responseText);
            } else if (e == 'parsererror') {
                alert('Error.\nParsing JSON Request failed.');
            } else if (e == 'timeout') {
                alert('Request Time out.');
            } else {
                alert('Unknown Error.\n' + x.responseText);
            }
        }, async: false

    });
    return data;
}

function stretchScreen() {

    var dheight = $('html').height();
    var wheight = $(window).height();
    
    //height first header, content, last footer
    var overTop = $('header').height();
    var cbody = $('.ui-col-container').height();
    var overBottom = $('footer').height();
    
    //correction
    var hcorrect = overTop + overBottom;
    
    // width of main-ui-grid-wrapper = screen - left - right
    var htmlwidth = $('html').width();
    var wwidth = $(window).width();

    var leftwidth = $('nav.left').width();
    var rightwidth = $('nav.right').width();
    var wcorrect = leftwidth + rightwidth + BORDER_CORRECT;
    

    var wrapperwidth = htmlwidth - leftwidth - rightwidth;
    var gridwidth = wrapperwidth + RESIZE_SCROLLBARCORRECTION;

	
	// Work out the available space for left-nav
	var navheight = 200;
	var lnavusedheight = 5;
	var rnavusedheight = 5;
	var navitemcorrection = Math.floor($("li.ui-nav-platform").css("margin-bottom").replace("px","")) + 
							Math.floor($("li.ui-nav-platform a.vui-platform").css("padding-top").replace("px","")) + 
							Math.floor($("li.ui-nav-platform a.vui-platform").css("padding-bottom").replace("px",""));

	var navitems = $("nav.left ul li.ui-nav-platform a.vui-platform");
	$.each(navitems, function (index, li) {
		lnavusedheight += $(li).height() + navitemcorrection;
	});
	navitems = $("nav.right ul li.ui-nav-function a.ui-function-link");
	$.each(navitems, function (index, li) {
		rnavusedheight += $(li).height() + navitemcorrection;
	});
    changepush();

    //add orientationchange
    $(window).bind('resize orientationchange', function () {
        wheight = $(window).height();
        wwidth = $(window).width();
        noscroll();
        changepush();
    });

    function noscroll() {
        if (wheight > dheight) {
            $('html').addClass('noscroll');
        } else if (wheight <= dheight) {
            $('html').removeClass('noscroll');
        } else { }
    }

    function changepush() {
		$("body:not(.ui-nav-top)")
			.find("#ui-col-container").css("height", wheight - hcorrect + 'px').end()
			.find("#main-ui-grid-wrapper").css("width", wwidth - wcorrect + 'px').end()
			.find(".ui-hidden-scroll-main-area").css("width", wwidth - wcorrect + RESIZE_SCROLLBARCORRECTION + 'px').end()
			.find("nav.right ul li ul").css("max-height", wheight - hcorrect - rnavusedheight + 'px').end()
			.find("nav.left ul li ul").css("max-height", wheight - hcorrect - lnavusedheight + 'px').end()
			.find(".ui-scrolling-column").css("width", wwidth - wcorrect  + 'px').end()
			.find(".bp-main-story-column").css("padding-left",(($(".main").width() - $(".bp-main-story-column").width() - 330) / 2) + 'px').end()
		;
    }
} 