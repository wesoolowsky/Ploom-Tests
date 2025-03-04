export const markets = {
    uk: {
      baseUrl: 'https://www.ploom.co.uk/en',
      shopLink: 'Shop',
    },
    pl: {
      baseUrl: 'https://www.ploom.pl/pl',
      shopLink: 'Sklep',
    },
  };
  
  export type Market = keyof typeof markets;