import { RichText } from '@wordpress/block-editor';

/**
 * URL sanitization function
 */
function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') {
        return '#';
    }
    
    url = url.trim();
    
    if (!url) {
        return '#';
    }
    
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:', 'ftp:'];
    
    try {
        if (!url.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:/)) {
            url = 'https://' + url;
        }
        
        const urlObj = new URL(url);
        
        if (allowedProtocols.includes(urlObj.protocol)) {
            return urlObj.toString();
        }
        
        return '#';
    } catch (e) {
        return '#';
    }
}

/**
 * Save component for Pricing Table Block
 */

export default function save({ attributes }) {
    const { tiers, featuredTier = -1, featuredBadgeText = 'Most Popular' } = attributes;
    return (
        <section className="pricing-table-block" aria-label="Pricing plans comparison">
            <div className="ptb-tiers">
                {tiers.map((tier, i) => (
                    <article 
                        className={`ptb-tier ${i === featuredTier ? 'ptb-tier-featured' : ''}`} 
                        key={i}
                        {...(i === featuredTier ? { 
                            'data-featured-text': featuredBadgeText
                        } : {})}
                    >
                        <header className="ptb-tier-header">
                            <h3 className="ptb-tier-name">{tier.name}</h3>
                            <div className="ptb-tier-price">{tier.price}</div>
                        </header>
                        <div className="ptb-tier-description">
                            <RichText.Content value={tier.description} tagName="div" />
                        </div>
                        {tier.features && tier.features.length > 0 && (
                            <ul className="ptb-tier-features">
                                {tier.features.map((feat, j) => (
                                    <li key={j}>
                                        <span className="ptb-feature-check" aria-hidden="true">✓</span>
                                        <span className="ptb-feature-text">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {tier.ctaText && (
                            <div className="ptb-tier-cta">
                                <a
                                    className="ptb-btn"
                                    href={sanitizeUrl(tier.ctaUrl)}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    aria-label={`${tier.ctaText} for ${tier.name}`}
                                >
                                    <span className="ptb-btn-text">{tier.ctaText}</span>
                                </a>
                            </div>
                        )}
                    </article>
                ))}
            </div>
        </section>
    );
}