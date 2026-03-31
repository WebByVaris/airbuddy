var interval = null;
jQuery(document).ready(function($) {
	 $('.variations tr').each(function() {
        var row = $(this);
        if (row.find('ul.filter-item-list').length) return;
        var label = row.find('label');
        var select = row.find('select');
        
        if (select.length > 0) {
            var attributeName = select.attr('name');
            var ul = $('<ul class="filter-item-list" data-name="' + attributeName + '"></ul>');
            
            select.find('option').each(function() {
                var value = $(this).val();
                var text = $(this).text();
                
                if (value) {
                    var li = $('<li><a href="#" class="filter-item" data-value="' + value + '">' + text + '</a></li>');

                    if ($(this).is(':selected')) {
                        li.addClass('active');
                    }
                    
                    li.click(function(e) {
                        e.preventDefault();
                        if ($(this).hasClass('active')) {
                            select.val('').trigger('change');
                            $(this).removeClass('active');
                            return;
                        }
                        select.val(value).trigger('change');
                        ul.find('li').removeClass('active');
                        $(this).addClass('active');
                    });
                    
                    ul.append(li);
                }
            });

            select.hide().after(ul);
			label.show();
        }
    });
  
    function turnOffElements(elementsArray) {
        elementsArray.each(function(i, e){
            $(e).css("display","none");
        });
    }
  
	
	interval = setInterval(skuAppend, 50);

    function skuAppend() {
		var $variationPrice = $(".woocommerce-variation .woocommerce-variation-price");
		if ($variationPrice.length) {
			$("h2.product_title .woocommerce-variation-price").remove();
			$variationPrice.first().detach().appendTo("h2.product_title");
		}
		$('.woocommerce-variation-availability .product_meta').remove();
		$('.product_meta').first().clone().appendTo('.woocommerce-variation-availability');
		if($(".product_meta").is(".woocommerce-variation-availability .product_meta")){
			$('.woocommerce-variation-availability .product_meta').show();
			clearInterval(interval);
		   }
    }
  	function priceOnClick(){
		setTimeout(function() { 
			skuAppend();
        }, 500);
	}

    // HARNESS SIZE - 1st DIVER
    var sizeDescription = $("ul[data-name='attribute_pa_harness-size-1st']");

    sizeDescription.append("<li class='airBuddyDescription airBuddySize-s-m'>Brustumfang<br class='br-hide'> 80 ~ 100 cm</li>");
    sizeDescription.append("<li class='airBuddyShow airBuddyDescription airBuddySize-l-xl'>Brustumfang<br class='br-hide'> 100 ~ 112 cm</li>");
    sizeDescription.append("<li class='airBuddyShow airBuddyDescription airBuddySize-2xl-3xl'>Brustumfang<br class='br-hide'> 112 ~ 125 cm</li>");
    
    var smallButton = $("a[data-value='s-m-de']");
    var largeButton = $("a[data-value='l-xl-de']");
    var extraLargeButton = $("a[data-value='2xl-3xl-de']");
    
    var harnessArr = $(".airBuddySize-s-m, .airBuddySize-l-xl, .airBuddySize-2xl-3xl");

    smallButton.on( "click", function() {
		 $(".woocommerce-variation-price").hide();
		priceOnClick();
        if (!$(this).parent().hasClass("active")){
            turnOffElements(harnessArr);
            $(harnessArr[0]).css("display","list-item");
        } else {
            turnOffElements(harnessArr);
            }
    });
    largeButton.on( "click", function() {
		$(".woocommerce-variation-price").hide();
		priceOnClick();
        if (!$(this).parent().hasClass("active")){
            turnOffElements(harnessArr);
			$(harnessArr[1]).css("display","list-item");
        } else {
            turnOffElements(harnessArr);
            }
    });
    extraLargeButton.on( "click", function() {
	$(".woocommerce-variation-price").hide();
	priceOnClick();
    if (!$(this).parent().hasClass("active")){
        turnOffElements(harnessArr);
        $(harnessArr[2]).css("display","list-item");
    } else {
        turnOffElements(harnessArr);
        }
    });
// HARNESS SIZE - 2nd DIVER
    var sizeDescription = $("ul[data-name='attribute_pa_harness-size-2nd']");

    sizeDescription.append("<li class='airBuddyShow airBuddyDescription airBuddySize-sm'>Brustumfang<br class='br-hide'> 80 ~ 100 cm</li>");
    sizeDescription.append("<li class='airBuddyShow airBuddyDescription airBuddySize-lxl'>Brustumfang<br class='br-hide'> 100 ~ 112 cm</li>");
    sizeDescription.append("<li class='airBuddyShow airBuddyDescription airBuddySize-2xl3xl'>Brustumfang<br class='br-hide'> 112 ~ 125 cm</li>");
	sizeDescription.find("li:nth-child(2)").addClass('active');
    var smallButtonTwo = $("a[data-value='sm-de']");
    var largeButtonTwo = $("a[data-value='lxl-de']");
    var extraLargeButtonTwo = $("a[data-value='2xl3xl-de']");
    var noButton = $("a[data-value='no-de']");

    var harnessTwoArr = $(".airBuddySize-sm, .airBuddySize-lxl, .airBuddySize-2xl3xl");

    smallButtonTwo.on( "click", function() {
		$(".woocommerce-variation-price").hide();
		priceOnClick();
        if (!$(this).parent().hasClass("active")){
            turnOffElements(harnessTwoArr);
            $(harnessTwoArr[0]).css("display","list-item");
        } else {
            turnOffElements(harnessTwoArr);
            }
    });
    largeButtonTwo.on( "click", function() {
		$(".woocommerce-variation-price").hide();
		priceOnClick();
        if (!$(this).parent().hasClass("active")){
            turnOffElements(harnessTwoArr);
			$(harnessTwoArr[1]).css("display","list-item");
        } else {
            turnOffElements(harnessTwoArr);
            }
    });
    extraLargeButtonTwo.on( "click", function() {
	$(".woocommerce-variation-price").hide();
	priceOnClick();
    if (!$(this).parent().hasClass("active")){
        turnOffElements(harnessTwoArr);
        $(harnessTwoArr[2]).css("display","list-item");
    } else {
        turnOffElements(harnessTwoArr);
        }
    });
    noButton.on( "click", function() {
        turnOffElements(harnessTwoArr);
    });

// Dive Flag Type
    var diveFlagDescription = $("ul[data-name='attribute_pa_flag-type']");

    diveFlagDescription.append("<li class='airBuddyDescription airBuddyRedWhite'>Nordamerika, <br class='br-hide'>Italien, Schweiz</li>");
    diveFlagDescription.append("<li class='airBuddyShow airBuddyDescription airBuddyAlpha'>International</li>");

    var redWhiteButton = $("a[data-value='red-white']");
	var alphaButton = $("a[data-value='alpha']");

    var diveFlagArr = $(".airBuddyRedWhite, .airBuddyAlpha");
    
    redWhiteButton.on( "click", function() {
		$(".woocommerce-variation-price").hide();
		priceOnClick();
		if (!$(this).parent().hasClass("active")){
			turnOffElements(diveFlagArr);
			$(diveFlagArr[0]).css("display","list-item");
		} else {
			turnOffElements(diveFlagArr);
		}
	});
	alphaButton.on( "click", function() {
		$(".woocommerce-variation-price").hide();
		priceOnClick();
		if (!$(this).parent().hasClass("active")){
            turnOffElements(diveFlagArr);
			$(diveFlagArr[1]).css("display","list-item");
		} else {
            turnOffElements(diveFlagArr);
		}
	});
// Charger Plug
    var chargerDescription = $("ul[data-name='attribute_pa_charger']");

    chargerDescription.append("<li class='airBuddyDescription airBuddyB'>USA, Kanada, Mexiko, <br class='br-hide'>Japan, Thailand, Taiwan</li>");
    chargerDescription.append("<li class='airBuddyShow airBuddyDescription airBuddyI'>Australien, Neuseeland, <br class='br-hide'>China, Argentinien, Fidschi</li>");
    chargerDescription.append("<li class='airBuddyShow airBuddyDescription airBuddyCef'>Großteil der EU, Teile Asiens, <br class='br-hide'>Teile Südamerikas</li>");
    chargerDescription.append("<li class='airBuddyShow airBuddyDescription airBuddyG'>UK, Irland, Malta, HK, <br class='br-hide'>Singapur, Naher Osten</li>");
    chargerDescription.append("<li class='airBuddyShow airBuddyDescription airBuddyJ'>Schweiz</li>");
    chargerDescription.append("<li class='airBuddyShow airBuddyDescription airBuddyH'>Israel</li>");
    chargerDescription.append("<li class='airBuddyShow airBuddyDescription airBuddyM'>Südafrika, Indien</li>");

    var bButton = $("a[data-value='b']");
    var iButton = $("a[data-value='i']");
    var cefButton = $("a[data-value='cef']");
    var gButton = $("a[data-value='g']");
    var jButton = $("a[data-value='j']");
    var hButton = $("a[data-value='h']");
    var mButton = $("a[data-value='m']");

    var chargerArr = $(".airBuddyB, .airBuddyI, .airBuddyCef, .airBuddyG, .airBuddyJ, .airBuddyH, .airBuddyM");

    bButton.on( "click", function() {
		$(".woocommerce-variation-price").hide();
		priceOnClick();
        if (!$(this).parent().hasClass("active")){
            turnOffElements(chargerArr);
            $(chargerArr[0]).css("display","list-item");
        } else {
            turnOffElements(chargerArr);
        }
    });
    iButton.on( "click", function() {
		$(".woocommerce-variation-price").hide();
		priceOnClick();
        if (!$(this).parent().hasClass("active")){
            turnOffElements(chargerArr);
            $(chargerArr[1]).css("display","list-item");
        } else {
            turnOffElements(chargerArr);
        }
    });
    cefButton.on( "click", function() {
		$(".woocommerce-variation-price").hide();
		priceOnClick();
        if (!$(this).parent().hasClass("active")){
            turnOffElements(chargerArr);
            $(chargerArr[2]).css("display","list-item");
        } else {
            turnOffElements(chargerArr);
        }
    });
    gButton.on( "click", function() {
		$(".woocommerce-variation-price").hide();
		priceOnClick();
        if (!$(this).parent().hasClass("active")){
            turnOffElements(chargerArr);
            $(chargerArr[3]).css("display","list-item");
        } else {
            turnOffElements(chargerArr);
        }
    });
    jButton.on( "click", function() {
		$(".woocommerce-variation-price").hide();
		priceOnClick();
        if (!$(this).parent().hasClass("active")){
            turnOffElements(chargerArr);
            $(chargerArr[4]).css("display","list-item");
        } else {
            turnOffElements(chargerArr);
        }
    });
    hButton.on( "click", function() {
		$(".woocommerce-variation-price").hide();
		priceOnClick();
        if (!$(this).parent().hasClass("active")){
            turnOffElements(chargerArr);
            $(chargerArr[5]).css("display","list-item");
        } else {
            turnOffElements(chargerArr);
        }
    });
    mButton.on( "click", function() {
		$(".woocommerce-variation-price").hide();
		priceOnClick();
        if (!$(this).parent().hasClass("active")){
            turnOffElements(chargerArr);
            $(chargerArr[6]).css("display","list-item");
        } else {
            turnOffElements(chargerArr);
        }
    });
// Language
    var languageDescription = $("ul[data-name='attribute_pa_manual-language']");

    languageDescription.append("<li class='airBuddyDescription airBuddyEng'>Englisch</li>");
    languageDescription.append("<li class='airBuddyShow airBuddyDescription airBuddyGer'>Deutsch</li>");
    languageDescription.append("<li class='airBuddyShow airBuddyDescription airBuddyFra'>Französisch</li>");
    languageDescription.append("<li class='airBuddyShow airBuddyDescription airBuddyEsp'>Spanisch</li>");
    languageDescription.append("<li class='airBuddyShow airBuddyDescription airBuddyIta'>Italienisch</li>");
    languageDescription.append("<li class='airBuddyShow airBuddyDescription airBuddyCze'>Tschechisch</li>");

    var engButton = $("a[data-value='eng-de']");
    var gerButton = $("a[data-value='ger-de']");
    var fraButton = $("a[data-value='fra-de']");
    var espButton = $("a[data-value='esp-de']");
    var itaButton = $("a[data-value='ita-de']");
    var czeButton = $("a[data-value='cze-de']");

    var languageArr = $(".airBuddyEng, .airBuddyGer, .airBuddyFra, .airBuddyEsp, .airBuddyIta, .airBuddyCze");

    engButton.on( "click", function() {
		$(".woocommerce-variation-price").hide();
		priceOnClick();
        if (!$(this).parent().hasClass("active")){
            turnOffElements(languageArr);
            $(languageArr[0]).css("display","list-item");
        } else {
            turnOffElements(languageArr);
        }
    });
    gerButton.on( "click", function() {
		$(".woocommerce-variation-price").hide();
		priceOnClick();
        if (!$(this).parent().hasClass("active")){
            turnOffElements(languageArr);
            $(languageArr[1]).css("display","list-item");
        } else {
            turnOffElements(languageArr);
        }
    });
    fraButton.on( "click", function() {
		$(".woocommerce-variation-price").hide();
		priceOnClick();
        if (!$(this).parent().hasClass("active")){
            turnOffElements(languageArr);
            $(languageArr[2]).css("display","list-item");
        } else {
            turnOffElements(languageArr);
        }
    });
    espButton.on( "click", function() {
		$(".woocommerce-variation-price").hide();
		priceOnClick();
        if (!$(this).parent().hasClass("active")){
            turnOffElements(languageArr);
            $(languageArr[3]).css("display","list-item");
        } else {
            turnOffElements(languageArr);
        }
    });
    itaButton.on( "click", function() {
		$(".woocommerce-variation-price").hide();
		priceOnClick();
        if (!$(this).parent().hasClass("active")){
            turnOffElements(languageArr);
            $(languageArr[4]).css("display","list-item");
        } else {
            turnOffElements(languageArr);
        }
    });
    czeButton.on( "click", function() {
		$(".woocommerce-variation-price").hide();
		priceOnClick();
        if (!$(this).parent().hasClass("active")){
            turnOffElements(languageArr);
            $(languageArr[5]).css("display","list-item");
        } else {
            turnOffElements(languageArr);
        }
    });
// DIVER SETUP
    var diverDescription = $("ul[data-name='attribute_pa_diver-setup']");

    diverDescription.append("<li class='airBuddyDescription airBuddySingle'>Ein Taucher<br class='br-hide'> bis zu 12m</li>");
    diverDescription.append("<li class='airBuddyShow airBuddyDescription airBuddyBuddy'>Zwei Taucher<br class='br-hide'> bis zu 6&6m</li>");
    diverDescription.append("<li class='airBuddyShow airBuddyDescription airBuddyCombo'>Ein Taucher bis zu 12m oder<br class='br-hide'> zwei Taucher bis zu 6&6m</li>");
    diverDescription.append("<li class='airBuddyShow airBuddyDescription airBuddyDuo'>Zwei Taucher<br class='br-hide'> bis zu 12m</li>");

    var singleButton = $("a[data-value='single-de']");
    var buddyButton = $("a[data-value='buddy-de']");
    var comboButton = $("a[data-value='combo-de']");
    var duoButton = $("a[data-value='duo-de']");

    var diverImagesArr = $(".airBuddySingle, .airBuddyBuddy, .airBuddyCombo, .airBuddyDuo");

    var allElementsArr = $(".airBuddySize-s-m, .airBuddySize-l-xl, .airBuddySize-2xl-3xl, .airBuddySize-sm, .airBuddySize-lxl, .airBuddySize-2xl3xl, .airBuddyRedWhite, .airBuddyAlpha, .airBuddyB, .airBuddyI, .airBuddyCef, .airBuddyG, .airBuddyJ, .airBuddyH, .airBuddyM, .airBuddyEng, .airBuddyGer, .airBuddyFra, .airBuddyEsp, .airBuddyIta, .airBuddyCze");

    var harnessTwo = $( "table.variations tr:nth-child(3)");

    var singleDescription = $("ul[data-name='attribute_pa_diver-setup'] li.airBuddyDescription.airBuddySingle");
    var buddyDescription = $("ul[data-name='attribute_pa_diver-setup'] li.airBuddyDescription.airBuddyBuddy");
    var comboDescription = $("ul[data-name='attribute_pa_diver-setup'] li.airBuddyDescription.airBuddyCombo");
    var duoDescription = $("ul[data-name='attribute_pa_diver-setup'] li.airBuddyDescription.airBuddyDuo");

    var airBuddyImageHtml = "<div class='airBuddyShow airBuddyDuo'><img src='https://airbuddy.com/wp-content/uploads/2022/01/DUO.jpg'/></div><div class='airBuddyShow airBuddyCombo'><img src='https://airbuddy.com/wp-content/uploads/2022/01/COMBO.jpg'/></div><div class='airBuddyShow airBuddyBuddy'><img src='https://airbuddy.com/wp-content/uploads/2022/01/BUDDY.jpg'/></div><div class='airBuddySingle'><img src='https://airbuddy.com/wp-content/uploads/2022/01/SINGLE.jpg'/></div>";

    function ensureGalleryHasDiverImages() {
        var container = $(".woocommerce-product-gallery--with-images");
        if (!container.length || container.find(".airBuddySingle").length > 0) return container;
        container.prepend(airBuddyImageHtml);
        return container;
    }

    var chargerValues = ["b","i","cef","g","j","h","m"];
    var languageValues = ["eng-de","ger-de","fra-de","esp-de","ita-de","cze-de"];

    function applyDiverSetupUI() {
        var gallery = ensureGalleryHasDiverImages();
        var images = gallery.find(".airBuddySingle, .airBuddyBuddy, .airBuddyCombo, .airBuddyDuo");
        var setup = $("form.variations_form select[name='attribute_pa_diver-setup']").val();
        var harness1st = $("form.variations_form select[name='attribute_pa_harness-size-1st']").val();
        var harness2nd = $("form.variations_form select[name='attribute_pa_harness-size-2nd']").val();
        var flag = $("form.variations_form select[name='attribute_pa_flag-type']").val();
        var charger = $("form.variations_form select[name='attribute_pa_charger']").val();
        var language = $("form.variations_form select[name='attribute_pa_manual-language']").val();
        images.css("display", "none");
        singleDescription.css("display","none");
        buddyDescription.css("display","none");
        comboDescription.css("display","none");
        duoDescription.css("display","none");
        if (setup === "single-de") {
            turnOffElements(allElementsArr);
            if (harness1st) {
                if (harness1st === "s-m-de") $(harnessArr[0]).css("display","list-item");
                else if (harness1st === "l-xl-de") $(harnessArr[1]).css("display","list-item");
                else if (harness1st === "2xl-3xl-de") $(harnessArr[2]).css("display","list-item");
            }
            $(harnessTwoArr[0]).css("display","list-item");
            if (flag) { turnOffElements(diveFlagArr); $(diveFlagArr[flag === "alpha" ? 1 : 0]).css("display","list-item"); }
            if (charger) { turnOffElements(chargerArr); $(chargerArr[chargerValues.indexOf(charger)]).css("display","list-item"); }
            if (language) { turnOffElements(languageArr); $(languageArr[languageValues.indexOf(language)]).css("display","list-item"); }
            harnessTwo.css("display","none");
            gallery.find(".airBuddySingle").first().css("display","block");
            singleDescription.css("display","list-item");
        } else if (setup === "buddy-de") {
            turnOffElements(harnessTwoArr);
            if (harness2nd === "sm-de") $(harnessTwoArr[0]).css("display","list-item");
            else if (harness2nd === "lxl-de") $(harnessTwoArr[1]).css("display","list-item");
            else if (harness2nd === "2xl3xl-de") $(harnessTwoArr[2]).css("display","list-item");
            harnessTwo.css("display","block");
            gallery.find(".airBuddyBuddy").first().css("display","block");
            buddyDescription.css("display","list-item");
            if (harness1st) {
                turnOffElements(harnessArr);
                if (harness1st === "s-m-de") $(harnessArr[0]).css("display","list-item");
                else if (harness1st === "l-xl-de") $(harnessArr[1]).css("display","list-item");
                else if (harness1st === "2xl-3xl-de") $(harnessArr[2]).css("display","list-item");
            }
            if (flag) { turnOffElements(diveFlagArr); $(diveFlagArr[flag === "alpha" ? 1 : 0]).css("display","list-item"); }
            if (charger) { turnOffElements(chargerArr); $(chargerArr[chargerValues.indexOf(charger)]).css("display","list-item"); }
            if (language) { turnOffElements(languageArr); $(languageArr[languageValues.indexOf(language)]).css("display","list-item"); }
        } else if (setup === "combo-de") {
            turnOffElements(harnessTwoArr);
            if (harness2nd === "sm-de") $(harnessTwoArr[0]).css("display","list-item");
            else if (harness2nd === "lxl-de") $(harnessTwoArr[1]).css("display","list-item");
            else if (harness2nd === "2xl3xl-de") $(harnessTwoArr[2]).css("display","list-item");
            harnessTwo.css("display","block");
            gallery.find(".airBuddyCombo").first().css("display","block");
            comboDescription.css("display","list-item");
            if (harness1st) {
                turnOffElements(harnessArr);
                if (harness1st === "s-m-de") $(harnessArr[0]).css("display","list-item");
                else if (harness1st === "l-xl-de") $(harnessArr[1]).css("display","list-item");
                else if (harness1st === "2xl-3xl-de") $(harnessArr[2]).css("display","list-item");
            }
            if (flag) { turnOffElements(diveFlagArr); $(diveFlagArr[flag === "alpha" ? 1 : 0]).css("display","list-item"); }
            if (charger) { turnOffElements(chargerArr); $(chargerArr[chargerValues.indexOf(charger)]).css("display","list-item"); }
            if (language) { turnOffElements(languageArr); $(languageArr[languageValues.indexOf(language)]).css("display","list-item"); }
        } else if (setup === "duo-de") {
            $(".airBuddySize-lxl").css("display","none");
            $(".airBuddySize-2xl3xl").css("display","none");
            turnOffElements(harnessTwoArr);
            if (harness2nd === "sm-de") $(harnessTwoArr[0]).css("display","list-item");
            else if (harness2nd === "lxl-de") $(harnessTwoArr[1]).css("display","list-item");
            else if (harness2nd === "2xl3xl-de") $(harnessTwoArr[2]).css("display","list-item");
            harnessTwo.css("display","block");
            gallery.find(".airBuddyDuo").first().css("display","block");
            duoDescription.css("display","list-item");
            if (harness1st) {
                turnOffElements(harnessArr);
                if (harness1st === "s-m-de") $(harnessArr[0]).css("display","list-item");
                else if (harness1st === "l-xl-de") $(harnessArr[1]).css("display","list-item");
                else if (harness1st === "2xl-3xl-de") $(harnessArr[2]).css("display","list-item");
            }
            if (flag) { turnOffElements(diveFlagArr); $(diveFlagArr[flag === "alpha" ? 1 : 0]).css("display","list-item"); }
            if (charger) { turnOffElements(chargerArr); $(chargerArr[chargerValues.indexOf(charger)]).css("display","list-item"); }
            if (language) { turnOffElements(languageArr); $(languageArr[languageValues.indexOf(language)]).css("display","list-item"); }
        }
    }

    function scheduleApplyDiverSetupUI() {
        setTimeout(applyDiverSetupUI, 400);
    }

    $("form.variations_form").on("found_variation", function() {
        scheduleApplyDiverSetupUI();
        setTimeout(skuAppend, 500);
    });

    $("form.variations_form").on("change", "select[name='attribute_pa_diver-setup']", function() {
        scheduleApplyDiverSetupUI();
        setTimeout(skuAppend, 600);
    });

    singleButton.on( "click", function() {
        $("#pa_harness-size-2nd").val("no-de").change();
    });
    buddyButton.on( "click", function() {
        $("#pa_harness-size-2nd").val("sm-de").change();
    });
    comboButton.on( "click", function() {
        $("#pa_harness-size-2nd").val("sm-de").change();
    });
    duoButton.on( "click", function() {
        $("#pa_harness-size-2nd").val("sm-de").change();
        $(".airBuddySize-lxl").css("display","none");
        $(".airBuddySize-2xl3xl").css("display","none");
        $(harnessTwoArr[0]).css("display","list-item");
    });

    setTimeout(applyDiverSetupUI, 100);
});
