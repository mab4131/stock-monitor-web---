import { useQuery } from 'react-query';
import { SimpleGrid, Paper, Title, Text, Loader, Button } from '@mantine/core';
import axios from 'axios';

const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;
const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'AMD'];

async function fetchStockData() {
  if (!RAPID_API_KEY) {
    throw new Error('API key not configured');
  }

  const options = {
    method: 'GET',
    url: 'https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/AAPL,MSFT,GOOGL,AMZN,META,NVDA,TSLA,AMD',
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const stockData = {};
    
    response.data.forEach(stock => {
      stockData[stock.symbol] = {
        volume: stock.volume || 0,
        change: ((stock.regularMarketPrice - stock.regularMarketPreviousClose) / stock.regularMarketPreviousClose * 100).toFixed(2)
      };
    });

    return { volumes: stockData };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
}

function StockGrid() {
  const { data, isLoading, error } = useQuery(
    'stockData',
    fetchStockData,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      retry: 3
    }
  );

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <Loader size="xl" />
    </div>
  );

  if (error) return (
    <Text color="red" align="center" size="lg" p="xl">
      Error loading stock data: {error.message}
    </Text>
  );

  if (!data?.volumes) return (
    <Text align="center" size="lg" p="xl">
      No stock data available
    </Text>
  );

  return (
    <SimpleGrid cols={3} spacing="lg" breakpoints={[
      { maxWidth: 'md', cols: 2 },
      { maxWidth: 'sm', cols: 1 }
    ]}>
      {Object.entries(data.volumes).map(([symbol, info]) => (
        <Paper
          key={symbol}
          shadow="xs"
          p="md"
          withBorder
          style={{ cursor: 'pointer' }}
          onClick={() => window.open(`https://finance.yahoo.com/quote/${symbol}`, '_blank')}
        >
          <Title order={2}>{symbol}</Title>
          <Text size="lg">Volume: {info.volume.toLocaleString()}</Text>
          <Text color={info.change >= 0 ? 'green' : 'red'} size="lg">
            Change: {info.change}%
          </Text>
          <Button
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            component="a"
            href={`https://finance.yahoo.com/quote/${symbol}`}
            target="_blank"
          >
            View on Yahoo Finance
          </Button>
        </Paper>
      ))}
    </SimpleGrid>
  );
}

export default StockGrid;
