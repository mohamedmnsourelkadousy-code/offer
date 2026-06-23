export interface Offer {
  id: string;
  title: string;
  merchant: string;
  description: string;
  category: 'coffee' | 'tea' | 'dessert' | 'food' | 'drink' | 'other';
  imageUrl: string;
  bgColor: string;
  textColor: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  isUsed: boolean;
  usedAt?: string;
}

export interface WalletPass {
  id: string;
  offerId: string;
  serialNumber: string;
  addedAt: string;
  platform: 'apple' | 'google';
}
