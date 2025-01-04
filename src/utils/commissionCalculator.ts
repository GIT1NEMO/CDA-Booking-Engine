interface CommissionRates {
  adult?: number;
  child?: number;
  family?: number;
  infant?: number;
}

interface GuestCounts {
  adults: number;
  children: number;
  families: number;
  infants: number;
}

interface Prices {
  adult: number;
  child: number;
  family: number;
  infant: number;
}

export const calculateTotalCommission = (
  commissionRates: CommissionRates,
  guestCounts: GuestCounts,
  prices: Prices,
  extrasTotal: number = 0
): number => {
  // Calculate base price total
  const basePriceTotal = 
    (guestCounts.adults * prices.adult) +
    (guestCounts.children * prices.child) +
    (guestCounts.families * prices.family) +
    (guestCounts.infants * prices.infant);

  // Add extras to get final total price
  const totalPrice = basePriceTotal + extrasTotal;

  // Use the infant commission rate for the total price
  const commissionRate = commissionRates.infant || 0;
  
  // Calculate commission on total price
  return (commissionRate / 100) * totalPrice;
};