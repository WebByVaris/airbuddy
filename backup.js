jQuery(document).ready(function($) {
  // Handle variation change for custom gallery
  function handleVariationChange() {
      if (typeof window.productVariationGalleries === 'undefined') {
          console.log('productVariationGalleries not found');
          return;
      }

      // Get selected variation attributes
      var selectedAttributes = {};
      $('.variations select').each(function() {
          var $select = $(this);
          var attributeName = $select.attr('name');
          var selectedValue = $select.val();
          
          if (selectedValue && selectedValue !== '') {
              // Extract attribute name from name attribute (e.g., "attribute_pa_color" -> "pa_color")
              var attrName = attributeName.replace('attribute_', '');
              selectedAttributes[attrName] = selectedValue;
          }
      });

      console.log('Selected attributes:', selectedAttributes);
      console.log('Available variations:', window.productVariationGalleries);

      // Find matching variation
      var matchingVariationId = null;
      var matchingVariation = null;

      for (var variationId in window.productVariationGalleries) {
          var variation = window.productVariationGalleries[variationId];
          
          // Check if variation and attributes exist
          if (!variation || typeof variation !== 'object') {
              console.log('Invalid variation data for ID:', variationId);
              continue;
          }
          
          var attributes = variation.attributes;
          
          // Check if attributes exist and is an object
          if (!attributes || typeof attributes !== 'object') {
              console.log('No attributes found for variation:', variationId);
              continue;
          }
          
          var isMatch = true;
          for (var attrName in selectedAttributes) {
              if (!attributes.hasOwnProperty(attrName) || attributes[attrName] !== selectedAttributes[attrName]) {
                  isMatch = false;
                  break;
              }
          }
          
          if (isMatch) {
              matchingVariationId = variationId;
              matchingVariation = variation;
              console.log('Found matching variation:', variationId);
              break;
          }
      }

      // Update gallery if variation found
      if (matchingVariation && matchingVariation.images) {
          console.log('Updating gallery for variation:', matchingVariationId);
          updateProductGallery(matchingVariation.images);
      } else {
          console.log('No matching variation found or no images available');
      }
  }

  // Update product gallery with new images
  function updateProductGallery(images) {
      var $gallery = $('.woocommerce-product-gallery');
      var $mainSlider = $gallery.find('.product-image-slider');
      var $thumbsSlider = $gallery.find('.product-thumbs-slider');

      if ($mainSlider.length === 0 || $thumbsSlider.length === 0) {
          return;
      }

      // Clear existing slides
      $mainSlider.empty();
      $thumbsSlider.empty();

      // Add new slides
      images.forEach(function(image) {
          // Main slider slide
          var mainSlide = $('<div class="slide"></div>');
          mainSlide.append('<img src="' + image.full + '" alt="' + (image.alt || '') + '" />');
          $mainSlider.append(mainSlide);

          // Thumbnail slide
          var thumbSlide = $('<div class="thumb"></div>');
          thumbSlide.append('<img src="' + image.thumb + '" alt="' + (image.alt || '') + '" />');
          $thumbsSlider.append(thumbSlide);
      });

      // Reinitialize Owl Carousel if it exists
      if (typeof $.fn.owlCarousel !== 'undefined') {
          $mainSlider.trigger('destroy.owl.carousel');
          $thumbsSlider.trigger('destroy.owl.carousel');
          
          // Reinitialize with your existing settings
          $mainSlider.owlCarousel({
              items: 1,
              nav: true,
              dots: false,
              loop: false,
              autoplay: false
          });
          
          $thumbsSlider.owlCarousel({
              items: 4,
              nav: false,
              dots: false,
              loop: false,
              autoplay: false,
              margin: 10
          });

          // Sync thumbnails with main slider
          $thumbsSlider.on('click', '.thumb', function() {
              var index = $(this).index();
              $mainSlider.trigger('to.owl.carousel', [index, 300]);
          });
      }
  }

  // Listen for variation changes
  $(document).on('change', '.variations select', function() {
      // Small delay to ensure WooCommerce has processed the change
      setTimeout(handleVariationChange, 100);
  });

  // Also listen for WooCommerce variation events
  $(document).on('found_variation', '.variations_form', function(event, variation) {
      console.log('WooCommerce found variation:', variation);
      
      // Try to get variation ID from WooCommerce data
      if (variation && variation.variation_id) {
          var variationId = variation.variation_id;
          
          // Check if we have gallery data for this variation
          if (window.productVariationGalleries && window.productVariationGalleries[variationId]) {
              var variationData = window.productVariationGalleries[variationId];
              if (variationData && variationData.images) {
                  console.log('Using WooCommerce variation data for gallery update');
                  updateProductGallery(variationData.images);
                  return;
              }
          }
      }
      
      // Fallback to attribute-based matching
      handleVariationChange();
  });

  // Handle initial load if variation is already selected
  $(document).on('woocommerce_variation_has_changed', function() {
      handleVariationChange();
  });

  // Initialize on page load if needed
  setTimeout(function() {
      if ($('.variations select').length > 0) {
          handleVariationChange();
      }
  }, 500);
});
