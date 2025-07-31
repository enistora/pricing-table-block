import { RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { tiers } = attributes;
    return (
        <div className="pricing-table-block">
            <div className="ptb-tiers">
                {tiers.map((tier, i) => (
                    <div className="ptb-tier" key={i}>
                        <div className="ptb-tier-header">
                            <div className="ptb-tier-name">{tier.name}</div>
                            <div className="ptb-tier-price">{tier.price}</div>
                        </div>
                        <div className="ptb-tier-description">
                            <RichText.Content value={tier.description} tagName="div" />
                        </div>
                        {tier.features && tier.features.length > 0 && (
                            <ul className="ptb-tier-features">
                                {tier.features.map((feat, j) => (
                                    <li key={j}>{feat}</li>
                                ))}
                            </ul>
                        )}
                        {tier.ctaText && (
                            <div className="ptb-tier-cta">
                                <a
                                    className="ptb-btn"
                                    href={tier.ctaUrl || "#"}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    {tier.ctaText}
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}