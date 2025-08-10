import { __ } from '@wordpress/i18n';
import { 
    PanelBody, 
    TextControl, 
    RangeControl, 
    SelectControl,
    Button,
    Card,
    CardHeader,
    CardBody,
    Flex,
    FlexItem,
    __experimentalSpacer as Spacer,
    ToolbarGroup,
    ToolbarButton
} from '@wordpress/components';
import { 
    InspectorControls, 
    RichText, 
    URLInputButton,
    BlockControls,
    useBlockProps
} from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { trash, plus, edit } from '@wordpress/icons';

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
 * Edit component for Pricing Table Block
 */

export default function Edit({ attributes, setAttributes }) {
    const { tiers = [], featuredTier = 0, featuredBadgeText = 'Most Popular' } = attributes;
    const blockProps = useBlockProps();
    const [isEditing, setIsEditing] = useState(true);

    if (tiers.length === 0) {
        setAttributes({
            tiers: [
                {
                    name: 'Basic Plan',
                    price: '£9/month',
                    description: '<p>Perfect for individuals and small projects.</p>',
                    features: ['10 Projects', '5GB Storage', 'Email Support'],
                    ctaText: 'Get Started',
                    ctaUrl: ''
                },
                {
                    name: 'Pro Plan',
                    price: '£29/month',
                    description: '<p>Ideal for growing businesses and teams.</p>',
                    features: ['Unlimited Projects', '50GB Storage', 'Priority Support', 'Advanced Analytics'],
                    ctaText: 'Upgrade to Pro',
                    ctaUrl: ''
                }
            ]
        });
    }

    /**
     * Updates a specific tier's property
     */
    const updateTier = (index, key, value) => {
        const newTiers = [...tiers];
        if (key === 'ctaUrl') {
            value = value ? value.trim() : '';
        }
        newTiers[index] = { ...newTiers[index], [key]: value };
        setAttributes({ tiers: newTiers });
    };

    /**
     * Adds a new tier to the pricing table (maximum 3 tiers)
     */
    const addTier = () => {
        if (tiers.length < 3) {
            const newTiers = [...tiers, {
                name: `Plan ${tiers.length + 1}`,
                price: '£0/month',
                description: '<p>Enter your plan description here.</p>',
                features: ['Feature 1'],
                ctaText: 'Choose Plan',
                ctaUrl: ''
            }];
            setAttributes({ tiers: newTiers });
        }
    };

    /**
     * Removes a tier from the pricing table (minimum 2 tiers required)
     */
    const removeTier = (index) => {
        if (tiers.length > 2) {
            const newTiers = tiers.filter((_, i) => i !== index);
            setAttributes({ tiers: newTiers });
            if (featuredTier >= newTiers.length) {
                setAttributes({ featuredTier: 0 });
            }
        }
    };

    const addFeature = (tierIndex) => {
        const newTiers = [...tiers];
        newTiers[tierIndex].features.push('New Feature');
        setAttributes({ tiers: newTiers });
    };

    const removeFeature = (tierIndex, featureIndex) => {
        const newTiers = [...tiers];
        if (newTiers[tierIndex].features.length > 1) {
            newTiers[tierIndex].features.splice(featureIndex, 1);
            setAttributes({ tiers: newTiers });
        }
    };

    const updateFeature = (tierIndex, featureIndex, value) => {
        const newTiers = [...tiers];
        newTiers[tierIndex].features[featureIndex] = value;
        setAttributes({ tiers: newTiers });
    };

    return (
        <div {...blockProps}>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        icon={isEditing ? 'visibility' : edit}
                        label={isEditing ? __('Preview', 'pricing-table-block') : __('Edit', 'pricing-table-block')}
                        onClick={() => setIsEditing(!isEditing)}
                    />
                    <ToolbarButton
                        icon={plus}
                        label={__('Add Tier', 'pricing-table-block')}
                        onClick={addTier}
                        disabled={tiers.length >= 3}
                    />
                    <ToolbarButton
                        icon={edit}
                        label={__('Edit Settings', 'pricing-table-block')}
                        onClick={() => {
                            const settingsTab = document.querySelector('[data-tab-panel="edit-post/block"]');
                            if (settingsTab) settingsTab.click();
                        }}
                    />
                </ToolbarGroup>
            </BlockControls>

            <InspectorControls>
                <PanelBody title={__('Pricing Table Settings', 'pricing-table-block')} initialOpen={true}>
                    <RangeControl
                        label={__('Number of Tiers', 'pricing-table-block')}
                        value={tiers.length}
                        onChange={(value) => {
                            if (value > tiers.length) {
                                addTier();
                            } else if (value < tiers.length && tiers.length > 2) {
                                removeTier(tiers.length - 1);
                            }
                        }}
                        min={2}
                        max={3}
                        help={__('Choose between 2-3 pricing tiers', 'pricing-table-block')}
                    />
                    
                    <SelectControl
                        label={__('Featured Tier', 'pricing-table-block')}
                        value={featuredTier}
                        options={[
                            { label: 'None', value: -1 },
                            ...tiers.map((tier, index) => ({
                                label: tier.name || `Tier ${index + 1}`,
                                value: index
                            }))
                        ]}
                        onChange={(value) => setAttributes({ featuredTier: parseInt(value) })}
                        help={__('Highlight a tier as "most popular"', 'pricing-table-block')}
                    />
                    
                    {featuredTier >= 0 && (
                        <TextControl
                            label={__('Featured Badge Text', 'pricing-table-block')}
                            value={attributes.featuredBadgeText || 'Most Popular'}
                            onChange={(value) => setAttributes({ featuredBadgeText: value })}
                            placeholder="Most Popular"
                            help={__('Text to display on the featured tier badge', 'pricing-table-block')}
                        />
                    )}
                </PanelBody>
            </InspectorControls>

            {isEditing ? (
                <div className="pricing-table-block-editor">
                    <div className="ptb-editor-header">
                        <h3>{__('Pricing Table Configuration', 'pricing-table-block')}</h3>
                        <p>{__('Configure your pricing tiers below. Use the toolbar or settings panel for quick actions.', 'pricing-table-block')}</p>
                    </div>

                    <div className="ptb-tiers-editor">
                        {tiers.map((tier, tierIndex) => (
                            <Card key={tierIndex} className={`ptb-tier-editor ${tierIndex === featuredTier ? 'ptb-tier-featured' : ''}`}>
                                <CardHeader>
                                    <Flex justify="space-between" align="center">
                                        <FlexItem>
                                            <strong>{tier.name || `Tier ${tierIndex + 1}`}</strong>
                                            {tierIndex === featuredTier && <span className="ptb-featured-badge">Featured</span>}
                                        </FlexItem>
                                        {tiers.length > 2 && (
                                            <FlexItem>
                                                <Button 
                                                    icon={trash}
                                                    isDestructive 
                                                    isSmall 
                                                    onClick={() => removeTier(tierIndex)}
                                                    label={__('Remove tier', 'pricing-table-block')}
                                                />
                                            </FlexItem>
                                        )}
                                    </Flex>
                                </CardHeader>
                                
                                <CardBody>
                                    <TextControl
                                        label={__('Plan Name', 'pricing-table-block')}
                                        value={tier.name}
                                        onChange={(value) => updateTier(tierIndex, 'name', value)}
                                        placeholder="Enter plan name"
                                    />
                                    
                                    <TextControl
                                        label={__('Price', 'pricing-table-block')}
                                        value={tier.price}
                                        onChange={(value) => updateTier(tierIndex, 'price', value)}
                                        placeholder="£0/month"
                                    />
                                    
                                    <div className="ptb-description-field">
                                        <label className="components-base-control__label">
                                            {__('Description', 'pricing-table-block')}
                                        </label>
                                        <div className="ptb-richtext-wrapper">
                                            <RichText
                                                tagName="div"
                                                value={tier.description}
                                                onChange={(value) => updateTier(tierIndex, 'description', value)}
                                                placeholder="Enter plan description..."
                                                allowedFormats={['core/bold', 'core/italic']}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="ptb-features-section">
                                        <Flex justify="space-between" align="center">
                                            <FlexItem>
                                                <label className="components-base-control__label">
                                                    {__('Features', 'pricing-table-block')}
                                                </label>
                                            </FlexItem>
                                            <FlexItem>
                                                <Button 
                                                    icon={plus}
                                                    isSecondary 
                                                    isSmall 
                                                    onClick={() => addFeature(tierIndex)}
                                                    label={__('Add feature', 'pricing-table-block')}
                                                />
                                            </FlexItem>
                                        </Flex>
                                        
                                        <div className="ptb-features-list">
                                            {tier.features.map((feature, featureIndex) => (
                                                <Flex key={featureIndex} align="center">
                                                    <FlexItem>
                                                        <TextControl
                                                            value={feature}
                                                            onChange={(value) => updateFeature(tierIndex, featureIndex, value)}
                                                            placeholder="Enter feature"
                                                        />
                                                    </FlexItem>
                                                    <FlexItem>
                                                        <Button 
                                                            icon={trash}
                                                            isDestructive 
                                                            isSmall 
                                                            onClick={() => removeFeature(tierIndex, featureIndex)}
                                                            disabled={tier.features.length <= 1}
                                                            label={__('Remove feature', 'pricing-table-block')}
                                                        />
                                                    </FlexItem>
                                                </Flex>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="ptb-cta-section">
                                        <TextControl
                                            label={__('Button Text', 'pricing-table-block')}
                                            value={tier.ctaText}
                                            onChange={(value) => updateTier(tierIndex, 'ctaText', value)}
                                            placeholder="Choose Plan"
                                        />
                                        
                                        <URLInputButton
                                            label={__('Button URL', 'pricing-table-block')}
                                            url={tier.ctaUrl}
                                            onChange={(value) => updateTier(tierIndex, 'ctaUrl', value)}
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                    
                    {tiers.length < 3 && (
                        <div className="ptb-add-tier">
                            <Button 
                                icon={plus}
                                isPrimary 
                                onClick={addTier}
                            >
                                {__('Add Another Tier', 'pricing-table-block')}
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
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
                                        <span 
                                            className="ptb-btn"
                                            aria-label={`${tier.ctaText} for ${tier.name}`}
                                        >
                                            <span className="ptb-btn-text">{tier.ctaText}</span>
                                        </span>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}