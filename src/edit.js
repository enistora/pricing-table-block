import { useBlockProps, InspectorControls, RichText, URLInputButton } from '@wordpress/block-editor';
import {
    Button,
    TextControl,
    IconButton,
    PanelBody,
    PanelRow,
    RangeControl,
    SelectControl
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const { tiers, featuredTier = 0 } = attributes;

    // Add a tier (max 3)
    const addTier = () => {
        if (tiers.length < 3) {
            setAttributes({
                tiers: [
                    ...tiers,
                    {
                        name: `Tier ${tiers.length + 1}`,
                        price: "",
                        description: "",
                        features: [""],
                        ctaText: "Choose Plan",
                        ctaUrl: ""
                    }
                ]
            });
        }
    };

    // Remove a tier (min 2)
    const removeTier = (index) => {
        if (tiers.length > 2) {
            const newTiers = [...tiers];
            newTiers.splice(index, 1);
            setAttributes({ tiers: newTiers });
            // If the featured tier was removed, reset to first tier
            if (featuredTier >= newTiers.length) {
                setAttributes({ featuredTier: 0 });
            }
        }
    };

    // Update a tier field
    const updateTier = (index, field, value) => {
        const newTiers = [...tiers];
        newTiers[index][field] = value;
        setAttributes({ tiers: newTiers });
    };

    // Add/remove feature to a tier
    const addFeature = (index) => {
        const newTiers = [...tiers];
        newTiers[index].features = [...(newTiers[index].features || []), ""];
        setAttributes({ tiers: newTiers });
    };
    const removeFeature = (tierIndex, featIndex) => {
        const newTiers = [...tiers];
        newTiers[tierIndex].features.splice(featIndex, 1);
        setAttributes({ tiers: newTiers });
    };
    const updateFeature = (tierIndex, featIndex, value) => {
        const newTiers = [...tiers];
        newTiers[tierIndex].features[featIndex] = value;
        setAttributes({ tiers: newTiers });
    };

    // Inspector control handlers:
    const setFeaturedTier = (value) => setAttributes({ featuredTier: Number(value) });

    // Handle number of tiers from sidebar
    const setNumberOfTiers = (n) => {
        if (n < tiers.length) {
            setAttributes({ tiers: tiers.slice(0, n) });
            if (featuredTier >= n) {
                setAttributes({ featuredTier: 0 });
            }
        } else if (n > tiers.length) {
            setAttributes({
                tiers: [
                    ...tiers,
                    ...Array.from({ length: n - tiers.length }, (_, idx) => ({
                        name: `Tier ${tiers.length + idx + 1}`,
                        price: "",
                        description: "",
                        features: [""],
                        ctaText: "Choose Plan",
                        ctaUrl: ""
                    }))
                ]
            });
        }
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title="Pricing Table Settings" initialOpen={true}>
                    <RangeControl
                        label="Number of Tiers"
                        value={tiers.length}
                        min={2}
                        max={3}
                        onChange={setNumberOfTiers}
                    />
                    <SelectControl
                        label="Featured Tier (highlighted)"
                        value={featuredTier}
                        options={tiers.map((tier, idx) => ({
                            label: tier.name || `Tier ${idx + 1}`,
                            value: idx
                        }))}
                        onChange={setFeaturedTier}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...useBlockProps()}>
                <h3>Pricing Table</h3>
                <div className="ptb-tiers">
                    {tiers.map((tier, i) => (
                        <div
                            key={i}
                            className={`ptb-tier${i === featuredTier ? " ptb-tier-featured" : ""}`}
                        >
                            <div className="ptb-tier-header">
                                <TextControl
                                    label="Plan Name"
                                    value={tier.name}
                                    onChange={(val) => updateTier(i, "name", val)}
                                />
                                <Button
                                    isDestructive
                                    isSmall
                                    onClick={() => removeTier(i)}
                                    disabled={tiers.length <= 2}
                                    style={{ marginLeft: "auto" }}
                                    aria-label="Remove tier"
                                >
                                    Remove Tier
                                </Button>
                            </div>
                            <TextControl
                                label="Price"
                                value={tier.price}
                                placeholder="e.g. £0/month"
                                onChange={val => updateTier(i, "price", val)}
                            />
                            <div className="ptb-field">
                                <label>Description</label>
                                <RichText
                                    tagName="div"
                                    value={tier.description}
                                    allowedFormats={["core/bold", "core/italic", "core/link"]}
                                    multiline="p"
                                    onChange={val => updateTier(i, "description", val)}
                                    placeholder="Enter description..."
                                />
                            </div>
                            <PanelBody title="Features" initialOpen={true}>
                                {tier.features && tier.features.length > 0 && (
                                    tier.features.map((feat, featIndex) => (
                                        <PanelRow key={featIndex}>
                                            <TextControl
                                                value={feat}
                                                placeholder={`Feature ${featIndex + 1}`}
                                                onChange={val => updateFeature(i, featIndex, val)}
                                            />
                                            <IconButton
                                                icon="no-alt"
                                                label="Remove feature"
                                                isDestructive
                                                onClick={() => removeFeature(i, featIndex)}
                                                disabled={tier.features.length <= 1}
                                            />
                                        </PanelRow>
                                    ))
                                )}
                                <Button
                                    onClick={() => addFeature(i)}
                                    isSecondary
                                    style={{ marginTop: 8 }}
                                >
                                    Add Feature
                                </Button>
                            </PanelBody>
                            <div className="ptb-field">
                                <TextControl
                                    label="CTA Button Text"
                                    value={tier.ctaText}
                                    onChange={val => updateTier(i, "ctaText", val)}
                                />
                                <label style={{ marginTop: 8 }}>CTA Button URL</label>
                                <URLInputButton
                                    url={tier.ctaUrl}
                                    onChange={url => updateTier(i, "ctaUrl", url)}
                                    label="Select or enter URL"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <Button
                    onClick={addTier}
                    disabled={tiers.length >= 3}
                    variant="primary"
                    style={{ marginTop: 16 }}
                >
                    Add Tier
                </Button>
            </div>
        </>
    );
}