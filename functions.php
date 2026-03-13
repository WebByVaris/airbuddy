<?php

add_action('wp_enqueue_scripts', 'porto_child_css', 1001);

// Load CSS
function porto_child_css()
{
	// porto child theme styles
	wp_deregister_style('styles-child');
	wp_register_style('styles-child', esc_url(get_stylesheet_directory_uri()) . '/style.css', array(), '', 'all');

	wp_enqueue_style('styles-child');

	if (is_rtl()) {
		wp_deregister_style('styles-child-rtl');
		wp_register_style('styles-child-rtl', esc_url(get_stylesheet_directory_uri()) . '/style_rtl.css', array(), '', 'all');
		wp_enqueue_style('styles-child-rtl');
	}
}

// function sku_script() {
//     wp_enqueue_script('sku-script', get_stylesheet_directory_uri() . '/js/sku.js', array('jquery'), null, true);
// }
// add_action('wp_enqueue_scripts', 'sku_script');

add_action('wp', 'remove_porto_woocommerce_add_stock_html', 20);

function remove_porto_woocommerce_add_stock_html()
{
	remove_action('woocommerce_product_meta_start', 'porto_woocommerce_add_stock_html', 10);
}

add_action('woocommerce_product_meta_start', 'custom_woocommerce_add_stock_html', 10);

function custom_woocommerce_add_stock_html()
{
	global $product;
	if ($product->is_type('simple')) {
		$availability = $product->get_availability();
		$availability_html = empty($availability['availability']) ? '' : '<span class="custom-stock ' . esc_attr($availability['class']) . '">' . esc_html($availability['availability']) . '</span>';

		echo apply_filters('custom_woocommerce_stock_html', $availability_html, $availability['availability'], $product);
	}
}

// oust Porto’s custom single image output
remove_action('porto_single_product_gallery_img_after', 'porto_filter_output', 10);


add_action('woocommerce_before_single_product_summary', 'woocommerce_show_product_images', 20);


function enqueue_airbuddy_product_en()
{
	$uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
	if (strpos($uri, '/fr/produit/configurateur/') !== false) {
		wp_enqueue_script('airbuddy-product-fr', get_stylesheet_directory_uri() . '/custom-code/configurator/airBuddy-product-fr.js', array('jquery'), null, true);
	} elseif (strpos($uri, '/de/produkt/konfigurator/') !== false) {
		wp_enqueue_script('airbuddy-product-de', get_stylesheet_directory_uri() . '/custom-code/configurator/airBuddy-product-de.js', array('jquery'), null, true);
	} elseif (strpos($uri, '/es/producto/configurador/') !== false) {
		wp_enqueue_script('airbuddy-product-es', get_stylesheet_directory_uri() . '/custom-code/configurator/airBuddy-product-es.js', array('jquery'), null, true);
	} elseif (strpos($uri, '/product/configurator/') !== false) {
		wp_enqueue_script('airbuddy-product-en', get_stylesheet_directory_uri() . '/custom-code/configurator/airBuddy-product-en.js', array('jquery'), null, true);
	}
}

add_action('wp_enqueue_scripts', 'enqueue_airbuddy_product_en');

function enqueue_custom_variation_gallery()
{
	wp_enqueue_script('custom-variation-gallery-js', get_stylesheet_directory_uri() . '/custom-code/gallery/custom-variation-gallery-js.js', array('jquery'), '1.0.1', true);
}

add_action('wp_enqueue_scripts', 'enqueue_custom_variation_gallery');


require_once get_stylesheet_directory() . '/custom-code/gallery/custom-variation-gallery.php';

/**
 * Shortcode to display ONLY the raw currency and price text for a specific product.
 * Usage: [dynamic_starting_price id="123"]
 */
add_shortcode( 'dynamic_starting_price', 'custom_dynamic_starting_price_shortcode' );

function custom_dynamic_starting_price_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'id' => '',
    ), $atts, 'dynamic_starting_price' );

    if ( empty( $atts['id'] ) ) {
        return ''; 
    }

    $product = wc_get_product( $atts['id'] );

    if ( ! $product ) {
        return '';
    }

    $min_price = 0;

    if ( $product->is_type( 'variable' ) ) {
        $variation_ids = $product->get_visible_children();
        $prices = array();

        foreach ( $variation_ids as $vid ) {
            $variation = wc_get_product( $vid );
            if ( $variation && $variation->get_price() !== '' ) {
                $prices[] = $variation->get_price();
            }
        }
        
        if ( ! empty( $prices ) ) {
            $min_price = min( $prices );
        }
    } else {
        $min_price = $product->get_price();
    }

    // 1. Generate the raw price text (no HTML)
    $formatted_price = strip_tags( wc_price( $min_price ) );

    // 2. Safely get the current currency's decimal separator (. or ,)
    $decimal_separator = wc_get_price_decimal_separator();

    // 3. Remove the separator and the two zeros if they exist (e.g., ".00" or ",00")
    $formatted_price = str_replace( $decimal_separator . '00', '', $formatted_price );

    return $formatted_price;
}
