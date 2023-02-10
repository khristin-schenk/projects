(function(window, document, $) {
    var theTimer,
        isCrownActive=false,
        isManualTime=false,
        theFills = ["fill-1","fill-2","fill-3","fill-1","fill-3"],
        crownCounter= 0,
        currentCrownState,
        currentCrownGlowState,
        theWatch = {
            init: function() {
                theWatch.setCurrentTime("set");
                theWatch.setIntervalTimer();
                theWatch.getCurrentMoonPosition();

                $("#the-crown").on("click", function() {
                    theWatch.toggleCrown();
                });

                $("#reset-link button").on("click", function() {
                    theWatch.setCurrentTime("reset");
                });

                $(".color-version").on("click", function() {
                    var theVersion = $(this).attr("rel");
                    theWatch.updateTheWatchColor(theVersion);
                    $(".color-version.active").toggleClass("active");
                    $(this).toggleClass("active");
                });

                $(".lights").on("click", function() {
                    var theType = $(this).attr("rel");
                    theWatch.updateTheLights(theType);
                    $(".lights.active").toggleClass("active");
                    $(this).toggleClass("active");
                });

                $(".moonphase").on("click", function() {
                    var theType = $(this).attr("rel");

                    $(".moonphase.active").toggleClass("active");

                    if (theType == "reset") {
                        $(".moonphase.reset").hide();
                    } else {
                        if ($(".moonphase.reset").not(":visible")) {
                            $(".moonphase.reset").show();
                        }
                    }
                    theWatch.updateTheMoonphase(theType);
                    $(this).toggleClass("active");
                });
            },

            setIntervalTimer: function() {
                if ($("#northern-lights").is(".active")) {
                    theTimer = setInterval(function() {
                        if (!isManualTime) {
                            theWatch.setCurrentTime("set");
                        } else {
                            theWatch.updateManualTime();
                        }

                    }, 60000);
                }
            },
          /**
                 * Gets and sets the current time
                 * 1 Hour = 30deg, 1 Minute = 6deg
                 */
            setCurrentTime: function(type) {
                var d = new Date();
                var hours = d.getHours();
                hours = ((hours + 11) % 12 + 1);
                var minutes = d.getMinutes();

                if (type == "set") {
                    $("#hours-hand").rotate(hours * 30 + Math.round((minutes * 0.5) * 100)/100 +"deg");
                    $("#minutes-hand").rotate(((minutes * 6) * 100)/100 +"deg");
                } else {
                    isManualTime=false;
                    $("#minutes-hand").animate({rotate: ((minutes * 6) * 100)/100 +"deg"}, 500);
                    $("#hours-hand").animate({rotate: hours * 30 + Math.round((minutes * 0.5) * 100)/100 +"deg"}, 500, function() {
                        theWatch.toggleResetButton();
                    });
                }

            },
            updateManualTime: function() {
                $("#minutes-hand").animate({rotate: "+=6deg"}, 1);
                $("#hours-hand").animate({rotate: "+=0.5deg"}, 1);
            },

            toggleCrown: function() {
                isManualTime=true;

                if (!isCrownActive) {
                    $("#the-crown").attr("class","active");
                    isCrownActive=true;
                } else {
                    if ($("#reset-link").is(":hidden")) {
                        theWatch.toggleResetButton();
                    }
                    $("#the-crown").attr("class","");
                    $(".crown-fill").each(function() {
                        currentCrownState = $(this).attr("class");
                        $(this).attr("class",currentCrownState.replace(" "+ theFills[0],"").replace(" "+ theFills[1],"").replace(" "+ theFills[2],""));
                    });
                    isCrownActive=false;
                }

                theWatch.toggleClassesByCrown();
            },
            toggleClassesByCrown: function() {
                var currentState = $("#northern-lights").attr("class");
                if (isCrownActive) {
                    $("#northern-lights").attr("class",currentState.replace("active",""));
                    $("#seconds-hand").attr("class","active paused");
                    clearInterval(theTimer);
                    theWatch.manuallySetTime();
                } else {
                    $("#northern-lights").attr("class","active" + currentState);
                    $("#seconds-hand").attr("class","active");
                    theWatch.setIntervalTimer();
                    theWatch.unbindManualSetTime();
                }
            },

            manuallySetTime: function() {
                $(window).on('DOMMouseScroll mousewheel', function (e) {
                    crownCounter++;
                    if(e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) {
                        $('#minutes-hand').stop().animate({rotate: '+=1deg'}, 1);
                        $('#hours-hand').stop().animate({rotate: '+=0.084deg'}, 1);
                    } else {
                        $('#minutes-hand').stop().animate({rotate: '-=1deg'}, 1);
                        $('#hours-hand').stop().animate({rotate: '-=0.084deg'}, 1);
                    }

                    if (crownCounter == 20) {
                        theWatch.rotateCrown();
                        crownCounter=0;
                    }

                    return false;
                });
            },
            unbindManualSetTime: function() {
                $(window).unbind("DOMMouseScroll mousewheel");
            },

            toggleResetButton: function() {
                $("#reset-link").fadeToggle("slow", "swing");
            },

            rotateCrown: function() {
                theFills.push(theFills.shift());
                $(".crown-fill").each(function(i) {
                    currentCrownState = $(this).attr("class");
                    currentCrownState = currentCrownState.replace(" "+ theFills[0],"").replace(" "+ theFills[1],"").replace(" "+ theFills[2],"");

                    $(this).attr("class",currentCrownState + " " + theFills[i]);
                });
            },
          
// Converted and adapted from: http://jivebay.com/calculating-the-moon-phase/
getCurrentMoonPosition: function() {
 var d = new Date(),
                    year = d.getFullYear(),
                    month = d.getMonth(),
                    date = d.getDate(),
                    c,e,jd,b,diff;

                if (month < 3) {
                    year--;
                    month += 12;
                }

                month++;

                c = 365.25 * year;
                e = 30.6 * month;
                jd = c + e + date - 694039.09;
                jd /= 29.5305882;
                b = parseInt(jd);
                jd -= b;
                b = Math.round(jd * 8);

                diff = jd*10;
                diff = +diff.toFixed(2);

                if (b >= 8 ) {
                    b = 0;
                }

                switch (b) {
                    case 0:
                        $("#moon-phase-dial").attr("class","new-moon").rotate('45deg');
                        $(".moonphase").removeClass("active");
                        $(".moonphase.new-moon").addClass("active");
                        break;
                    case 1:
                        $("#moon-phase-dial").attr("class","waxing-crescent").rotate('-83deg');
                        $(".moonphase").removeClass("active");
                        $(".moonphase.waxing-crescent").addClass("active");
                        break;
                    case 2:
                        $("#moon-phase-dial").attr("class","first-quarter").rotate('-69deg');
                        $(".moonphase").removeClass("active");
                        $(".moonphase.first-quarter").addClass("active");
                        break;
                    case 3:
                        $("#moon-phase-dial").attr("class","waxing-gibbous").rotate('-55deg');
                        $(".moonphase").removeClass("active");
                        $(".moonphase.waxing-gibbous").addClass("active");
                        break;
                    case 4:
                        $("#moon-phase-dial").attr("class","full-moon").rotate('-37deg');
                        $(".moonphase").removeClass("active");
                        $(".moonphase.full-moon").addClass("active");
                        break;
                    case 5:
                        $("#moon-phase-dial").attr("class","waning-gibbous").rotate('-13deg');
                        $(".moonphase").removeClass("active");
                        $(".moonphase.waning-gibbous").addClass("active");
                        break;
                    case 6:
                        $("#moon-phase-dial").attr("class","third-quarter").rotate('0deg');
                        $(".moonphase").removeClass("active");
                        $(".moonphase.third-quarter").addClass("active");
                        break;
                    case 7:
                        $("#moon-phase-dial").attr("class","waning-crescent").rotate('15deg');
                        $(".moonphase").removeClass("active");
                        $(".moonphase.waning-crescentn").addClass("active");
                        break;
                    default:
                        console.log('Error');
                }

                $("#moon-phase-dial").animate({rotate: '+='+ diff +'deg'}, 500);
            },

            updateTheWatchColor: function(ver) {
                theCurrentState = $("#northern-lights").attr("class");
                theCurrentState = theCurrentState.replace(" blue","").replace(" green","").replace(" purple","");
                $("#northern-lights").attr("class",theCurrentState + " " + ver);

                theCurrentGlowState = $("#the-glow").attr("class");
                theCurrentGlowState = theCurrentGlowState.replace("blue","").replace(" green","").replace(" purple","");
                $("#the-glow").attr("class",theCurrentGlowState + " " + ver);
            },

            updateTheLights: function(type) {
                theCurrentState = $("#northern-lights").attr("class");
                theCurrentGlowState = $("#the-glow").attr("class");
                if (type == "off") {
                    $("body").addClass("glow");
                    $("#the-glow").attr("class",theCurrentGlowState + " active");
                    $("#northern-lights").attr("class",theCurrentState + " glow");
                } else {
                    $("body").removeClass("glow");
                    $("#northern-lights").attr("class",theCurrentState.replace(" glow",""));
                    $("#the-glow").attr("class",theCurrentGlowState.replace(" active",""));
                }
            },

            updateTheMoonphase: function(type) {
                var thePhases = {
                    "new-moon": {
                        deg: 45
                    },
                    "waxing-crescent": {
                        deg: -83
                    },
                    "first-quarter": {
                        deg: -69
                    },
                    "waxing-gibbous": {
                        deg: -55
                    },
                    "full-moon": {
                        deg: -37
                    },
                    "waning-gibbous": {
                        deg: -13
                    },
                    "third-quarter": {
                        deg: 0
                    },
                    "waning-crescent": {
                        deg: 15
                    }
                }
                if (type == "fast") {
                    $("#moon-phase-dial").animate({rotate: "0deg"}, 500, function() {
                        $(this).css({"-webkit-transform": "rotate(0deg)"}).attr("class","fast");
                    });
                } else if (type == "reset") {
                    $("#moon-phase-dial").attr("class","");
                    theWatch.getCurrentMoonPosition();
                } else {
                    $("#moon-phase-dial").attr("class",type).animate({rotate: thePhases[type]['deg'] + "deg"}, 1000);
                }
            }
        };

    $(document).ready(function() {
        theWatch.init();
    });
}(this, this.document, this.jQuery));
// https://github.com/zachstronaut/jquery-animate-css-rotate-scale 
(function($) { 
    function initData($el) {
        var _ARS_data = $el.data('_ARS_data');
        if (!_ARS_data) {
            _ARS_data = {
                rotateUnits: 'deg',
                scale: 1,
                rotate: 0
            };

            $el.data('_ARS_data', _ARS_data);
        }

        return _ARS_data;
    }

    function setTransform($el, data) {
        $el.css('transform', 'rotate(' + data.rotate + data.rotateUnits + ') scale(' + data.scale + ',' + data.scale + ')');
    }

    $.fn.rotate = function(val) {
        var $self = $(this),
            m, data = initData($self);

        if (typeof val == 'undefined') {
            return data.rotate + data.rotateUnits;
        }

        m = val.toString().match(/^(-?\d+(\.\d+)?)(.+)?$/);
        if (m) {
            if (m[3]) {
                data.rotateUnits = m[3];
            }

            data.rotate = m[1];

            setTransform($self, data);
        }

        return this;
    };

    $.fn.scale = function(val) {
        var $self = $(this),
            data = initData($self);

        if (typeof val == 'undefined') {
            return data.scale;
        }

        data.scale = val;

        setTransform($self, data);

        return this;
    };

    var curProxied = $.fx.prototype.cur;
    $.fx.prototype.cur = function() {
        if (this.prop == 'rotate') {
            return parseFloat($(this.elem).rotate());

        } else if (this.prop == 'scale') {
            return parseFloat($(this.elem).scale());
        }

        return curProxied.apply(this, arguments);
    };

    $.fx.step.rotate = function(fx) {
        var data = initData($(fx.elem));
        $(fx.elem).rotate(fx.now + data.rotateUnits);
    };

    $.fx.step.scale = function(fx) {
        $(fx.elem).scale(fx.now);
    };

    var animateProxied = $.fn.animate;
    $.fn.animate = function(prop) {
        if (typeof prop['rotate'] != 'undefined') {
            var $self, data, m = prop['rotate'].toString().match(/^(([+-]=)?(-?\d+(\.\d+)?))(.+)?$/);
            if (m && m[5]) {
                $self = $(this);
                data = initData($self);
                data.rotateUnits = m[5];
            }

            prop['rotate'] = m[1];
        }

        return animateProxied.apply(this, arguments);
    };
})(jQuery);