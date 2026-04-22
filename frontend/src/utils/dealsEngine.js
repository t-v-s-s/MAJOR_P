
export function normalizeProductData(product) {
    // Basic fields from backend
    const normalized = {
        id: product.id,
        title: product.product_name,
        image: product.image,
        price: parseFloat(product.price),
        category: product.category || 'General',
        description: product.description,
        rating: Math.floor(product.id % 2) + 4, // 4 or 5 stars for best value calculation
    };

    // Simulate backend deal properties
    // In a real scenario, these would come directly from the DB
    const idHash = (product.id * 89) % 100;

    if (idHash < 60) {
        // High chance it's a simulated deal
        normalized.discountPercent = [10, 15, 20, 25, 30, 50, 60][idHash % 7];
        normalized.originalPrice = parseFloat((normalized.price / (1 - normalized.discountPercent / 100)).toFixed(2));
        normalized.isDeal = true;

        // Randomize deal end time: some end in minutes, some in hours
        const now = new Date().getTime();
        const offsetMinutes = (idHash % 15 === 0) ? 2 : (idHash * 15); // Some expire very soon (2 mins) to test auto-remove
        normalized.dealEndsAt = now + (offsetMinutes * 60 * 1000);
    } else {
        // Not a deal
        normalized.discountPercent = 0;
        normalized.originalPrice = normalized.price;
        normalized.isDeal = false;
        normalized.dealEndsAt = null;
    }

    return normalized;
}

/**
 * Validates if a normalized product actually counts as a Deal.
 */
export function isAppliableDeal(product) {
    if (!product) return false;

    const validDiscount = product.discountPercent >= 10;
    const priceDrop = product.originalPrice > product.price;
    const flagged = product.isDeal === true;

    // Check if it hasn't expired yet
    const notExpired = !product.dealEndsAt || product.dealEndsAt > new Date().getTime();

    return (validDiscount || priceDrop || flagged) && notExpired;
}

/**
 * Sorts an array of valid deals based on the specified criteria.
 * sortBy: 'discount' | 'ending_soon' | 'best_value'
 */
export function sortDeals(deals, sortBy = 'discount') {
    return [...deals].sort((a, b) => {
        if (sortBy === 'discount') {
            return b.discountPercent - a.discountPercent;
        }

        if (sortBy === 'ending_soon') {
            const timeA = a.dealEndsAt || Infinity;
            const timeB = b.dealEndsAt || Infinity;
            return timeA - timeB;
        }

        if (sortBy === 'best_value') {
            // Formula: Rating acts as a multiplier to the discount.
            // Example: 5 stars * 50% discount = 250 score. 4 stars * 20% discount = 80 score.
            const scoreA = (a.rating || 0) * a.discountPercent;
            const scoreB = (b.rating || 0) * b.discountPercent;
            return scoreB - scoreA;
        }

        return 0; // Default
    });
}
