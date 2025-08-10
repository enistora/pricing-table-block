<?php
/**
 * Plugin Name: Pricing Table Block
 * Description: Adds a custom Pricing Table block to the block editor with WCAG 2.1 AA compliance.
 * Version: 1.0.0
 * Author: Your Name
 * Requires at least: 6.0
 * Tested up to: 6.7
 * Requires PHP: 7.4
 * License: GPL v2 or later
 * Text Domain: pricing-table-block
 * Domain Path: /languages
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'PTB_VERSION', '1.0.0' );
define( 'PTB_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'PTB_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Register the pricing table block
 */
function ptb_register_block() {
    register_block_type( PTB_PLUGIN_DIR . 'build' );
}
add_action( 'init', 'ptb_register_block' );

/**
 * Enqueue block assets for editor and frontend
 */
function ptb_enqueue_block_assets() {
    wp_enqueue_block_style(
        'pricing-table-block/main',
        array(
            'handle' => 'pricing-table-block-style',
            'src'    => PTB_PLUGIN_URL . 'build/style-index.css',
            'path'   => PTB_PLUGIN_DIR . 'build/style-index.css',
            'ver'    => PTB_VERSION,
        )
    );
}
add_action( 'init', 'ptb_enqueue_block_assets' );

/**
 * Load plugin textdomain for translations
 */
function ptb_load_textdomain() {
    load_plugin_textdomain(
        'pricing-table-block',
        false,
        dirname( plugin_basename( __FILE__ ) ) . '/languages'
    );
}
add_action( 'plugins_loaded', 'ptb_load_textdomain' );

/**
 * Add custom block category for pricing table blocks
 */
function ptb_add_block_category( $block_categories ) {
    return array_merge(
        $block_categories,
        array(
            array(
                'slug'  => 'pricing-blocks',
                'title' => __( 'Pricing Blocks', 'pricing-table-block' ),
                'icon'  => 'money-alt',
            ),
        )
    );
}
add_filter( 'block_categories_all', 'ptb_add_block_category' );