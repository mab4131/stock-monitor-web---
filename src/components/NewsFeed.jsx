import { useQuery } from 'react-query';
import { Paper, Title, Text, Loader, Stack, Anchor } from '@mantine/core';
import axios from 'axios';

const FINNHUB_API_KEY = 'YOUR_FINNHUB_API_KEY'; // Replace with your API key

function NewsFeed() {
  const { data, isLoading, error } = useQuery(
    'marketNews',
    async () => {
      const response = await axios.get(
        `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`
      );
      return response.data;
    },
    {
      refetchInterval: 60000, // Refetch every minute
    }
  );

  if (isLoading) return <Loader />;
  if (error) return <Text color="red">Error loading news</Text>;
  if (!data) return <Text>No news available</Text>;

  return (
    <Paper shadow="xs" p="md" withBorder>
      <Title order={2} mb="md">Market News</Title>
      <Stack spacing="md">
        {data.slice(0, 10).map((item) => (
          <Paper key={item.id} p="sm" withBorder>
            <Title order={3} size="h4">{item.headline}</Title>
            <Text size="sm" mt="xs" lineClamp={3}>
              {item.summary}
            </Text>
            <Text size="xs" color="dimmed" mt="xs">
              {new Date(item.datetime * 1000).toLocaleString()}
            </Text>
            <Anchor href={item.url} target="_blank" size="sm">
              Read more
            </Anchor>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}

export default NewsFeed;
