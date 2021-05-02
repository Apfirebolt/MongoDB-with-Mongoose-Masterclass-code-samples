(function($) {
    "use strict"; // Start of use strict

   // Owl carousel
    
   $(".owl-carousel").owlCarousel({
        items: 1,
        loop: true,
        animateOut: 'slideOutDown',
        animateIn: 'flipInX',
        dots: true,
        navigation : true,
        autoplay: true,
  });

  $(function() {
      $('a.js-scroll-trigger').bind('click', function(event) {
          const $anchor = $(this);
          $('html, body').stop().animate({
              scrollTop: $($anchor.attr('href')).offset().top
          }, 1500, 'easeInOutExpo');
          event.preventDefault();
      });

      $('#go-to-top').bind('click', function(event) {
        $('html, body').stop().animate({
            scrollTop: "0px"
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
      });
  });
  
    // Closes responsive menu when a scroll trigger link is clicked
    $('.js-scroll-trigger').click(function() {
      $('.navbar-collapse').collapse('hide');
    });
  
    // Activate scrollspy to add active class to navbar items on scroll
    $('body').scrollspy({
      target: '#mainNav',
      offset: 56
    });
  
    // Collapse Navbar
    const navbarCollapse = function() {
      if ($("#mainNav").offset().top > 100) {
        $("#mainNav").addClass("navbar-light");
      } else {
        $("#mainNav").removeClass("navbar-light");
      }
    };

    
    $(window).scroll(function() {
      const scroll = $(window).scrollTop();
      const goToTop = $('#go-to-top');
      if (scroll > 200) {
        goToTop.fadeIn( "slow");
      } else {
        goToTop.fadeOut("slow");
      }
    })
     

    // Magnific Pop Up Initialization

    $('.image-popup-link').magnificPopup({
      type: 'image'
      // other options
    });


    // Init AOS
    AOS.init();
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);


  
  })(jQuery); // End of use strict
  