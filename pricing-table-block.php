<?php
/**
 * Plugin Name: Pricing Table Block
 * Description: Adds a custom Pricing Table block to the block editor.
 * Version: 1.0.0
 * Author: Your Name
 */
function ptb_render_block_callback( $attributes ) {
    if ( empty( $attributes['tiers'] ) || ! is_array( $attributes['tiers'] ) ) {
        return '';
    }

    ob_start();
    ?>
    <div class="pricing-table-block">
        <div class="ptb-tiers">
            <?php foreach ( $attributes['tiers'] as $tier ) : ?>
                <div class="ptb-tier">
                    <div class="ptb-tier-header">
                        <div class="ptb-tier-name"><?php echo esc_html( $tier['name'] ); ?></div>
                        <div class="ptb-tier-price"><?php echo esc_html( $tier['price'] ); ?></div>
                    </div>
                    <div class="ptb-tier-description"><?php echo wp_kses_post( $tier['description'] ); ?></div>
                    <?php if ( ! empty( $tier['features'] ) && is_array( $tier['features'] ) ) : ?>
                        <ul class="ptb-tier-features">
                            <?php foreach ( $tier['features'] as $feature ) : ?>
                                <li><?php echo esc_html( $feature ); ?></li>
                            <?php endforeach; ?>
                        </ul>
                    <?php endif; ?>
                    <?php if ( ! empty( $tier['ctaText'] ) ) : ?>
                        <div class="ptb-tier-cta">
                            <a class="ptb-btn"
                               href="<?php echo esc_url( $tier['ctaUrl'] ); ?>"
                               target="_blank"
                               rel="noopener noreferrer">
                                <?php echo esc_html( $tier['ctaText'] ); ?>
                            </a>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

function ptb_register_block() {
    register_block_type( __DIR__ . '/build', [
        'render_callback' => 'ptb_render_block_callback',
        'attributes' => [
            'tiers' => [
                'type' => 'array',
                'default' => [],
            ],
        ],
    ] );
}
add_action( 'init', 'ptb_register_block' );