<?php
global $porto_settings;

$breadcrumbs = $porto_settings['show-breadcrumbs'] ? porto_get_meta_value( 'breadcrumbs', true ) : false;
$page_title  = $porto_settings['show-pagetitle'] ? porto_get_meta_value( 'page_title', true ) : false;

if ( ( is_front_page() && is_home() ) || is_front_page() ) {
	$breadcrumbs = false;
	$page_title  = false;
}

$title      = isset( $porto_shortcode_title ) ? $porto_shortcode_title : porto_page_title();
$sub_title  = isset( $porto_shortcode_sub_title ) ? $porto_shortcode_sub_title : porto_page_sub_title();
$hide_title = ! $title || ! $page_title;

if ( isset( $is_shortcode ) ) {
	$hide_title  = isset( $hide_page_title ) ? true : false;
	$breadcrumbs = isset( $hide_breadcrumb ) ? false : true;
}

$featured_image_id = '';
$featured_image_alt = '';
$page_entry_title = '';

    if (is_home() && !is_front_page()) {
        $blog_page_id = get_option('page_for_posts');
        $featured_image_id = get_post_thumbnail_id($blog_page_id);
        $featured_image_alt = get_post_meta($featured_image_id, '_wp_attachment_image_alt', true);
        $page_entry_title = get_the_title(get_option('page_for_posts'));
    } else {
        $featured_image_id = get_post_thumbnail_id();
        $featured_image_alt = get_post_meta($featured_image_id, '_wp_attachment_image_alt', true);
        $page_entry_title = get_the_title();
    }

    if (!empty($featured_image_id) && !is_woocommerce()) {
        ?>
        <div class="airbuddy-blog__banner">
            <div class="airbuddy-blog__banner-container">
                <img src="<?php echo esc_url(wp_get_attachment_url($featured_image_id)); ?>" alt="<?php echo esc_attr($featured_image_alt); ?>">
                <h1><?php echo esc_html($page_entry_title); ?></h1>
            </div>
        </div>
        <?php
    } else {
		?>
		<div style="padding-top: 50px;"></div>
		<?php
	}

?>
<div class="container<?php echo ! $hide_title ? '' : ' hide-title'; ?>">
	<div class="row">
		<div class="col-lg-12">
			<div class="<?php echo ! $hide_title ? '' : ' d-none'; ?>">
				<h1 class="page-title<?php echo ! $sub_title ? '' : ' b-none'; ?>"><?php echo porto_strip_script_tags( $title ); ?></h1>
				<?php
				if ( $sub_title ) :
					?>
					<p class="page-sub-title"><?php echo porto_strip_script_tags( $sub_title ); ?></p>
				<?php endif; ?>
			</div>
			<?php if ( $breadcrumbs ) : ?>
				<div class="breadcrumbs-wrap<?php echo ! $sub_title ? '' : ' breadcrumbs-with-subtitle'; ?>">
					<?php echo porto_breadcrumbs(); ?>
				</div>
			<?php endif; ?>
			<?php
			porto_breadcrumbs_filter();
			?>
		</div>
	</div>
</div>
