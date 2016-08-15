(function () {
  'use strict'
  window.showproducttable = false
  var gmap = function(){
    var agence = new google.maps.LatLng(13.667091,100.401424),
    parliament = new google.maps.LatLng(13.667081,100.401424),
    image = '/images/pin.png',
    marker,
    map;

    function initialize() {
      var mapOptions = {
        zoom: 15,
        disableDefaultUI: false,
        draggable:false,
        disableDoubleClickZoom:false,
        scrollwheel:false,
        mapTypeControl:false,
        streetViewControl:false,
        zoomControl: true,
        panControl: true,
        zoomControlOptions: {
            style:google.maps.ZoomControlStyle.SMALL
        },


        mapTypeId: google.maps.MapTypeId.ROADMAP,

        styles: [
    {
      "stylers": [
        { "saturation": -100 }
      ]
    },{
      "featureType": "poi",
      "stylers": [
        { "visibility": "on" }
      ]
    },{
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        { "visibility": "on" },
        { "lightness": 100 }
      ]
    },{
      "elementType": "labels.text.stroke",
      "stylers": [
        { "lightness": 100 }
      ]
    },{
      "featureType": "transit",
      "stylers": [
        { "visibility": "on" },
        { "gamma": 0.01 }
      ]
    },{
      "featureType": "water",
      "stylers": [
        { "visibility": "off" }
      ]
    },{
      "elementType": "labels.icon",
      "stylers": [
        { "visibility": "off" }
      ]
    },{
      "featureType": "road.arterial",
      "elementType": "geometry.stroke",
      "stylers": [
        { "lightness": -23 }
      ]
    },{
      "featureType": "poi",
      "stylers": [
        { "visibility": "simplified" },
        { "lightness": 57 }
      ]
    },{
      "elementType": "geometry.stroke",
      "stylers": [
        { "lightness": 44 },
        { "visibility": "simplified" }
      ]
    },{
      "featureType": "road.local",
      "elementType": "geometry.fill",
      "stylers": [
        { "lightness": 100 }
      ]
    },{
      "featureType": "transit.station",
      "stylers": [
        { "visibility": "on" },
        { "gamma": 9.91 }
      ]
    },{
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        { "lightness": 100 }
      ]
    },{
      "featureType": "transit.line",
      "elementType": "geometry.fill",
      "stylers": [
        { "lightness": 100 }
      ]
    },{
    }
  ],
        center: agence
      };

      map = new google.maps.Map(document.getElementById('googlemap'),
              mapOptions);
      marker = new google.maps.Marker({
        icon: image,
        map:map,
        draggable:false,
        animation: google.maps.Animation.DROP,
        position: parliament
      });
      google.maps.event.addListener(marker, 'click', toggleBounce);
    }

    function toggleBounce() {

      if (marker.getAnimation() != null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }
    google.maps.event.addDomListener(window, 'load', initialize);
        
}
  var DOMready = function () {
    $('.togglenav').click(toggleNav)
    $('.maximage').each(function() {
      var $this = $(this)
      $this.cycle({
        slideResize: true,
        containerResize: true,
        width: '100vw',
        height: '100vh',
        fit: 1,
        speed: 800,
        timeout: 5000,
        easing: 'easeOutQuint',
        fx: 'fade',
        next: $this.parent().find('.next'),
        prev: $this.parent().find('.prev'),
        pager: $this.parent().find('ul.list-inline'),
        pagerAnchorBuilder: function(idx, slide) {
          var imgsrc = $this.find('.slide:eq('+idx+')').attr('data-src')
          return '<li><a href="#" rel="nofollow"><img src="'+imgsrc+'" height="50" /></a></li>'
        },
        after: function(currSlideElement, nextSlideElement, options, forwardFlag){
          $this.show()
        }
      })
    })

    $('.toggle-product-preform').click(function () {
      $('.product-preform-list').slideToggle('fast')
    })
    $('.toggle-product-instant').click(function () {
      $('.product-instant-list').slideToggle('fast')
    })
    $('.toggle-product-other').click(function () {
      $('.product-other-list').slideToggle('fast')
    })
    $('.product-preform-list, .product-instant-list, .product-other-list').hide()
    $('.fancybox').fancybox({
      padding: 0,
      closeBtn: false,
      helpers: {
        title: {
          type: 'inside'
        },
        overlay: {
          css: {
            'background': 'rgba(0,0,0,.8)'
          }
        }
      }
    })
    gmap()
    $('.globalnav a').click(function () {
      var section = $(this).attr('href').replace('/#','')
      scrollToAnchor(section)
      $('body').removeClass('activenav')
      return false
    })
    var scrollToAnchor = function (aid) {
      var aTag = $("[id='"+ aid +"']")
      $('html,body').animate({scrollTop: aTag.offset().top},'slow')
    }
    $('video').click(function () {
      $(this).play()
      document.servicevideo.play()
    })
  }
  var toggleNav = function () {
    $('body').toggleClass('activenav')
  }
  $(document).ready(DOMready)
})()