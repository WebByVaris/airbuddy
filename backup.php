<?php

add_action( 'woocommerce_product_after_variable_attributes', function( $loop, $variation_data, $variation ) {
    global $abcdefgh_i;
    $abcdefgh_i = $loop;
    add_filter( 'acf/prepare_field', 'acf_prepare_field_update_field_name' );
    
    $acf_field_groups = acf_get_field_groups();
    foreach( $acf_field_groups as $acf_field_group ) {
        foreach( $acf_field_group['location'] as $group_locations ) {
            foreach( $group_locations as $rule ) {
                if( $rule['param'] == 'post_type' && $rule['operator'] == '==' && $rule['value'] == 'product_variation' ) {
                    acf_render_fields( $variation->ID, acf_get_fields( $acf_field_group ) );
                    break 2;
                }
            }
        }
    }
    
    remove_filter( 'acf/prepare_field', 'acf_prepare_field_update_field_name' );
}, 10, 3 );

function  acf_prepare_field_update_field_name( $field ) {
    global $abcdefgh_i;
    $field['name'] = preg_replace( '/^acf\[/', "acf[$abcdefgh_i][", $field['name'] );
    return $field;
}
    
add_action( 'woocommerce_save_product_variation', function( $variation_id, $i = -1 ) {
    if ( ! empty( $_POST['acf'] ) && is_array( $_POST['acf'] ) && array_key_exists( $i, $_POST['acf'] ) && is_array( ( $fields = $_POST['acf'][ $i ] ) ) ) {
        foreach ( $fields as $key => $val ) {
            update_field( $key, $val, $variation_id );
        }
    }
}, 10, 2 );

add_filter('acf/location/rule_values/post_type', 'acf_location_rule_values_Post');
function acf_location_rule_values_Post( $choices ) {
	$choices['product_variation'] = 'Product Variation';
    return $choices;
}

add_action('acf/init', 'create_variation_gallery_field_group');
function create_variation_gallery_field_group() {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    if (get_field_object('variation_gallery')) {
        return;
    }

    acf_add_local_field_group(array(
        'key' => 'group_variation_gallery',
        'title' => 'Variation Gallery Images',
        'fields' => array(
            array(
                'key' => 'field_variation_gallery',
                'label' => 'Variation Gallery',
                'name' => 'variation_gallery',
                'type' => 'gallery',
                'instructions' => 'Select images for this product variation',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '',
                    'class' => '',
                    'id' => '',
                ),
                'return_format' => 'array',
                'preview_size' => 'medium',
                'insert' => 'append',
                'library' => 'all',
                'min' => '',
                'max' => 10,
                'min_width' => '',
                'min_height' => '',
                'min_size' => '',
                'max_width' => '',
                'max_height' => '',
                'max_size' => '',
                'mime_types' => '',
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'product_variation',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen' => '',
        'active' => true,
        'description' => '',
    ));
}

add_action('wp_enqueue_scripts', 'enqueue_variation_gallery_ajax');
function enqueue_variation_gallery_ajax() {
    wp_localize_script('jquery', 'variation_gallery_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('variation_gallery_nonce')
    ));
}

add_action('wp_ajax_get_custom_variation_gallery', 'get_variation_gallery_ajax');
add_action('wp_ajax_nopriv_get_custom_variation_gallery', 'get_variation_gallery_ajax');
function get_variation_gallery_ajax() {
    try {
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'variation_gallery_nonce')) {
            wp_send_json_error('Invalid nonce');
        }

        $variation_id = isset($_POST['variation_id']) ? intval($_POST['variation_id']) : 0;
        if (!$variation_id) {
            wp_send_json_error('Missing or invalid variation ID');
        }

        $variation = wc_get_product($variation_id);
        if (!$variation || !$variation->is_type('variation')) {
            wp_send_json_error('Invalid variation product');
        }

        $gallery_images = get_field('variation_gallery', $variation_id);
        if (!$gallery_images || !is_array($gallery_images)) {
            wp_send_json_error('No gallery images found for this variation');
        }

        $result = array();
        foreach ($gallery_images as $image) {
            if (!is_array($image) || !isset($image['ID'])) {
                continue;
            }

            $result[] = array(
                'id' => intval($image['ID']),
                '600x600' => isset($image['sizes']['medium']) ? $image['sizes']['medium'] : (isset($image['sizes']['large']) ? $image['sizes']['large'] : $image['url']),
                '150x150' => isset($image['sizes']['thumbnail']) ? $image['sizes']['thumbnail'] : $image['url'],
                'full' => isset($image['sizes']['full']) ? $image['sizes']['full'] : $image['url'],
                'alt' => isset($image['alt']) ? sanitize_text_field($image['alt']) : '',
                'title' => isset($image['title']) ? sanitize_text_field($image['title']) : ''
            );
        }

        if (empty($result)) {
            wp_send_json_error('No valid gallery images found for this variation');
        }

        wp_send_json_success($result);

    } catch (Exception $e) {
        wp_send_json_error('An error occurred: ' . $e->getMessage());
    }
}

add_action('woocommerce_before_single_product', 'add_variation_gallery_data');
function add_variation_gallery_data() {
    if (is_product()) {
        global $product;
        if (!$product) return;

        if ($product->is_type('variable')) {
            $variations = $product->get_available_variations();
            $variation_galleries = array();
            
            foreach ($variations as $variation) {
                $variation_id = $variation['variation_id'];
                $gallery_images = get_field('variation_gallery', $variation_id);

                if ($gallery_images && is_array($gallery_images)) {
                    $variation_galleries[$variation_id] = array(
                        'attributes' => $variation['attributes'],
                        'images' => $gallery_images
                    );
                }
            }
            
            if (!empty($variation_galleries)) {
                echo '<script>var productVariationGalleries = ' . json_encode($variation_galleries) . ';</script>';
            }
        }
    }
}

add_action('admin_footer', 'add_acf_variation_gallery_js');
function add_acf_variation_gallery_js() {
    if (get_post_type() === 'product') {
        ?>
        <script>
        jQuery(document).ready(function($) {
            $(document).on('woocommerce_variations_loaded', function() {
                if (typeof acf !== 'undefined') {
                    acf.do_action('ready');
                }
            });

            $(document).on('woocommerce_variation_added woocommerce_variation_updated', function() {
                setTimeout(function() {
                    if (typeof acf !== 'undefined') {
                        acf.do_action('ready');
                    }
                }, 100);
            });

            setTimeout(function() {
                if (typeof acf !== 'undefined') {
                    acf.do_action('ready');
                }
            }, 500);
        });
        </script>
        <?php
    }
}


// Remove default WooCommerce product gallery
add_action('wp_head', function() {
    if (is_product()) {
        remove_action('woocommerce_before_single_product_summary', 'woocommerce_show_product_images', 20);
    }
});

// Add custom product gallery before single product summary
add_action('woocommerce_before_single_product_summary', 'custom_product_gallery_display', 20);
function custom_product_gallery_display() {
    global $product;
    
    if (!$product) {
        return;
    }
    
    $product_id = $product->get_id();
    
    if ($product->is_type('variable')) {
        $variations = $product->get_available_variations();
        
        if (!empty($variations)) {
            $variation_galleries = array();
            
            foreach ($variations as $variation) {
                $variation_id = $variation['variation_id'];
                $gallery_images = get_field('variation_gallery', $variation_id);
                
                $images = array();
                
                $variation_obj = wc_get_product($variation_id);
                $main_image_id = $variation_obj->get_image_id();
                
                if ($main_image_id) {
                    $main_image_url = wp_get_attachment_image_url($main_image_id, 'full');
                    $main_thumb_url = wp_get_attachment_image_url($main_image_id, 'thumbnail');
                    $main_image_alt = get_post_meta($main_image_id, '_wp_attachment_image_alt', true);
                    
                    if ($main_image_url && $main_thumb_url) {
                        $images[] = array(
                            'full' => $main_image_url,
                            'thumb' => $main_thumb_url,
                            'alt' => $main_image_alt
                        );
                    }
                }
                
                if ($gallery_images && is_array($gallery_images)) {
                    foreach ($gallery_images as $gallery_image) {
                        $image_id = is_array($gallery_image) ? $gallery_image['ID'] : $gallery_image;
                        
                        if ($image_id != $main_image_id) {
                            $image_url = wp_get_attachment_image_url($image_id, 'full');
                            $thumb_url = wp_get_attachment_image_url($image_id, 'thumbnail');
                            $image_alt = get_post_meta($image_id, '_wp_attachment_image_alt', true);
                            
                            if ($image_url && $thumb_url) {
                                $images[] = array(
                                    'full' => $image_url,
                                    'thumb' => $thumb_url,
                                    'alt' => $image_alt
                                );
                            }
                        }
                    }
                }
                
                if (!empty($images)) {
                    $variation_galleries[$variation_id] = array(
                        'images' => $images
                    );
                }
            }
            
            if (!empty($variation_galleries)) {
                $first_variation_id = array_keys($variation_galleries)[0];
                $first_gallery = $variation_galleries[$first_variation_id];
                
                echo '<div class="woocommerce-product-gallery woocommerce-product-gallery--with-images" data-columns="4">';
                echo '<div class="product-image-slider owl-carousel">';
                
                foreach ($first_gallery['images'] as $image) {
                    echo '<div class="slide">';
                    echo '<img src="' . esc_url($image['full']) . '" alt="' . esc_attr($image['alt']) . '" />';
                    echo '</div>';
                }
                
                echo '</div>';
                echo '<div class="product-thumbs-slider owl-carousel">';
                
                foreach ($first_gallery['images'] as $image) {
                    echo '<div class="thumb">';
                    echo '<img src="' . esc_url($image['thumb']) . '" alt="' . esc_attr($image['alt']) . '" />';
                    echo '</div>';
                }
                
                echo '</div>';
                echo '</div>';
                
                echo '<script type="text/javascript">';
                echo 'window.productVariationGalleries = ' . json_encode($variation_galleries) . ';';
                echo '</script>';
            }
        }
    } else {
        $attachment_ids = $product->get_gallery_image_ids();
        
        if (empty($attachment_ids)) {
            $featured_image_id = $product->get_image_id();
            if ($featured_image_id) {
                $attachment_ids = array($featured_image_id);
            }
        }
        
        if (!empty($attachment_ids)) {
            echo '<div class="woocommerce-product-gallery woocommerce-product-gallery--with-images" data-columns="4">';
            echo '<div class="product-image-slider owl-carousel">';
            
            foreach ($attachment_ids as $attachment_id) {
                $image_url = wp_get_attachment_image_url($attachment_id, 'full');
                $image_alt = get_post_meta($attachment_id, '_wp_attachment_image_alt', true);
                
                if ($image_url) {
                    echo '<div class="slide">';
                    echo '<img src="' . esc_url($image_url) . '" alt="' . esc_attr($image_alt) . '" />';
                    echo '</div>';
                }
            }
            
            echo '</div>';
            echo '<div class="product-thumbs-slider owl-carousel">';
            
            foreach ($attachment_ids as $attachment_id) {
                $thumb_url = wp_get_attachment_image_url($attachment_id, 'thumbnail');
                $image_alt = get_post_meta($attachment_id, '_wp_attachment_image_alt', true);
                
                if ($thumb_url) {
                    echo '<div class="thumb">';
                    echo '<img src="' . esc_url($thumb_url) . '" alt="' . esc_attr($image_alt) . '" />';
                    echo '</div>';
                }
            }
            
            echo '</div>';
            echo '</div>';
        }
    }
}

?>


