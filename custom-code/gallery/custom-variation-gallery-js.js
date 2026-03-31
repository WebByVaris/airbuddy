jQuery(document).ready(function($) {
    function setActiveThumb($thumbsSlider, index) {
        if (!$thumbsSlider.length) {
            return;
        }

        var normalizedIndex = parseInt(index, 10) || 0;
        $thumbsSlider.find('.owl-item, .thumb').removeClass('selected');
        var $target = $thumbsSlider.find('.owl-item').eq(normalizedIndex);

        if ($target.length) {
            $target.addClass('selected');
            $target.find('.thumb').addClass('selected');
            $thumbsSlider.trigger('to.owl.carousel', [normalizedIndex, 200, true]);
        }
    }

    function bindGallerySync($mainSlider, $thumbsSlider) {
        if (!$mainSlider.length || !$thumbsSlider.length) {
            return;
        }

        $mainSlider.off('changed.owl.carousel.gallerySync initialized.owl.carousel.gallerySync');
        $thumbsSlider.off('click.gallerySync', '.thumb');

        $mainSlider.on('initialized.owl.carousel.gallerySync', function() {
            setActiveThumb($thumbsSlider, 0);
        });

        $mainSlider.on('changed.owl.carousel.gallerySync', function(event) {
            if (!event || !event.item) {
                return;
            }
            setActiveThumb($thumbsSlider, event.item.index);
        });

        $thumbsSlider.on('click.gallerySync', '.thumb', function() {
            var index = $(this).closest('.owl-item').index();
            $mainSlider.trigger('to.owl.carousel', [index, 300, true]);
            setActiveThumb($thumbsSlider, index);
        });
    }

    function showGalleryLoader() {
        var $gallery = $('.woocommerce-product-gallery');
        if ($gallery.length > 0 && $gallery.find('.gallery-loader').length === 0) {
            $gallery.append('<div class="gallery-loader"><div class="spinner"></div></div>');
        }
    }

    function hideGalleryLoader() {
        $('.gallery-loader').remove();
    }

    function showVariationLoader() {
        var $gallery = $('.woocommerce-product-gallery');
        if ($gallery.length > 0 && $gallery.find('.variation-loader').length === 0) {
            $gallery.append('<div class="variation-loader"><div class="spinner"></div></div>');
        }
    }

    function hideVariationLoader() {
        $('.variation-loader').remove();
    }

    function initLightbox() {
        if ($('#product-lightbox').length === 0) {
            $('body').append(`
                <div id="product-lightbox" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 9999; cursor: pointer;">
                    <div style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <button id="lightbox-close" style="align-self: flex-end; margin-right: 5%; margin-bottom: 2rem; background: none; border: none; color: white; font-size: 30px; cursor: pointer;">&times;</button>
                        <img id="lightbox-image" style="max-width: 90%; max-height: 90%; object-fit: contain; margin-bottom: 2rem;" />
                        <div style="display: flex; align-items: center; gap: 24px;">
                            <button id="lightbox-prev" style="background: none; border: none; color: white; font-size: 30px; cursor: pointer;">&lt;</button>
                            <button id="lightbox-next" style="background: none; border: none; color: white; font-size: 30px; cursor: pointer;">&gt;</button>
                        </div>
                    </div>
                </div>
            `);
        }
    }

    function openLightbox(imageSrc, imageAlt, currentIndex, allImages) {
        initLightbox();
        
        $('#lightbox-image').attr('src', imageSrc).attr('alt', imageAlt);
        $('#product-lightbox').fadeIn(300);
        
        $('#product-lightbox').data('current-index', currentIndex);
        $('#product-lightbox').data('all-images', allImages);
        
        $('#lightbox-prev').toggle(currentIndex > 0);
        $('#lightbox-next').toggle(currentIndex < allImages.length - 1);
    }

    function closeLightbox() {
        $('#product-lightbox').fadeOut(300);
    }

    function navigateLightbox(direction) {
        var currentIndex = $('#product-lightbox').data('current-index');
        var allImages = $('#product-lightbox').data('all-images');
        
        if (direction === 'next' && currentIndex < allImages.length - 1) {
            currentIndex++;
        } else if (direction === 'prev' && currentIndex > 0) {
            currentIndex--;
        }
        
        var image = allImages[currentIndex];
        $('#lightbox-image').attr('src', image.full).attr('alt', image.alt || '');
        $('#product-lightbox').data('current-index', currentIndex);
        
        $('#lightbox-prev').toggle(currentIndex > 0);
        $('#lightbox-next').toggle(currentIndex < allImages.length - 1);
    }

    $(document).on('click', '#lightbox-close, #product-lightbox', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });

    $(document).on('click', '#lightbox-prev', function(e) {
        e.stopPropagation();
        navigateLightbox('prev');
    });

    $(document).on('click', '#lightbox-next', function(e) {
        e.stopPropagation();
        navigateLightbox('next');
    });

    $(document).on('keydown', function(e) {
        if ($('#product-lightbox').is(':visible')) {
            if (e.keyCode === 27) {
                closeLightbox();
            } else if (e.keyCode === 37) {
                navigateLightbox('prev');
            } else if (e.keyCode === 39) {
                navigateLightbox('next');
            }
        }
    });

    function handleVariationChange() {
        if (typeof window.productVariationGalleries === 'undefined') {
            return;
        }

        var selectedAttributes = {};
        $('.variations select').each(function() {
            var $select = $(this);
            var attributeName = $select.attr('name');
            var selectedValue = $select.val();
            
            if (selectedValue && selectedValue !== '') {
                var attrName = attributeName.replace('attribute_', '');
                selectedAttributes[attrName] = selectedValue;
            }
        });

        var matchingVariation = null;

        for (var variationId in window.productVariationGalleries) {
            var variation = window.productVariationGalleries[variationId];
            
            if (!variation || typeof variation !== 'object') {
                continue;
            }
            
            if (variation.images && variation.attributes) {
                var attributes = variation.attributes;
                var isMatch = true;
                
                for (var attrName in selectedAttributes) {
                    if (!attributes.hasOwnProperty(attrName) || attributes[attrName] !== selectedAttributes[attrName]) {
                        isMatch = false;
                        break;
                    }
                }
                
                if (isMatch) {
                    matchingVariation = variation;
                    break;
                }
            }
        }

        if (matchingVariation && matchingVariation.images) {
            updateProductGallery(matchingVariation.images);
        }
    }

    function updateProductGallery(images) {
        var $gallery = $('.woocommerce-product-gallery');
        var $mainSlider = $gallery.find('.product-image-slider');
        var $thumbsSlider = $gallery.find('.product-thumbs-slider');

        if ($mainSlider.length === 0 || $thumbsSlider.length === 0) {
            return;
        }

        showVariationLoader();
        
        $mainSlider.empty();
        $thumbsSlider.empty();

        images.forEach(function(image, index) {
            var mainSlide = $('<div class="slide"></div>');
            var mainImg = $('<img src="' + image.full + '" alt="' + (image.alt || '') + '" />');
            mainImg.css('cursor', 'pointer');
            mainImg.data('lightbox-initialized', true);
            mainImg.on('click', function() {
                openLightbox(image.full, image.alt || '', index, images);
            });
            mainSlide.append(mainImg);
            $mainSlider.append(mainSlide);

            var thumbSlide = $('<div class="thumb"></div>');
            thumbSlide.append('<img src="' + image.thumb + '" alt="' + (image.alt || '') + '" />');
            $thumbsSlider.append(thumbSlide);
        });

        if (typeof $.fn.owlCarousel !== 'undefined') {
            $mainSlider.trigger('destroy.owl.carousel');
            $thumbsSlider.trigger('destroy.owl.carousel');
            
            $mainSlider.owlCarousel({
                items: 1,
                nav: true,
                navText: ["",""],
                dots: false,
                loop: false,
                autoplay: false
            });
            
            $thumbsSlider.owlCarousel({
                items: 6,
                nav: true,
                navText: ["",""],
                dots: false,
                loop: false,
                autoplay: false,
                margin: 10
            });

            bindGallerySync($mainSlider, $thumbsSlider);
            setActiveThumb($thumbsSlider, 0);
        }
        
        setTimeout(function() {
            hideVariationLoader();
        }, 300);
    }

    $(document).on('change', '.variations select', function() {
        setTimeout(handleVariationChange, 100);
    });

    $(document).on('found_variation', '.variations_form', function(event, variation) {
        if (variation && variation.variation_id) {
            var variationId = variation.variation_id;
            
            if (window.productVariationGalleries && window.productVariationGalleries[variationId]) {
                var variationData = window.productVariationGalleries[variationId];
                if (variationData && variationData.images) {
                    updateProductGallery(variationData.images);
                    return;
                }
            }
        }
        
        handleVariationChange();
    });

    $(document).on('woocommerce_variation_has_changed', function() {
        handleVariationChange();
    });

    $(document).on('click', '.product-image-slider .owl-item:not(.cloned) img', function(e) {
        var $img = $(this);
        if (!$img.data('lightbox-initialized')) {
            e.preventDefault();
            var $mainSlider = $img.closest('.product-image-slider');
            var allImages = [];
            $mainSlider.find('.owl-item:not(.cloned) img').each(function() {
                allImages.push({
                    full: $(this).attr('src'),
                    alt: $(this).attr('alt') || ''
                });
            });
            var index = $mainSlider.find('.owl-item:not(.cloned) img').index($img);
            openLightbox($img.attr('src'), $img.attr('alt') || '', index, allImages);
        }
    });

    function initProductGalleryLightbox() {
        var $gallery = $('.woocommerce-product-gallery');
        var $mainSlider = $gallery.find('.product-image-slider');
        
        if ($mainSlider.length > 0) {
            $mainSlider.find('.owl-item:not(.cloned) img').each(function(index) {
                var $img = $(this);
                if (!$img.data('lightbox-initialized')) {
                    $img.css('cursor', 'pointer');
                    $img.on('click', function() {
                        var allImages = [];
                        $mainSlider.find('.owl-item:not(.cloned) img').each(function() {
                            allImages.push({
                                full: $(this).attr('src'),
                                alt: $(this).attr('alt') || ''
                            });
                        });
                        openLightbox($img.attr('src'), $img.attr('alt') || '', index, allImages);
                    });
                    $img.data('lightbox-initialized', true);
                }
            });
        }
    }

    function initializeGallery() {
        if ($('.variations select').length > 0) {
            handleVariationChange();
        } else {
            initProductGalleryLightbox();
            bindGallerySync($('.product-image-slider'), $('.product-thumbs-slider'));
            setActiveThumb($('.product-thumbs-slider'), 0);
        }
    }

    showGalleryLoader();
    
    setTimeout(function() {
        initializeGallery();
        
        setTimeout(function() {
            hideGalleryLoader();
        }, 800);
    }, 500);

    $(document).on('initialized.owl.carousel', '.product-image-slider', function() {
        setTimeout(initProductGalleryLightbox, 100);
    });
});
